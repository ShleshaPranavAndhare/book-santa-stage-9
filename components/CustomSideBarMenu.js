import React, { Component} from 'react';
import {View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'

export default class CustomSideBarMenu extends Component{
    render(){
        return(
            <View style={{flex:1}}>
                    <DrawerItems {...this.props}/>
                    <View style={{flex:1, justifyContent:'flex-end',paddingBottom:30}}>
                        <TouchableOpacity style={{justifyContent:'center',paddingBottom:-30,marginLeft:50, height:30, width:'100%'}}
                            onPress={()=>{
                                this.props.navigation.navigate('SignupLoginScreen')
                                firebase.auth().signOut;
                            }}>
                                <Text style={{fontSize:18}}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}   

