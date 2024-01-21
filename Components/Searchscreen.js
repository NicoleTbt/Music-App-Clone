import { SafeAreaView, Pressable, Text, View, Modal, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'

import { getFirestore, doc, updateDoc, arrayUnion, setDoc, query, where, getDoc, collection, deleteField, arrayRemove, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { app } from '../FireBase/config';
import { Player } from '../Components/Player'

const auth = getAuth(app);
const firestore = getFirestore(app);

import FetchToken from './FetchToken';
import { SearchTrack } from './SearchTrack';

//APP //

const SearchScreen = () => {

  const userid = useSelector((state) => state.userid);
  const playlistNames = useSelector(state => state.playlistNames);

  const [songToAdd, setSongToAdd] = useState()
  const [isListModalVisible, setListModalVisible] = useState(false)

  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);

  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [isPlayerModalVisible, setPlayerModalVisible] = useState(false);

  const token = useSelector((state) => state.token);


  const playNameArr = playlistNames.map((name) => {
    return (
      <TouchableOpacity key={`playname_${name}`} onPress={() => handleAdd(name, songToAdd)}>
        <Text style={styles.names}>{name}</Text>
      </TouchableOpacity>
    )
  })


  const handlePrevious = () => {
    if (selectedSongIndex > 0) {
      setSelectedSongIndex(selectedSongIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedSongIndex < tracks.length - 1) {
      setSelectedSongIndex(selectedSongIndex + 1);
    }
  };



  let timeoutId;



  const toggleSelectedSongIndex = (songIndex) => {
    setSelectedSongIndex(songIndex);
    setPlayerModalVisible(true)
  };


  const closeModal = () => {
    setPlayerModalVisible(false);
    setSelectedSongIndex(null);
  };

  const search = async (text) => {
    try {
      const tr = await SearchTrack(text, token);
      setTracks(tr);
      setSelectedSongIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearch = (text) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      search(text);
    }, 300);
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text === '') {
      setTracks([]);
    } else {
      debouncedSearch(text);
    }
  }

  const handleLike = (Songid) => {

    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [`defaultAppLikes.songs`]: arrayUnion(Songid),
    })
      .then(() => {
        console.log('Document successfully updated!')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })

  }

  function handleAdd(playlistName, Songid) {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [`${playlistName}.songs`]: arrayUnion(Songid),
    })
      .then(() => {
        console.log('Document successfully updated!')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })

    setListModalVisible(false)
  }


  {/**Main Container */ }

  return (

    <SafeAreaView>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <View style={styles.container}>
          <View style={styles.searchView}>
            <View style={styles.inputView}>
              <TextInput
                defaultValue={query}
                style={styles.input}
                placeholder='Search for a song'
                textContentType='name'
                onChangeText={handleSearch}
                returnKeyType='search'
              />
              {tracks.length === 0 ? (
                <TouchableOpacity>
                  <Icon name='search' size={24} color='#8e44ad' />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('');
                    setTracks([]);
                  }}
                >
                  <Icon name='cancel' size={24} color='#8e44ad' />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {tracks.length > 0 ? (
            <FlatList
              style={styles.flatList}
              data={tracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => toggleSelectedSongIndex(index)} >
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

                      <TouchableOpacity onPress={() => {
                        setListModalVisible(true); setSongToAdd(item.id); console.log('modalopen');
                      }}>
                        <Icon name="add" type="material" size={24} color="#8e44ad" />
                      </TouchableOpacity>


                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : null}
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
              <Player accessToken={token}
                tracks={tracks}
                selectedSongIndex={selectedSongIndex}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </View>
          </Modal>
          {isListModalVisible ? (

            <View style={{ height: '100%' }}>
              <Text style={styles.message}>Please Select A Playlist:</Text>
              {playNameArr}

              <Pressable onPress={() => setListModalVisible(false)}><Text style={styles.cancel}>Cancel</Text></Pressable>
            </View>

          ) : null}

        </View>
      </View>
    </SafeAreaView>
  );
}

export default SearchScreen


const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  flatList: {
    backgroundColor: 'red',
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
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: '#dfe4ea',
    paddingHorizontal: 10,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  names: {
    margin: 10,
    color: '#8e44ad',
    fontWeight: '400',
    fontSize: 19,
  },
  message: {
    textAlign: 'center',
    margin: 20,
    color: '#8e44ad',
    fontWeight: '500',
    fontSize: 22,
  },
  cancel: {
    textAlign: 'center',
    margin: 20,
    color: '#8e44ad',
    fontWeight: '500',
    fontSize: 18,
  },
});
