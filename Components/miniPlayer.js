import {Text, View, StyleSheet, Image, TouchableOpacity,} from 'react-native';
import { Icon } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const miniPlayer = ({trackDetail}) =>
{
  const [sound, setSound] = useState(null);

    const playSong = async () => {
        try {
          if (sound) {
            await sound.unloadAsync();
          }
    
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: trackDetail.preview_url },
            { shouldPlay: true },
            //onPlaybackStatusUpdate
          );
    
          setSound(newSound);
        } catch (error) {
          console.error('Error playing the song:', error);
        }
      };
    
      const stopSong = async () => {
        try {
          if (sound) {
            await sound.stopAsync();
          }
        } catch (error) {
          console.error('Error stopping the song:', error);
        }
      };

      const [play , setplay]=useState(false)


return(
    <View style={styles.containerModal} >

        <Image source={{ uri: trackDetail.album.images[0].url }} style = {styles.coverImage} />

        <Text style = {styles.songName}>{trackDetail.name}</Text>
        <Text style = {styles.artistName}>{trackDetail.artists.map(artist => artist.name).join(', ')}</Text>

        <View style = {styles.controls}>
          {!play && 
            <TouchableOpacity style={styles.playButton} onPress={() => {playSong() ; setplay(true)}}>
                <Icon name="play-arrow" type="material" size={40} color="white" />
            </TouchableOpacity>
            }
          {play &&
            <TouchableOpacity style={styles.pauseButton} onPress={() =>{ stopSong(); setplay(false) }}>
                <Icon name="pause" type="material" size={40} color="white" />
            </TouchableOpacity>
}

        </View>


    </View>
);
};

const styles = StyleSheet.create({
buttonContainer: {
    flexDirection: 'row',
  },
  containerModal: {
    height: '70%',
    width:'100%',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ecf0f1', 
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  coverImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    marginBottom: 20,
  },
  songName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8e44ad',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 20,
    color: '#808080', 
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  playButton: {
    backgroundColor: '#8e44ad', 
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 50,
  },
  pauseButton: {
    backgroundColor: '#8e44ad', 
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 60, 
  },
})

export default miniPlayer;