// SongItem.js
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import {Player} from './Player';

const SongItem = ({tracks, accessToken}) => {

  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [isPlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [isListModalVisible, setListModalVisible] = useState(false);

  const toggleSelectedSongIndex = (songIndex) => {
    setSelectedSongIndex(songIndex);
    setPlayerModalVisible(true);
  };

  const closeModal = () => {
    setPlayerModalVisible(false);
    setSelectedSongIndex(null);
  };

  const handleLike = () => {
    const selectedSong = tracks[selectedSongIndex];

    if (selectedSong) {
      Alert.alert(`Liked: ${selectedSong.name}`);
    }
  };

  const handleAdd = () => {
    setListModalVisible(true);
  };


  const handlePrevious = () => {
    if (selectedSongIndex > 0) {
      setSelectedSongIndex(selectedSongIndex - 1);

    }
    console.log('pre');
  };

  const handleNext = () => {
    if (selectedSongIndex < tracks.length - 1) {
      setSelectedSongIndex(selectedSongIndex + 1);
      console.log('next');
    }
  };

  return (
    <View>
      <FlatList
        style={styles.flatList}
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => toggleSelectedSongIndex(index)}>
            <View style={selectedSongIndex === index ? styles.selectedText : styles.text}>
              <Image source={{ uri: item.album.images[2].url }} style={styles.albumImage} />
              <View style={styles.textContainer}>
                <Text style={styles.songText}>
                  {item.name} by {item.artists.map(artist => artist.name).join(', ')}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Icon name="favorite-border" type="material" size={24} color="#8e44ad" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAdd(item.id)}>
                  <Icon name="add" type="material" size={24} color="#8e44ad" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isPlayerModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backArrow} onPress={() => closeModal()}>
            <Icon name="chevron-left" type="material" size={24} color="#8e44ad" />
          </TouchableOpacity>
          <Player accessToken={accessToken}
            tracks={tracks}
            selectedSongIndex={selectedSongIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </View>
      </Modal>
      
      {isListModalVisible ? (
          <View style={{height:'50%'}}>
            <TouchableOpacity onPress={() => setListModalVisible(false)}>
              <Text>Swipe down to close</Text>
            </TouchableOpacity>
          </View>
      ): null}
      
    </View>
  );
};

const styles = {
  flatList: {
    backgroundColor: 'white',
  },
  text: {
    backgroundColor: '#fafafa',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items with space in between
    alignItems: 'center',
  },
  selectedText: {
    backgroundColor: 'grey',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items with space in between
    alignItems: 'center',
  },
  textContainer: {
    flex: 1, // Take available space
  },
  songText: {
    flex: 1, // Take available space
    marginRight: 10, // Add margin between text and buttons
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Add padding to give space for the chevron-left icon
  },
  backArrow: {
    position: 'absolute',
    top: 15, // Adjust top as needed
    left: 20, // Adjust left as needed
  },
  albumImage: {
    width: 50,
    height: 50,
    marginRight: 10, // Adjust margin as needed
  },
};

export default SongItem;
