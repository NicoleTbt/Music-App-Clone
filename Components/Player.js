import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, } from 'react-native';
import { Audio } from 'expo-av';
import { Icon } from 'react-native-elements';

const Player = ({ accessToken, tracks, selectedSongIndex, onPrevious, onNext }) => {
  const [sound, setSound] = useState(null);
  const [trackInfo, setTrackInfo] = useState(tracks[selectedSongIndex]);


  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        if (!accessToken || !trackInfo?.id) return;
  
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackInfo.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setTrackInfo(data);
        } else {
          console.error('Failed to fetch track information');
        }
      } catch (error) {
        console.error('Error fetching track information:', error);
      }
    };
  
    fetchTrackInfo();
  }, [accessToken, trackInfo?.id]);

useEffect(() => {
  console.log('Track Info:', trackInfo);
}, [trackInfo]);

  const playSong = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: trackInfo.preview_url },
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

  return (
    <View>
      {trackInfo && (
        <View style = {styles.container}>

          <Image source={{ uri: trackInfo.album.images[0].url }} style = {styles.coverImage} />
          
          <Text style = {styles.songName}>{trackInfo.name}</Text>
          
          <Text style = {styles.artistName}>{trackInfo.artists.map(artist => artist.name).join(', ')}</Text>
          
          <View style = {styles.controls}>

          {!play && 
            <>
            <TouchableOpacity style={styles.playButton} onPress={() => {playSong() ; setplay(true)}}>
              <Icon name="play-arrow" type="material" size={40} color="white" />
            </TouchableOpacity> 
            </>
            }
            {play &&
            <>
            <TouchableOpacity style={styles.pauseButton} onPress={() =>{ stopSong(); setplay(false) }}>
                <Icon name="pause" type="material" size={40} color="white" />
            </TouchableOpacity> 
            </>
            }

          </View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width:'100%',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    padding: 10,
    margin: 5,
  },
  coverImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  songName: {
    fontSize: 25,
    fontWeight: "700",
    color: '#8e44ad', 
    marginBottom: 8,
  },
  artistName: {
    fontSize: 20,
    color: '#808080', 
    marginBottom: 20,
  },
  controls: {
    width:'80%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#ecf0f1', 
    padding: 12,
    borderRadius: 50,
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
});

export {Player};
