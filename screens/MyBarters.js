import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import{ Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';
import MyHeader from '../components/MyHeader'
import { ListItem } from 'react-native-elements';

export default class MyBartersScreen extends Component{
    constructor(){
        super();
        this.state={
            userId: firebase.auth().currentUser.email,
            allBarters:[],
        }
        this.requestRef=null;
    }

    getAllBarters=()=>{
        this.requestRef=db.collection('all_barters').where("user_id","==",this.state.userId)
        .onSnapshot((snapshot)=>{
            var allBarters= snapshot.docs.map(document=> document.data());  
            this.setState({
                allBarters:allBarters
            })
        })
    }

    keyExtractor= (item, index)=> index.toString();

    renderItem=({item,i})=>{
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={"Requested By : " +item.requested_by+ "n_status: " +item.request_status}
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button}
            onPress={()=>{
              this.sendBook(item)
            }}
           >
             <Text style={{color:'#ffff'}}>Send Item</Text>
           </TouchableOpacity>
         }
       bottomDivider
      />
    }

    componentDidMount(){
        this.getAllBarters();
    }

    componentWillUnmount(){
        this.requestRef();
    }

    sendNotification=(itemDetails, requestedStaus)=>{
      var requestId=itemDetails.request_id
      var donorId=itemDetails.donor_id
      db.collection("all_donations")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var message=''
          if(requestedStaus==="ItemSent"){
            message=this.state.donorName+"sent you the item"
          }
          else{
            message=this.state.donorName+"has shown intrest in donating the item"
          }
          db.collection("all_notifications").doc(doc.id).update({
            "message": message,
            "notification_status": "unread",
            "date": firebase.firestore.FieldValue.serverTimestamp()
          })
        })
      })
    }

    sendItem=(itemDetails)=>{
      if(itemDetails.request_status==="ItemSent"){
        var requestStatus="donor intrested"
        db.collection("all_notifications").doc(itemDetails.doc_id).update({
          "requested_status": "donor intrested"
        })
        this.sendNotification(itemDetails, requestedStaus)
      }
      else{
        var requestedStaus="Item Sent"
        db.collection("all_donations")
        .doc(itemDetails.doc_id).update({
          "request_status": "Item Sent"
        })
        this.sendNotification(itemDetails, requestedStaus)
      }
    }
    render(){
        return(
            <View style={{flex:1, backgroundColor: 'white'}}>
              <MyHeader navigation={this.props.navigation} title="My Barters"/>
              <ListItem
                key={i}
                subtitle={"Requested By: " + item.requested_by+ "\nStatus :" + item.request_status}
                leftElement={<Icon name="item" type="font-awesome" color="red"/>}
                titleStyle={{color: 'black', fontWeight: 'bold'}}
                rightElement={
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: item.requested_status==="Item Sent" ? "green": "#ff5722"
                      }
                    ]}
                    onPress={()=>{
                      this.sendItem(item)
                    }}
                  >
                    <Text style={{ color: '#ffff'}}>{
                      item.request_status==="Item Sent" ? "Item Sent" : "Sent Book"
                    }</Text>
                  </TouchableOpacity>
                }
                  bottomDivider
              />
              <View style={{flex:1}}>
                {
                  this.state.allBarters.length === 0
                  ?(
                    <View style={styles.subtitle}>
                      <Text style={{ fontSize: 20}}>List Of All Barters</Text>
                    </View>
                  )
                  :(
                    <FlatList
                      keyExtractor={this.keyExtractor}
                      data={this.state.allBarters}
                      renderItem={this.renderItem}
                    />
                  )
                }
              </View>
            </View>
          )
    }
}

const styles = StyleSheet.create({
    button:{
      width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#F69400",
        shadowColor: "#000",
        shadowOffset: {
           width:0,
           height:8
        }
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })