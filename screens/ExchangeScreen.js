import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component{
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            item:'',
            description:'',
            exchangeId:''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addItem=(item,description)=>{
        var userName= this.state.userId
        var randomRequestId = this.createUniqueId();
        this.setState({
            exchangeId: randomRequestId
        })
        db.collection("exchange_requests").add({
            "username":userName,
            "item_name":item,
            "description":description,
            "request_id":this.state.exchangeId
        })
        this.setState({
            item:'',
            description:''
        })
        return(
            Alert.alert(
                'Item Ready to Exchange',
                '',
                [
                    {text:'OK', onPress:()=>{
                        this.props.navigation.navigate('HomeScreen')
                    }}
                ]
            )
        )
    }


    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="Add Item"/>
                <View style={styles.keyBoardStyle}>
                <TextInput
                    style ={styles.formTextInput}
                    placeholder="Item Name"
                    multiline
                    editable
                    textAlignVertical = 'top'
                    onChangeText={(text)=>{
                        this.setState({
                            item:text   
                        })
                    }}
                    value={this.state.item}
                />

                <TextInput
                    style ={[styles.formTextInput,{height:300}]}
                    placeholder="Item Description"
                    multiline
                    // editable
                    textAlignVertical = 'top'
                    onChangeText={(text)=>{
                        this.setState({
                            description:text
                        })
                    }}
                    value={this.state.description}
                />

                <TouchableOpacity style={styles.button} onPress={()=>{this.addItem(this.state.item, this.state.description    )}}>
                    <Text>Add Item</Text>
                </TouchableOpacity>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
    //   flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )