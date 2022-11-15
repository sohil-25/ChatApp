// import React from "react";
// import {View,Text, Button} from 'react-native';

// const SignUpScreen=({navigation})=>{
//     return(

//     <View style={{flex:1,justifyContent:'center',justifyContent:'center',backgroundColor:'red'}}>
//         <Text>SignUpScreen</Text>
//         <Button title="clk" onPress={()=>navigation.navigate('LoginScreen')} />
//         <Button title="clk" onPress={()=>navigation.navigate('DashboardScreen')} />
//         <Button title="clk" onPress={()=>navigation.navigate('ChatScreen')} />
//     </View>
//     )
// }

// export default SignUpScreen;

import React,{useState} from 'react';
import { View, Image, ActivityIndicator,Button } from 'react-native';
// import { SignUpUser } from '../Firebase/SignUp';
// import { AddUser } from '../Firebase/Users';
// import Firebase from '../Firebase/firebaseConfig';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMAGES from '../assets';
import TextInputComponent from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { SignUpUser } from '../Firebase/SignUp';
import app, { auth } from '../Firebase/firebaseConfig';
import { AddUser } from '../Firebase/User';


 const SignUpScreen=(props)=>{

const [inputs, setInputs] = useState(
    {
        email: "",
        name: "",
        password: "",
    }
)
const [loader, setLoader] = useState(false)

    const SignUPtoFIrebase = async () => {
         if(!inputs.name)
         {
             return alert('Please Enter Name');
         }
         if(!inputs.email)
         {
             return alert('Please Enter Email');
         }
         if(!inputs.password)
         {
             return alert('Please Enter Password');
         }
         setLoader(true)
         console.log('in siognup func');
         console.log('inputs',inputs);
         SignUpUser(inputs.email,inputs.password).
             then(async (res) => {
                 console.log('res', res);
                 var userUID = auth.currentUser.uid;
                 console.log('userUID',userUID);
                 AddUser(inputs.name, inputs.email, '', userUID).
                     then(async () => {
                         setLoader(false);
                         await AsyncStorage.setItem('UID', userUID);
                         props.navigation.navigate('LoginScreen');
                     }).
                     catch((error) => {
                         console.log('in func error',error);
                         setLoader(false);
                         alert(error);
                     })
                 console.log(userUID);
             }).
             catch((err) => {
                console.log('err2',err);
                 setLoader(false);
                 alert(err);
             })
     }
         return (
             <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={IMAGES.LOGO} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 30 }} />
                 <TextInputComponent placeholder="Enter Name" updateFields={(name) => setInputs({...inputs,name})} />
                 <TextInputComponent placeholder="Enter Email" updateFields={(email) => setInputs({...inputs,email})} />
                 <TextInputComponent placeholder="Enter Password" updateFields={(password) => setInputs({...inputs,password})} />
                 <ButtonComponent title="Sign Up" onPress={() => SignUPtoFIrebase()} />
        <Button title="clk" onPress={()=>props.navigation.navigate('LoginScreen')} />
        <Button title="clk" onPress={()=>props.navigation.navigate('DashboardScreen')} />
        <Button title="clk" onPress={()=>props.navigation.navigate('ChatScreen')} />
         
             </View>
         )
 }
    




export default SignUpScreen;