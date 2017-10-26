/*eslint-disable react/display-name*/
/*react-eslint misfires for jsx-returning functions*/

/**
 * Navigation Bar for IOS
 * Used with Navigator
 * https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ActionSheetIOS,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import Share from 'react-native-share';

import Text from './MyText';
import theme from '../../style/theme';
import SortSelector from '../header/SortSelector';
import Icon from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/EvilIcons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Tabs from '../../constants/Tabs';
import { openSettings } from '../../services/router';


let NavigationBarRouteMapper = props => ({
  LeftButton: function(route, navigator, index, navState) {
    if (index > 0) {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => { navigator.pop() }}>
          <Icon name='ios-arrow-back' style={styles.navBarIcon} />
        </TouchableOpacity>
      )
    }

    return null;
  },

  RightButton: function(route, navigator, index, navState) {

    if (route.share) {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => Share.open(route.share)}>
          <EIcon name='share-apple' style={[styles.navBarIcon, styles.navBarIconShare]} />
        </TouchableOpacity>
      )
    }

    if (props.currentTab === Tabs.FEED && index === 0) {
      return (<SortSelector />);
    }


    if (props.currentTab === Tabs.SETTINGS && index === 0) {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => openSettings(navigator)}>
          <EIcon name='gear' style={styles.navBarIcon} />
        </TouchableOpacity>
      );
    }

    return null;
  },

  Title: function(route, navigator, index, navState) {

    if (route.showName) {
      return (
        <Text style={styles.navBarTitle} numberOfLines={1} ellipsizeMode={'tail'}>
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
    padding: 8,
    paddingHorizontal: 10,
    fontSize: 25,
    textAlign: 'center',
  },
  navBarIconShare: {
    top: 3,
    fontSize: 27,
    paddingHorizontal: 8,
  },
  navBarLogo:{
    width: 60,
    height: 32,
    tintColor: theme.primary,
    top: 3,
  },
  navBarTitle:{
    padding: 10,
    paddingTop: 14,
    paddingHorizontal: 30,
    fontSize: 17,
    color: theme.primary,
    textAlign: 'center',
    fontWeight: 'normal',
  }
});

export default NavigationBarRouteMapper
