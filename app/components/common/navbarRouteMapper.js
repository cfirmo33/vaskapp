/*eslint-disable react/display-name*/
/*react-eslint misfires for jsx-returning functions*/

/**
 * Navigation Bar for IOS
 * Used with Navigator
 * https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActionSheetIOS,
  Platform,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';


import theme from '../../style/theme';
import CityToggle from '../header/CityToggle';
import SortSelector from '../header/SortSelector';
import Icon from 'react-native-vector-icons/Ionicons';
import Tabs from '../../constants/Tabs';

let showShareActionSheet = function(url) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: url
    },
  (error) => { /* */ },
  (success, method) => {
    /* */
  });
  }
}

let NavigationBarRouteMapper = props => ({
  LeftButton: function(route, navigator, index, navState) {
    if (index > 0) {
      return (
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => { navigator.pop() }}>
          <Icon name='ios-arrow-back' style={styles.navBarIcon} />
        </TouchableHighlight>
      )
    }

    return null;
   // return <CityToggle />
  },

  RightButton: function(route, navigator, index, navState) {

    if (props.currentTab === Tabs.FEED && index === 0) {
      return (<SortSelector />);
    }

    if (route.actions) {
      return (
        <TouchableHighlight
        onPress={() => {
          showShareActionSheet(route.post.link)
        }}
        >
          <Icon name='ios-upload-outline' style={styles.navBarIcon} />
        </TouchableHighlight>
        );
    }
    return null;
  },

  Title: function(route, navigator, index, navState) {

    if (route.showName) {
      return (
        <Text style={styles.navBarTitle}>
        {route.name}
        </Text>
      );
    }
    return (
      <View style={styles.navBarLogoWrap}>
        <Image
          resizeMode={'contain'}
          source={require('../../../assets/logo/vask.png')}
          style={styles.navBarLogo} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navBarLogoWrap:{
    flex:1,
    alignItems:'center'
  },
  navBarButton:{
    color: theme.primary,
    padding:10,
    fontSize:16,
    textAlign:'center',
  },
  navBarIcon:{
    color: theme.primary,
    padding:6,
    paddingLeft:10,
    paddingRight:10,
    fontSize:28,
    textAlign:'center',
  },
  navBarLogo:{
    width: 60,
    height: 38,
    tintColor: theme.primary,
    top: 1,
  },
  navBarTitle:{
    padding:10,
    fontSize:16,
    color: theme.primary,
    textAlign:'center',
    fontWeight:'bold',
  }
});

export default NavigationBarRouteMapper
