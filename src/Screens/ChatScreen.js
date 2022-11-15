import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import IMAGES from '../assets';
import AppHeader from '../Components/AppHeader';
import database from '@react-native-firebase/database';
import {RecieveMessage, SendMessage} from '../Firebase/Message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImgToBase64 from 'react-native-image-base64';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ChatScreen = props => {
  const [message, setMessage] = useState('');
  const [guestUid, setGuestUid] = useState('');
  const [currentUid, setCurrentUid] = useState('');
  const [allMessages, setAllMessage] = useState([]);
  const [image, setImage] = useState('');
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    Try();
  }, []);

  const Try = async () => {
    const currentUid = await AsyncStorage.getItem('UID');
    const {guestUid, UserName} = props.route.params;
    console.log('guestUid on chatcreen', guestUid);
    setUserName(UserName);
    setCurrentUid(currentUid);
    setGuestUid(guestUid);
    try {
      database()
        .ref('messages')
        .child(currentUid)
        .child(guestUid)
        .on('value', dataSnapshot => {
          let message = [];

          dataSnapshot.forEach(data => {
            message.push({
              sendBy: data.val().messege.sender,
              recieveBy: data.val().messege.reciever,
              msg: data.val().messege.msg,
              image: data.val().messege.image,
              date: data.val().messege.date,
              time: data.val().messege.time,
            });
            console.log('fff', data.val().messege.image);
          });
          setAllMessage(message.reverse());
          console.log('allMessages', allMessages);
        });
    } catch (error) {
      alert(error);
    }
  };

  const openGallery = () => {
    launchImageLibrary('photo', response => {
      console.log('resp photo chat screen', response);
      setLoader(true);
      ImgToBase64.getBase64String(response.assets[0].uri)
        .then(async base64String => {
          let source = 'data:image/jpeg;base64,' + base64String;
          SendMessage(currentUid, guestUid, '', source)
            .then(res => {
              setLoader(false);
            })
            .catch(err => {
              alert(err);
            });

          RecieveMessage(currentUid, guestUid, '', source)
            .then(res => {
              setLoader(false);
            })
            .catch(err => {
              alert(err);
            });
        })
        .catch(err => setLoader(false));
    });
  };

  const sendMessage = async () => {
    if (message) {
      SendMessage(currentUid, guestUid, message, '')
        .then(res => {
          console.log(res);
          setMessage('');
        })
        .catch(err => {
          alert(err);
        });

      RecieveMessage(currentUid, guestUid, message, '')
        .then(res => {
          console.log(res);
          setMessage('');
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <AppHeader
        title={userName}
        navigation={props.navigation}
        onPress={() => logOut()}
      />
      <FlatList
        inverted
        style={{marginBottom: 60}}
        data={allMessages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={{
              marginVertical: 5,
              maxWidth: Dimensions.get('window').width / 2 + 10,
              alignSelf: currentUid === item.sendBy ? 'flex-end' : 'flex-start',
            }}>
            <View
              style={{
                borderRadius: 20,
                backgroundColor: currentUid === item.sendBy ? '#fff' : '#ccc',
              }}>
              {item.image === '' ? (
                <Text style={{padding: 10, fontSize: 16, fontWeight: 'bold'}}>
                  {item.msg} {'   '}{' '}
                  <Text style={{fontSize: 12}}>{item.time}</Text>
                </Text>
              ) : (
                <View>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: Dimensions.get('window').width / 2 + 10,
                      height: 150,
                      resizeMode: 'stretch',
                      borderRadius: 30,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                    }}>
                    {item.time}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
      <View
        style={{
          bottom: 0,
          height: 50,
          width: '100%',
          position: 'absolute',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}
          onPress={() => openGallery()}>
          <Image
            source={IMAGES.CAMERA}
            style={{
              height: 30,
              width: 40,
              borderRadius: 40 / 2,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View style={{width: '75%', justifyContent: 'center'}}>
          <TextInput
            value={message}
            onChangeText={text => setMessage(text)}
            placeholder="Enter Message"
            placeholderTextColor="#000"
            style={{height: 40, borderRadius: 20, backgroundColor: '#ccc'}}
          />
        </View>
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
          }}
          onPress={() => sendMessage()}>
          <Image
            source={IMAGES.SEND}
            style={{
              height: 30,
              width: 40,
              borderRadius: 40 / 2,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
