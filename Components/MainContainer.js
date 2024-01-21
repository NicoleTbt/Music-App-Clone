import {SafeAreaView, Pressable, Text, View, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, StatusBar, Dimensions} from 'react-native';
import { useState , useEffect } from 'react';

import 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';


import { getFirestore, doc, updateDoc, arrayUnion , setDoc , query, where, getDoc ,collection, deleteField, arrayRemove, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../FireBase/config.js';
const auth = getAuth(app);
const firestore = getFirestore(app);


import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

import { createStackNavigator } from '@react-navigation/stack';

import SignUp from './SignUp.js'
import LogIn from './LogIn.js'
import Settings from './Settings.js';
import MyLibrary from './MyLibrary';
import LikesBox from './Like.js';
import Searchscreen from './Searchscreen.js';
import Explore from './Explore.js';
import FetchToken from './FetchToken.js';

import { useSelector, useDispatch, Provider } from 'react-redux';
import { setGenInfos, setLikearr, setPlaylistNames, setPlaylists, setToken } from '../redux/actions.js';

//Navigation functional components//


const StackEx=createStackNavigator()
const ExploreStack=()=>{



  return(
    <StackEx.Navigator screenOptions={{headerShown:false}}>
     <StackEx.Group>
      <StackEx.Screen name="Explore1" component={Explore} />
      </StackEx.Group>
      <StackEx.Group screenOptions={{ presentation: 'modal',headerShown:true }}>
          <StackEx.Screen name="Settings" component={Settings} />
        </StackEx.Group>
    </StackEx.Navigator>
  )
}
const StackSet=createStackNavigator()




const StackLi=createStackNavigator()
const LibraryStack = () => {
  return (
    <StackLi.Navigator screenOptions={{headerShown:false}}>
    <StackLi.Screen name="Library" component={MyLibrary} />
      <StackLi.Screen name="Settings" component={Settings} />
    </StackLi.Navigator>
  );
};
const StackLikes=createStackNavigator()
const LikesScreen=()=>{
  return(
    <StackLikes.Navigator screenOptions={{headerShown:false}}>
    <StackLikes.Screen name="Likes" component={LikesBox} />
    </StackLikes.Navigator>
  )
}

const Tab = createMaterialBottomTabNavigator();
const LoginStack=createStackNavigator();

export const theme={
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    secondaryContainer:'transparent'
 
  },
}






//APP //

const MainContainer=()=> {
  
  const [fbplaylists , setFbPlaylists]=useState()
  const [likes , setLikes]=useState()
  
 
  const logged=useSelector((state)=>state.logged);
  const [signup , setSignup]=useState(false)

  const dispatch = useDispatch();
 
  const userid = useSelector((state) => state.userid);

  
  const client_id = "4f46b4861d9f4fa4b03c5a209fb49549";
  const client_secret = "7c3263f4d4164128b0429001b1431249";

  useEffect(() => {
  
    const getToken = async () => {
      try {
        const token = await FetchToken(client_id, client_secret);
        console.log('Access Token in Main Container:', token);
  
        dispatch(setToken(token))
  
      } catch (error) {
        console.error('Error setting token:', error);
      }
    };
    getToken();

  }, []);

  {/**get users gen infos */}
  async function getGenInf() {
    if (userid) {
      const userDocRef = doc(collection(firestore, "users"), userid);
  
      try {
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          dispatch(setGenInfos(userDoc.data()));
        } else {
          console.log(`User ${userid} not found`);
        }
      } catch (e) {
        console.error("Error getting user document:", e);
      }
    } else {
      console.log("User ID not available");
    }
  }

  console.log(userid)
  
  {/**get users playlists */}
  async function getUserPlaylists() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)
   
    try {
      const docSnapshot = await getDoc(userDocRef)
   
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data()
        setFbPlaylists(userData)
      } else {
        console.log('User document not found')
      }
    } catch (error) {
      console.error('Error getting playlists:', error)
    }
   }

  useEffect(()=>{
    if(userid !== undefined){
      getUserPlaylists()
    }
  },[userid])

  console.log(fbplaylists)

  //Firebase Snapshot function to rerender on database change//
  useEffect(() => {
    if (userid) {
      const userPlaylistsDocRef = doc(firestore, 'usersPlayLists', userid);
      const unsubscribe = onSnapshot(userPlaylistsDocRef, (snapshot) => {
        getUserPlaylists();
      });
      return () => unsubscribe();
    }
  }, [userid]);

  useEffect(() => {
    if (userid) {
      const userPlaylistsDocRef = doc(firestore, 'users', userid);
      const unsubscribe = onSnapshot(userPlaylistsDocRef, (snapshot) => {
        getGenInf();
      });
      return () => unsubscribe();
    }
  }, [userid]);

 

  {/**arrange the databse infos*/}
  useEffect(()=>{
    if(fbplaylists != undefined){
     const arr=[]
     const namearr=[]
      Object.entries(fbplaylists).forEach(([key, value]) => { arr.push(value)})

      console.log('array with likes', arr)
          const likeslist = "defaultAppLikes"
          const foundObjects = arr.find(obj => obj.nameplay === likeslist)
         console.log("found object: ", foundObjects)
          const updatedArray = arr.filter(obj => obj.nameplay !== likeslist)
          console.log('array without likes',updatedArray)
      
          updatedArray.forEach((value)=>{namearr.push(value.nameplay) })

      dispatch(setPlaylists(updatedArray))
      setLikes(foundObjects)  
      dispatch(setLikearr(foundObjects.songs)) 
      dispatch(setPlaylistNames(namearr) )

      console.log(foundObjects.songs)
      console.log(namearr)
    }
  },[fbplaylists])


  {/**Main Container */}

  return (

<NavigationContainer>

{/*LogIn: go to it directly when user not logged in */}
{!logged && !signup && <LogIn setSignup={setSignup} />  } 

{/*want to sign up before logIn, no account available */}
 {!logged && signup && <SignUp setSignup={setSignup} /> } 

{/*on succesfull logIn go to main navigation page*/}
{logged   &&   userid !== undefined &&  likes !==undefined && fbplaylists !==undefined &&

  <Tab.Navigator
inactiveColor="#000f08"
activeColor="#7c238c"
barStyle={{
  backgroundColor:'white',
  borderTopWidth:2,
  borderColor:'#7c238c',

}}
>
    
  <Tab.Screen name="Explore" component={ExploreStack} options={{
    tabBarLabel:'Explore',
    tabBarIcon:({focused})=>(
      <Icon name="explore" color={focused?"#7c238c":'#000f08'} size={24}/>
    )
  }} initialParams={{title:'hi'}} />


  <Tab.Screen name="Search" component={Searchscreen} options={{
    tabBarLabel:'Search',
    tabBarIcon:({focused})=>(
      <Icon name="search" color={focused?"#7c238c":'#000f08'} size={24}/>
    )}}
  />
  

  <Tab.Screen name="LibraryS" component={LibraryStack} options={{
    tabBarLabel:'Library',
    tabBarIcon:({focused})=>(
      <Icon name="book" color={focused?"#7c238c":'#000f08'} size={24}/>
    )}} 
  />


  <Tab.Screen name="LikesScreen" component={LikesScreen} options={{
    tabBarLabel:'Likes',
    tabBarIcon:({focused})=>(
      focused?( <Icon name="favorite" color="#7c238c" size={24} />):(
      <Icon name="favorite-border" color={'#000f08'} size={24}/>)
    )}} 
  />

</Tab.Navigator> }
  </NavigationContainer>
        
  )
    }

    
 


export default MainContainer