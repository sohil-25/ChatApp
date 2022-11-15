import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import IMAGES from '../assets';


    const AppHeader=(props)=>{

        const { title, onPress, navigation } = props;
        return (
            <View style={{ height: 60 }}>
                <View style={[styles.gradient, { paddingTop: 5, backgroundColor: 'white' }]}>
                    <View style={styles.headerView}>
                        {title === "Messages" ?
                            <View style={{ width: '10%' }}>
    
                            </View>
                            :
                            <View style={{ alignItems: 'flex-start' }}>
                                <TouchableOpacity style={styles.iconView} onPress={() => { navigation.goBack(null) }}>
                                <Image source={IMAGES.BACK_ARROW} style={{height:25,width:25}} />
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={{ width: '80%', alignItems: 'center' }}>
                            <Text style={[styles.textView, { fontSize: 25, fontWeight: 'bold' }]}>{title}</Text>
                        </View>
                        {title === "Messages" ? <View style={{ width: '10%', alignItems: 'flex-end', marginLeft: 10 }}>
                            <TouchableOpacity style={styles.iconView} onPress={() => { onPress() }}>
                            <Image source={IMAGES.LOGOUT} style={{height:25,width:25}} />
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </View>
            </View>
        );
    }

const styles = StyleSheet.create({
    gradient: {
        height: '100%',
        width: '100%',
        paddingHorizontal: 12,
        justifyContent: 'center'
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        width: '100%',
    },
    iconView: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    textView: {
        fontSize: 20,
        lineHeight: 28,
        color: '#000',
    }
});


export default AppHeader;








