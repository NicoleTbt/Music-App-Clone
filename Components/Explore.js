import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Pressable,
  StatusBar
} from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as MailComposer from 'expo-mail-composer';
import { useDispatch, useSelector } from 'react-redux'

const Explore=({navigation,route})=>{
    const userid = useSelector((state) => state.userid); 
    const genInfos = useSelector((state) => state.genInfos); 


    const [MessageofTheday, setMessageofTheday] = useState('');
    useEffect(() => {
      const determineTimeOfDay = () => {
        const currentHour = new Date().getHours();
  
        if (currentHour >= 5 && currentHour < 12) {
          setMessageofTheday("Good morning! Ready to start your day with some upbeat tunes?");
        } else if (currentHour >= 12 && currentHour < 17) {
          setMessageofTheday("Good afternoon! Time for a musical break to boost your energy!");
        } else if (currentHour >= 17 && currentHour < 21) {
          setMessageofTheday("Good evening! Set the mood for a relaxing night with your favorite melodies.");
        } else {
          setMessageofTheday("Good night! Wrap up your day with some soothing melodies for a peaceful night's sleep.");
        }
      };
  
      determineTimeOfDay();
    }, []);
  
    const handlePressButtonAsync = async () => {
      try {
        let result = await WebBrowser.openBrowserAsync('https://open.spotify.com/?');
        console.log('Web browser result:', result);
      } catch (error) {
        console.error('Error opening web browser:', error);
      }
    };
  
    const handleEmailIconClick = () => {
      const emailTo = '343finalp@gmail.com'; // Replace with the recipient's email address
      const emailSubject = 'Enter the subject of the email';
  
      MailComposer.composeAsync({
        recipients: [emailTo],
        subject: emailSubject,
      });
    };

    const renderIconBox = (iconName, text, onPressFunction) => (
      <View style={styles.iconBox}>
        <Pressable onPress={onPressFunction}>
          {iconName === 'account' ? (
            <Avatar.Icon size={70} icon={iconName} style={styles.icon} />
          ) : (
            <Icon name={iconName} color="#7c238c" size={70} style={styles.icon} />
          )}
        </Pressable>
        <Text style={styles.boxText}>{text}</Text>
      </View>
    );
  

    return(
      <ScrollView style={styles.container}>
      <Image
         source={{ uri: 'https://preview.redd.it/o5wg6bv3bpb71.jpg?auto=webp&s=9f310bb3e2fe833253fb28295ec870a0d7aed957' }} // Replace with the actual URL of your image
         style={styles.image}
       /> 
       <View style={styles.header}>
         <Text style={styles.message}>{MessageofTheday}</Text>
       </View>
 
       {renderIconBox('account', 'Your Settings',  () => navigation.navigate('Settings'))} 
       {renderIconBox('favorite', 'Your Likes', () => navigation.navigate('LikesScreen'))}
       {renderIconBox('language', 'Our Website', handlePressButtonAsync)}
       {renderIconBox('email', 'Contact Us', handleEmailIconClick)}
  
     </ScrollView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 3,
    borderRadius: 20,
  },
  message: {
    color: '#7c238c',
    fontSize: 18,
    textAlign: 'center',
    fontWeight:'600',
    fontStyle: 'italic',
    marginTop: 20,
  },
  iconBox: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop:10,

    borderColor: '#d9d9d9',
  },
  image: {
    width: '100%',
    height: 200, // Adjust the height as needed
    resizeMode: 'cover',
  },
  icon: {
    marginBottom: 5,
  },
  boxText: {
    fontWeight:"600",
    fontSize: 17,
  },
});


export default Explore