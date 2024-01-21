import {SafeAreaView, Pressable, Text, View, StyleSheet, Image, TouchableOpacity, Modal} from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { app } from '../FireBase/config';
import {FetchTrackById} from './FetchTrackById';
import MiniPlayer from './miniPlayer';
import Icon from 'react-native-vector-icons/Ionicons';

const firestore = getFirestore(app);

import { useSelector, useDispatch } from 'react-redux';



// Song Boxes //
const LikeSongBox = ({ Songid, userid, accessToken}) => {

  const [trackDetail, setTrackDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  let url='';

  function DisLike() {
    const userDocRef = doc(firestore, 'usersPlayLists', userid);

    updateDoc(userDocRef, {
      [`defaultAppLikes.songs`]: arrayRemove(Songid),
    })
      .then(() => {
        console.log('Song successfully deleted!');
        
      })
      .catch((error) => {
        console.error('Error deleting song: ', error);
      });
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

    <TouchableOpacity onPress={() => setModalVisible(true)}>
      {trackDetail && trackDetail !== undefined &&
      <>
      <View style={styles.songbox}>
        <Image source={{uri: trackDetail.album.images[0].url}} style={styles.albumImage}/>
        <View style={styles.textContainer}>
          <Text>{trackDetail.name}</Text>
          <Text>{trackDetail.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={DisLike}>
            <Icon name="heart-dislike-outline" size={30} color="#8e44ad" />
          </Pressable>
        </View>
      </View>
          <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={!modalVisible}>
            <TouchableOpacity style={styles.backArrow} onPress={() => setModalVisible(false)}>
                <Icon name="chevron-back" type="material" size={30} color="#8e44ad" style={{margin:20}}/>
            </TouchableOpacity>
            <MiniPlayer trackDetail={trackDetail}/>
          </Modal>
          </>
}
      </TouchableOpacity>
    
  );
};

// Main Likes Page //

const LikesBox = () => {
  const userid = useSelector((state) => state.userid);
  const likearr = useSelector(state => state.likearr);

  const token=useSelector((state) => state.token);


  console.log(userid)
  console.log(likearr)

  const mapArr=likearr.map((obj)=>{
    return(
      < LikeSongBox key={obj} Songid={obj} userid={userid} accessToken={token} />
    )}
    )
          
  return (
    <SafeAreaView style={{height:'100%'}}>
    
          <Text style={styles.title}>My Likes</Text>
          <View  style={styles.container}>{mapArr}</View>
        
    </SafeAreaView>
  );
};

export default LikesBox;


const styles = StyleSheet.create({
  title: {
    marginTop:30,
    marginLeft:20,
    color: '#8e44ad',
    fontSize: 30,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  textContainer: {
    flex: 1, // Take available space

  },
  songText: {
    flex: 1, // Take available space
    marginRight: 10, 
  },
  albumImage: {
    width: 60,
    height: 60,
    marginRight: 10, 
  },
  songbox: {
    backgroundColor: '#fafafa',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
});