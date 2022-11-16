import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import IMAGES from '../assets';
import ButtonComponent from '../Components/ButtonComponent';
import TextInputComponent from '../Components/TextInputComponent';
import {auth} from '../Firebase/firebaseConfig';
import {LoginUser} from '../Firebase/LoginUser';

const LoginScreen = props => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const [loader, setLoader] = useState(false);

  useEffect(async () => {
    setLoader(true);
    const uid = await AsyncStorage.getItem('UID');
    if (uid) {
      props.navigation.navigate('DashboardScreen');
      setLoader(false);
    }
    setLoader(false);
  }, []);

  const LogintoFirebase = async () => {
    if (!inputs.email) {
      return alert('Please Enter Email');
    }
    if (!inputs.password) {
      return alert('Please Enter Password');
    }
    setLoader(true);
    LoginUser(inputs.email, inputs.password)
      .then(async res => {
        const uid = auth.currentUser.uid;
        console.log('uid=-=-=>log', uid);
        await AsyncStorage.setItem('UID', uid);
        setLoader(false);
        props.navigation.navigate('DashboardScreen');
      })
      .catch(err => {
        setLoader(false);
        alert(err);
      });
  };
  return (
    !loader?
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={IMAGES.LOGO}
        style={{width: 100, height: 100, borderRadius: 50, marginBottom: 30}}
      />
      <TextInputComponent
        placeholder="Enter Email"
        updateFields={email => setInputs({...inputs, email})}
      />
      <TextInputComponent
        placeholder="Enter Password"
        updateFields={password => setInputs({...inputs, password})}
      />
      <ButtonComponent title="Login" onPress={() => LogintoFirebase()} />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('SignUpScreen');
        }}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
          New User? Click Here
        </Text>
      </TouchableOpacity>
    </View>
    :
    <ActivityIndicator size={80} style={{flex:1,justifyContent:'center',alignItems:'center'}} />
  );
};

export default LoginScreen;
