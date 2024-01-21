import {SafeAreaView, TextInput, Text, Pressable, View, StyleSheet} from 'react-native'
import { useState, useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore} from 'firebase/firestore'
import { collection, addDoc, setDoc, doc } from "firebase/firestore"

import {app} from '../FireBase/config'
import { useDispatch } from 'react-redux'
import { setLogged } from '../redux/actions'
const auth = getAuth(app);
const firestore = getFirestore(app)


//box component//
const InputBoxes=({title , setstate})=>{
    return(
    <View>
        <Text style={styles.inputtitle} >{title}</Text>
        <TextInput  style={styles.inputField} onChangeText={(text)=>setstate(text)} /> 
    </View>
    )
}


//Sign up step2 set mail & pass//
const Mail_pass=({setSignup , setSUid , register, createDef, navigation})=>{

   const [email, setEmail]= useState("")

   const [empty, setEmpty]= useState(false)
   const [errorCode, setErrorCode]=useState("")
   const [registered, setRegistered]=useState(false)

   const [password, setPassword]= useState("")

   const [sizec, setSizec]= useState(false)
   const [specialCharc, setSpecialCharc]=useState(false)
   const [upperCasec, setUpperCasec]=useState(false)
   const [numberc, setNumberc]=useState(false)

   
   const [SUenable, setSUenabel]=useState(false)
   const [Scolor, setScolor]=useState(false)
   const[met , setMet]=useState(false);


   const upp = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/; 
   const spchar = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/; 
   const digits= /[0123456789]/

//checks if the password has all required fields to enable the sign up button//
 function checkPass (){

   if(password.length >= 8) {
     setSizec(true)
   } else {
     setSizec(false)
   }
  
   let hasUpperCase = false;
   for(let i = 0; i < password.length; i++) {
     if (upp.test(password[i])) {
       hasUpperCase = true
       break
     }
   }
   setUpperCasec(hasUpperCase)
  
   let hasSpecialChar = false
   for(let i = 0; i < password.length; i++) {
     if (spchar.test(password[i])) {
       hasSpecialChar = true
       break
     }
   }
   setSpecialCharc(hasSpecialChar)
  
   let hasNumber = false
   for(let i = 0; i < password.length; i++) {
     if (digits.test(password[i])) {
       hasNumber = true
       break
     }
   }
   setNumberc(hasNumber)
  }

   //the use effect is to change the password conditions color directly on change of input without the state update delay //
   useEffect(() => {
    checkPass()
    if(sizec && specialCharc && upperCasec && numberc) {setSUenabel(true) ; setScolor('blue'); setMet(true)}
    else {setSUenabel(false); setScolor('red'); setMet(false)}
    
  }, [password])

  //function to check if the email has any authentication errors commming from firebase //
  
  async function checkEmail (){
 setEmpty(false);
 setRegistered(false);
 setErrorCode('')

 if (email === '') {
   setEmpty(true)
   return
 }
 try {
   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   setRegistered(true)
   setSUid(userCredential.user.uid)
 } catch (error) {
   const errorCode = error.code
   setErrorCode(errorCode)
 }
}

//function to take the user back to log in page//

function reg(){
  register()
  createDef()
  setSignup(false)
}


//2nd step sign up //

   return(
<View style={styles.infoContainer}>
<Text style={styles.pageTitle}>SIGN UP</Text>
<InputBoxes title='Email' setstate={setEmail}/>
<InputBoxes title='Password' setstate={setPassword}/>

<View style={{margin:15}}>
<Text style={styles[sizec ? 'CorrectField' : 'IncorrectField']}>8 Characters minimum</Text>
<Text style={styles[specialCharc ? 'CorrectField' : 'IncorrectField']}>Contains at least 1 Special Character !@$%...</Text>
<Text style={styles[numberc ? 'CorrectField' : 'IncorrectField']}>Contains at least 1 number</Text>
<Text style={styles[upperCasec ? 'CorrectField' : 'IncorrectField']}>Contains at least 1 UpperCase character</Text>
</View>

<Pressable disabled={!SUenable} onPress={checkEmail} style={{backgroundColor:{Scolor}}}>
<Text  style={styles.buttonText}>Sign Up</Text>
</Pressable>

{!met &&
<Text>All Requirements Should Be Met!</Text>
}
<Text style={styles[empty ? 'ShowError':'HideError']}>Email cannot be empty</Text>
<Text>{errorCode}</Text>

<Pressable style={styles[registered ? 'ShowError':'HideError']} onPress={reg}>
<Text style={{marginTop:15, fontSise:'15'}}>Sign Up Succesful! Please Log In!</Text>
</Pressable>
</View>
   )
}

////////////////////////////////////////

 //Sign up Main Container//
 const SignUp=({setSignup })=>{
  
   const [username, setUsername]=useState("")
   const [firstname, setFirstname]=useState("")
   const [lastname, setLastname]=useState("")
   const [phone, setPhone]=useState("")
   const [gender, setGender]=useState("")
   const [err , setErr]=useState(true)
   const [checkGen  ,setCheckGen ]= useState(false)  
   const [SUid, setSUid]=useState('')

   const dispatch=useDispatch()

   function checkGenFields(){ if(username != '' && firstname != '' && lastname != '' && phone != '' && gender != '') setCheckGen(true)  }

   useEffect(() => {
    if(username != '' && firstname != '' && lastname != '' && phone != '' && gender != '')setErr(false)
    else setErr(true)
  
  }, [username , firstname , lastname, phone, gender]);


  async function register() {
    try {
    
      const docRef = await setDoc(doc(collection(firestore, "users"), SUid), {
        username: username,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        gender: gender,
      })
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }
  
//function to create the default user table on successfull sign up //
function createDefaultPlay() {
  const userDocRef = doc(firestore, 'usersPlayLists', SUid)

  setDoc(userDocRef, {
    defaultAppLikes: {nameplay: 'defaultAppLikes', songs: [] },
})
    .then(() => {
      console.log('Document successfully written!')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
}


   return(
     <SafeAreaView style={styles.container}>

      {!checkGen &&
       <View style={styles.infoContainer}>
      <Text style={styles.pageTitle}>Sign Up</Text>
      <InputBoxes title='Username' setstate={setUsername}/>
      <InputBoxes title='Firstname' setstate={setFirstname}/>
      <InputBoxes title='Lastname' setstate={setLastname}/>
      <InputBoxes title='Phone' setstate={setPhone}/>
      <InputBoxes title='Gender' setstate={setGender}/>
   
       <Pressable onPress={checkGenFields}>
    <Text  style={styles.buttonText}>Continue</Text>
    </Pressable>

    
    <Text style={styles[err?'ShowError':'HideError']}>Please fill all required fields to continue!</Text> 
 

    </View>
      }
  {checkGen &&
  <Mail_pass setSignup={setSignup} setSUid={setSUid} register={register} createDef={createDefaultPlay} />
   }

 </SafeAreaView>)
 
  }
  



//styles//
const styles = StyleSheet.create({
  HideError: {
    display: 'none'
  },
  inputField: {
   borderRadius: 10,
   borderWidth: 1.5,
   height: 40,
   padding: 10,
   marginBottom: 15,
 },
 inputtitle: {
   color: '#7c238c',
   fontSize: 14,
   paddingBottom: 5,
   fontWeight: "500",
   marginTop: 5,
 },
 button: {
   marginTop: 20,
   paddingVertical: 10,
   paddingHorizontal: 20,
   borderRadius: 10,
   backgroundColor: '#7c238c',
   alignSelf: 'flex-start',
 },
 buttonText: {
   color: '#7c238c',
   fontSize: 16,
   fontWeight: "700",
   margin:'auto'
 },
  pageTitle: {
   marginTop: 30,
   color: '#7c238c',
   fontSize: 30,
   fontWeight: "500",
   alignSelf: 'center',
   marginBottom:10
 },
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
   borderWidth: 2,
   borderRadius: 6,
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
  ShowError: {
    color: 'black',
    fontSize: 14,
    fontStyle:'italic',
    marginTop:10
    
  },
  IncorrectField: {
     color:'black',
     fontSize: 12,
     fontStyle:'italic',
   },
   CorrectField: {
     color:'#23677c',
     fontSize: 12,
     fontStyle:'italic',
   },
   cancel:{
    marginTop:30,
   },
})


  export default SignUp
  

