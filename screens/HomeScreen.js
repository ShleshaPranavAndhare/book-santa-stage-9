import React, { Component } from 'react';
import { View, Text, FlatList,TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import db from '../config'
import MyHeader from "../components/MyHeader"

export default class HomeScreen extends Component{
    constructor(){
        super();
        this.state={
            items:[]
        }
        this.requestRef=null
    }

    getItems=()=>{
        this.requestRef= db.collection('exchange_requests')
        .onSnapshot((snapshot)=>{
            var items= snapshot.docs.map(document => document.data());
            this.setState({
                items:items
            })
        })
    }

    componentDidMount(){
        this.getItems();
    }

    componentWillUnmount(){
        this.requestRef();
    }

    keyExtractor=(item, index)=> index.toString();

    renderItem=({item, i})=>{
        return(
            <ListItem
                key={i}
                title={item.item_name}
                subtitle={item.description}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                rightElement={
                    <TouchableOpacity style={styles.button}  onPress ={()=>{
                      this.props.navigation.navigate("UserDetails",{"details": item})
                    }}>
                      <Text style={{color:'#fff'}}>View</Text>
                    </TouchableOpacity>
                  }
                bottomDivider
            />
        )
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor: 'yellow'}}>
              <MyHeader title="Items"/>
              <View style={{flex:1}}>
                {
                  this.state.items.length === 0
                  ?(
                    <View style={styles.subContainer}>
                      <Text style={{ fontSize: 20}}>List Of All Requested Items</Text>
                    </View>
                  )
                  :(
                    <FlatList
                      keyExtractor={this.keyExtractor}
                      data={this.state.items}
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
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })