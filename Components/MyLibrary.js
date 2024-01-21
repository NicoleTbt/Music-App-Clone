import { SafeAreaView, Button, Text, Pressable, View, Image, Modal, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOpenList } from '../redux/actions'
import { getFirestore, doc, updateDoc, arrayUnion, setDoc, query, where, getDoc, collection, deleteField, arrayRemove } from 'firebase/firestore'

import { app } from '../FireBase/config';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FetchTrackById } from './FetchTrackById';
import MiniPlayer from './miniPlayer';


const firestore = getFirestore(app);

//SongBox that allows to liked or disliked / remove the song from the playlist//
const SongBox = ({ Songid, KeyListname, accessToken }) => {


  const [trackDetail, setTrackDetail] = useState(null);



  const [liked, setLiked] = useState(false)
  const userid = useSelector((state) => state.userid);

  //function checks if the song is in the defaultAppLikes to render//

  const checkIfLiked = async () => {
    try {
      const userDocRef = doc(firestore, 'usersPlayLists', userid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        // Check if Songid is in the defaultAppLikes songs array//
        if (userData.defaultAppLikes?.songs?.includes(Songid)) {
          setLiked(true);
        }
      }
    } catch (error) {
      console.error('Error checking if song is liked:', error);
    }
  }

  useEffect(() => {
    checkIfLiked();
  }, [Songid, userid, firestore])


  //function to remove song from playlist in FB//
  function removeSfromPlaylist() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)
    updateDoc(userDocRef, {
      [`${KeyListname}.songs`]: arrayRemove(Songid),
    })
      .then(() => {
        console.log('Song successfully deleted!')

      })
      .catch((error) => {
        console.error('Error deleting song: ', error)
      })
  }

  //FB function to like a song in FB//

  function LikeSong() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [`defaultAppLikes.songs`]: arrayUnion(Songid),
    })
      .then(() => {
        console.log('Document successfully updated!')
        setLiked(true)
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })
  }

  function DisLike() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [`defaultAppLikes.songs`]: arrayRemove(Songid),
    })
      .then(() => {
        console.log('Song successfully deleted!')
        setLiked(false)
      })
      .catch((error) => {
        console.error('Error deleting song: ', error)
      })
  }


  useEffect(() => {
    const getSongDetails = async () => {
      try {
        const details = await FetchTrackById(Songid, accessToken);
        console.log('Details:', details);
        setTrackDetail(details);
      } catch (error) {
        console.error('Error getting details:', error);
      }
    };

    getSongDetails();
  }, [Songid, accessToken]);

  return (
    <View style={styles.playlistItem}>

      <View style={styles.songidCt}>
        <Text style={styles.selectedPlaylistText}>{Songid}</Text>
      </View>

      {!liked &&
        <Pressable style={styles.removeButton} onPress={LikeSong}><Icon name="heart-o" size={20} color="#8e44ad" /></Pressable>}
      {liked && <Pressable style={styles.removeButton} onPress={DisLike}><Icon name="heart" size={20} color="purple" /></Pressable>}

      <Pressable style={styles.removeButton} onPress={removeSfromPlaylist}>
        <Icon name="trash" size={20} color="#8e44ad" />
      </Pressable>

    </View>
  )
}


//
const SongsList = () => {
  const songobj = useSelector((state) => state.openList)

  const songList = songobj.songs

  const songlistname = songobj.nameplay

  const mapArr = songList.map((sid) => {
    return (
      <SongBox key={sid} Songid={sid} KeyListname={songlistname} />
    )
  })

  return (
    <SafeAreaView>

      <Text style={styles.selectedPlaylistTitle}>{songlistname}</Text>

      <ScrollView style={styles.selectedPlaylist}>{mapArr}</ScrollView>

    </SafeAreaView>
  )
}



//Playlost component once preseed opens a modal that shows the songs //
const PLaylists = ({ listObj, setOpenModal }) => {

  const userid = useSelector((state) => state.userid);
  const dispatch = useDispatch();

  //function to remove playlist from datbase//
  function removePlaylist() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [listObj.nameplay]: deleteField(),
    })
      .then(() => {
        console.log('Playlist successfully deleted!')
      })
      .catch((error) => {
        console.error('Error deleting playlist: ', error)
      })
  }

  return (

    <View style={styles.playlistItem}>

      <Pressable onPress={() => { dispatch(setOpenList(listObj)), setOpenModal(true) }}>
        <Text style={styles.playlistText}>{listObj.nameplay}</Text>
      </Pressable>

      <Pressable style={styles.removeButton} onPress={removePlaylist}>
        <Icon name="trash" size={20} color="#8e44ad" />
      </Pressable>

    </View>

  )
}


const MyLibrary = () => {

  const userid = useSelector((state) => state.userid);
  const AllPlays = useSelector((state) => state.playlists);



  const [openModal, setOpenModal] = useState(false)
  const [openPlayModal, setOpenPlayModal] = useState(false)
  const [NewP, setNew] = useState()



  function AddPlaylist(playlistName) {
    const userDocRef = doc(firestore, 'usersPlayLists', userid)

    updateDoc(userDocRef, {
      [playlistName]: { nameplay: playlistName, songs: [] },
    })
      .then(() => {
        console.log('Document successfully updated!')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })
  }

  const mapLists = AllPlays.map((obj) => {
    return (
      <PLaylists key={obj.nameplay} listObj={obj} setOpenModal={setOpenPlayModal} />
    )
  }
  )


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>

        <Text style={styles.headerText}>My Playlists</Text>

        <View style={styles.addButtonContainer}>
          <Pressable style={styles.addButton} onPress={() => setOpenModal(true)}>
            <>
              <Icon name="plus" size={20} color="white" />
              <Text style={styles.largeButtonText}>Add Playlist</Text>
            </>
          </Pressable>
        </View>

        <ScrollView style={styles.playlistContainer}>{mapLists}</ScrollView>

      </View>

      {openPlayModal &&
        <Modal transparent={true} animationType="slide">

          <View style={styles.playModal}>

            <Pressable onPress={() => setOpenPlayModal(false)}>
              <Icon name="arrow-left" size={20} color="#8e44ad" />
            </Pressable>

            <SongsList />

          </View>

        </Modal>
      }
      {openModal &&
        <Modal transparent={true} animationType="slide">
          <View style={styles.addModal}>

            <TextInput placeholder='Enter playlist name' style={styles.input} placeholderTextColor="#8c8c8c" onChangeText={(event) => setNew(event)} />

            <View style={styles.buttonRow}>

              <Pressable style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed ? 0.6 : 1 },
              ]} onPress={() => { console.log(NewP); AddPlaylist(NewP); setOpenModal(false) }}>
                <>
                  <Icon name="check" size={25} color="#8e44ad" />
                  <Text style={styles.purpleButtonText}>Save</Text>
                </>
              </Pressable>

              <Pressable style={({ pressed }) => [
                styles.cancelButton,
                { opacity: pressed ? 0.6 : 1 },
              ]} onPress={() => { setOpenModal(false) }}>
                <>
                  <Icon name="times" size={25} color="#8e44ad" />
                  <Text style={styles.purpleButtonText}>Cancel</Text>
                </>
              </Pressable>

            </View>

          </View>
        </Modal>
      }
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    padding: 16,
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: '#8e44ad',
    marginBottom: 16,
    marginTop: 16,
  },
  playlistContainer: {
    flexDirection: 'column',
  },
  playlistItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    elevation: 3,
  },
  playlistText: {
    fontSize: 20,
    color: '#4a4a4a',
  },
  removeButton: {
    padding: 10,
  },
  largeButtonText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 8,
  },
  addButtonContainer: {
    marginTop: 16,
  },
  addButton: {
    backgroundColor: '#8e44ad',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  playModal: {
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 10,
    borderRadius: 8,
  },
  selectedPlaylistTitle: {
    color: '#4a4a4a',
    fontSize: 25,
    fontWeight: "500",
    margin: 15,
    textAlign: 'center'
  },
  selectedPlaylistText: {
    color: '#4a4a4a',
    fontSize: 16,
    fontWeight: "300",

  },
  songidCt: {
    width: '70%',
    overflow: 'hidden',
  },
  selectedPlaylist: {
    height: "80%",
  },
  addModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    color: 'purple',
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleButtonText: {
    color: '#8e44ad',
    fontSize: 20,
    marginLeft: 8,
  },
});



export default MyLibrary