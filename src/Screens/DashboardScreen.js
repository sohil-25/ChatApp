// import React from "react";
// import {View,Text} from 'react-native';

// const DashboardScreen=()=>{
//     return(
//     <View>
//         <Text>DashboardScreen</Text>
//     </View>
//     )
// }

// export default DashboardScreen;

// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
// import firebase from '../Firebase/firebaseConfig';
import AppHeader from '../Components/AppHeader';
import { auth } from '../Firebase/firebaseConfig';
import database from '@react-native-firebase/database';
import { UpdateUserImage } from '../Firebase/User';
// import { launchImageLibrary } from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { UpdateUserImage } from '../Firebase/Users';
import ImgToBase64 from 'react-native-image-base64';
import { useIsFocused } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import { async } from '@firebase/util';



    const DashboardScreen=(props)=>{

        const [allUsers, setAllUsers] = useState([]);
        const [allUsers2, setAllUsers2] = useState([]);
        const [singleuser, setSingleuser] = useState(null)
        const [loader, setLoader] = useState(false)
        const [imageUrl, setImageUrl] = useState('')
        const [loggedInUserName, setLoggedInUserName] = useState('')
        console.log('before dash use');
        console.log('allusers=-=-=',allUsers);

const focus=useIsFocused()

        useEffect(()=>{
            if(focus==true){
                Try()
            }
        },[focus])


        const Try=async()=>{
            try {
                setLoader(true)
                database().ref('users')
                    .on("value", async (datasnapshot) => {
                        const uuid = await AsyncStorage.getItem('UID');
                        new Promise((resolve, reject) => {
                            let users = [];
                            let lastMessage = '';
                            let lastDate = '';
                            let lastTime = '';
                            let properDate = '';
                            datasnapshot.forEach((child) => {
                                if (child.val().uuid === uuid) {
                                    console.log('ff', child.val().image);
                                    setLoggedInUserName(child.val().name)
                                    setImageUrl(child.val().image)
                                    // this.setState({ loggedInUserName: child.val().name, imageUrl: child.val().image })
                                }
                                else {
                                    let newUser = {
                                        userId: '',
                                        userName: '',
                                        userProPic: '',
                                        lastMessage: '',
                                        lastDate: '',
                                        lastTime: '',
                                        properDate: ''
                                    }
                                    new Promise((resolve, reject) => {
                                        database().ref('messages').
                                            child(uuid).child(child.val().uuid).orderByKey().limitToLast(1).on('value', (dataSnapshots) => {
                                                if (dataSnapshots.val()) {
                                                    dataSnapshots.forEach((child) => {
                                                        lastMessage = child.val().messege.image !== '' ? 'Photo' : child.val().messege.msg;
                                                        lastDate = child.val().messege.date;
                                                        lastTime = child.val().messege.time;
                                                        properDate = child.val().messege.date + " " + child.val().messege.time
                                                    });
                                                }
                                                else {
                                                    lastMessage = '';
                                                    lastDate = '';
                                                    lastTime = '';
                                                    properDate = '';
                                                }
                                                newUser.userId = child.val().uuid;
                                                newUser.userName = child.val().name;
                                                newUser.userProPic = child.val().image;
                                                newUser.lastMessage = lastMessage;
                                                newUser.lastTime = lastTime;
                                                newUser.lastDate = lastDate;
                                                newUser.properDate = properDate;
                                                return resolve(newUser);
                                            });
                                    }).then((newUser) => {
                                        users.push({
                                            userName: newUser.userName,
                                            uuid: newUser.userId,
                                            imageUrl: newUser.userProPic,
                                            lastMessage: newUser.lastMessage,
                                            lastTime: newUser.lastTime,
                                            lastDate: newUser.lastDate,
                                            properDate: newUser.lastDate ? new Date(newUser.properDate) : null
                                        });
                                        setAllUsers(users.sort((a, b) => b.properDate - a.properDate))
                                    });
                                    return resolve(users);
                                }
                            });
                        }).then((users) => {
                            setAllUsers(users.sort((a, b) => b.properDate - a.properDate))
                        })
                        setLoader(false)
                    })
            } catch (error) {
                alert(error);
                setLoader(false)
            }
        }
    
      const logOut = async () => {
            await auth.signOut().then(async () => {
                await AsyncStorage.removeItem('UID');
                props.navigation.navigate('LoginScreen');
            }).catch((err) => {
                alert(err);
            })
        }
    
      const  openGallery=async()=> {
        console.log('open gallery clicked');
            launchImageLibrary('photo', (response) => {
                setLoader(true);
                console.log('res gallery',response.assets[0].uri);
                ImgToBase64.getBase64String(response.assets[0].uri)
                    .then(async (base64String) => {
                        const uid = await AsyncStorage.getItem('UID');
                        console.log('uid in open gallery');
                        let source = "data:image/jpeg;base64," + base64String;
                        UpdateUserImage(source, uid).
                            then(() => {
                                setImageUrl(response.assets[0].uri);
                                setLoader(false)
                            })
                    })
                    .catch(err => setLoader(false));
            })
        }
            return (
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <AppHeader title="Messages" navigation={props.navigation} onPress={() => logOut()} />
                    <FlatList
                        alwaysBounceVertical={false}
                        data={allUsers}
                        style={{ padding: 5 }}
                        keyExtractor={(_, index) => index.toString()}
                        ListHeaderComponent={
                            <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ height: 90, width: 90, borderRadius: 45 }} onPress={() =>  openGallery() }>
                                    <Image source={{ uri: imageUrl === '' ? 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50' : imageUrl }} style={{ height: 90, width: 90, borderRadius: 45 }} />
                                </TouchableOpacity>
                                <Text style={{ color: '#fff', fontSize: 20, marginTop: 10, fontWeight: 'bold' }}>{loggedInUserName}</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }} onPress={() => props.navigation.navigate('ChatScreen', { UserName: item.userName, guestUid: item.uuid })}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={{ uri: item.imageUrl === '' ? 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50' : item.imageUrl }} style={{ height: 50, width: 50, borderRadius: 25 }} />
                                    </View>
                                    <View style={{ width: '65%', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{item.userName}</Text>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{item.lastMessage}</Text>
                                    </View>
                                    <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center', marginRight: 20 }}>
                                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '400' }}>{item.lastTime}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ borderWidth: 0.5, borderColor: '#fff' }} />
                            </View>
                        )}
                    />
                </View>
            )
    }





export default DashboardScreen;