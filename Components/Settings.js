import {SafeAreaView, Pressable, Text, View, TextInput, StyleSheet} from 'react-native'

import { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux';
import { setGenInfos, setLikearr, setPlaylistNames, setPlaylists, setUserId, setLogged } from '../redux/actions.js';


import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { app } from '../FireBase/config'
import { signOut } from 'firebase/auth';
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

const firestore = getFirestore(app)

const OutputBoxes=({title, keyname , value, editable , setuserinf})=>{

    const update = (newval , prop) => {
        setuserinf((prevState) => ({
          ...prevState,   [prop]: newval,  
        }))
      }

      const internalStyle = {color: editable? 'black':'grey' , borderColor: editable? 'purple': 'grey' }

    return(
    <View style={styles.output}>
        <Text style={styles.titles}>{title}</Text>
        <TextInput style={{ ...internalStyle, ...styles.IObox }} readOnly={!editable} defaultValue={value} onChangeText={(text)=>update(text , keyname)}/>
    </View>
    )
}


const Settings =()=>{

    const userid = useSelector((state) => state.userid); 
  const genInfos = useSelector((state) => state.genInfos); 
  
 
    const[edit , setEdit]=useState(false)

    const[userinf , setuserinf]=useState({})

    const dispatch=useDispatch()

async function updateDb() {
    const docRef = doc(firestore, 'users', userid);
    await setDoc(docRef, userinf, { merge: true });

    setEdit(false)
   }

   const handleSignOut = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully")
    }).catch((error) => {
      console.log(error)
    // An error happened.
    });
}

const [sure , setSure]=useState(false)


return(
    <SafeAreaView style={styles.container}>

       <View style={styles.infoContainer}>
       <Text style={styles.pagetitle}>Settings</Text>

       <OutputBoxes title={'Username:'} keyname={'username'} value={genInfos.username} editable={edit} setuserinf={setuserinf}/>
       <OutputBoxes title={'First Name:'} keyname={'firstname'} value={genInfos.firstname} editable={edit} setuserinf={setuserinf} />
       <OutputBoxes title={"Last Name:"} keyname={'lastname'} value={genInfos.lastname} editable={edit} setuserinf={setuserinf} />
       <OutputBoxes title={"Phone:"} keyname={'phone'} value={genInfos.phone} editable={edit} setuserinf={setuserinf}/>
       <OutputBoxes title={"Gender"} keyname={'gender'} value={genInfos.gender} editable={edit} setuserinf={setuserinf}/>
      
       
       {!edit && <Pressable style={styles.editButton} onPress={()=>setEdit(true)} ><Text style={styles.buttonText}>edit</Text></Pressable>}
       {edit && <Pressable style={styles.editButton} onPress={updateDb}><Text style={styles.buttonText}>Save</Text></Pressable>}
       {!sure && <Pressable style={styles.logoutBtn}  onPress={()=>setSure(true)}><Text style={styles.buttonText}>Log Out?</Text></Pressable> }
       {sure && <View style={styles.sure}>
        <Text style={{textAlign:'center'}}>Are you sure you want to log out? </Text> 

        <View style={styles.confirm}> 
       <Pressable style={styles.logoutBtn}  onPress={()=>{dispatch(setLogged(false)); handleSignOut ; setSure(false)}}>
        <Text style={styles.buttonText}>Yes</Text>
        </Pressable>
       <Pressable style={styles.logoutBtn}  onPress={()=>setSure(false)}>
        <Text style={styles.buttonText}>No</Text>
        </Pressable>
        </View>

        </View>
       }
       </View>
    
    </SafeAreaView>
)

}





const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(233 227 234)',
    },
    pagetitle: {
      marginTop: 20,
      marginBottom:20,
      color: '#7c238c',
      fontSize: 30,
      fontWeight: "600",
      alignSelf:'center'
    },
    infoContainer: {
      backgroundColor:'white',
      margin: 20,
      width: '80%',
      borderWidth:2,
      borderRadius:6,
      borderColor:'#d3d3d3',
      paddingBottom:10,
      paddingLeft:20,
      paddingRight:20,
      shadowOpacity:0.5,
      shadowColor:'#000',
      shadowOffset:{
          height:3,
          width:3,
      },
      elevation:5,
  
    },
    output: {
      marginVertical: 15,
    },
    titles: {
      color: '#7c238c',
      fontSize: 15,
      paddingBottom:5,
      fontWeight: "500",
      marginTop:-10
    },
    IObox: {
      borderRadius: 10,
      borderWidth: 1.5,
      height: 40,
      padding: 10,
  marginBottom:0,
    },
    editButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 3,
      backgroundColor: 'rgb(233 227 234)',
      alignSelf:'center'
    },
    logoutBtn:{
      color:'#7c238c',
      marginTop:10,
    },
    buttonText: {
      color: '#7c238c',
      fontSize: 16,
      fontWeight: "700",
    },
    confirm:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-around'
    },
    sure:{
      marginTop:20,
    },
  });
  




export default Settings

