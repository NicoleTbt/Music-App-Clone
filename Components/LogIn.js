import {SafeAreaView, TextInput, Text, Pressable, View, StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, doc, getDoc } from "firebase/firestore"

import { useSelector, useDispatch } from 'react-redux';
import { setGenInfos, setLikearr, setPlaylistNames, setPlaylists, setUserId, setLogged } from '../redux/actions.js';

import {app} from '../FireBase/config'

const auth = getAuth(app);

//box design//
const InputBoxes=({title , setstate})=>{
    return(
      <View style={styles.inputBox}>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput style={styles.inputField} onChangeText={(text) => setstate(text)} />
    </View>
    )
}


//component//

const LogIn=({setSignup})=>{

  
  const dispatch = useDispatch();


    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const [errorCode, setErrorCode]=useState("")

{/*Functions  */}
async function LIn(){
    setErrorCode("")
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        dispatch(setUserId(user.uid))
        dispatch(setLogged(true))

      } catch (error) {
        const errorCode = error.code
        setErrorCode(errorCode)
      }
}

function goSU(){
  setSignup(true)
}

{/*Render*/}
    return(
<SafeAreaView style={styles.container}>

    <View style={styles.infoContainer}>
    <Text style={styles.pagetitle}>Log In </Text>
      <InputBoxes title='Email' setstate={setEmail}/>
      <InputBoxes title='Password' setstate={setPassword}/>
    </View>

<Pressable onPress={LIn} style={styles.button}>
<Text style={styles.buttonText}>LogIn</Text>
</Pressable>

<Pressable style={styles.signupButton}>
<Text onPress={goSU}  style={styles.signupText}>Don't have an account? SignUp to our app!</Text>
</Pressable>

<Text style={styles.errorText}>{errorCode}</Text>

   
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
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    width: '80%',
    height:'200',
    borderWidth: 2,
    borderRadius: 6,
    display:"flex",
    justifyContent:'space-around',
    borderColor: '#d3d3d3',
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    shadowOpacity: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      height: 3,
      width: 3,
    },
    elevation: 5,
  },
  pagetitle: {
    marginTop: 10,
    marginBottom:15,
    color: '#7c238c',
    fontSize: 30,
    fontWeight: "600",
    alignSelf: 'center',
  },
  inputBox: {
    marginVertical: 15,
  },
  inputTitle: {
    color: '#7c238c',
    fontSize: 15,
    paddingBottom: 5,
    fontWeight: "500",
    marginTop: -10,
  },
  inputField: {
    borderRadius: 10,
    borderWidth: 1.5,
    height: 40,
    padding: 10,
    marginBottom: 0,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgb(174 90 189 )',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "700",
  },
  
  signupText: {
    color: 'black',
    fontSize: 16,
    fontWeight: "500",
    textAlign: 'center',
    marginTop:40,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize:14,
  },
});
export default LogIn
