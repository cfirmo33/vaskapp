'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Button from '../../components/common/Button';
import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import {
  postText,
  closeTextActionView
} from '../../concepts/competition';

const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class TextActionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      formAnimation: new Animated.Value(1),
      okAnimation: new Animated.Value(0)
    }
  }

  componentWillReceiveProps({ isTextActionViewOpen }) {
    // when opening again
    if (isTextActionViewOpen && !this.props.isTextActionViewOpen){
      this.hideOK();
      this.setState({text: ''});
    }
  }

  showOK() {
    Animated.spring(this.state.okAnimation, { toValue: 1, duration: 250 }).start();
    Animated.timing(this.state.formAnimation, { toValue: 0, duration: 100 }).start();
  }

  hideOK() {
    this.state.formAnimation.setValue(1);
    this.state.okAnimation.setValue(0);
  }

  @autobind
  onChangeText(text) {
    this.setState({text: text});
  }

  @autobind
  onClose() {
    this.setState({text: ''});
    this.props.closeTextActionView();
  }

  @autobind
  onSendText() {

    if (!this.state.text.length) {
      this.onClose();
      return;
    }

    this.showOK();
    this.props.postText(this.state.text);

    // setTimeout(() => {
    //   reset values for the next time
    //   this.hideOK();
    // }, 100);

    // setTimeout(() => {
    //   this.onClose();
    // }, 600);

  }

  render() {

    const { isTextActionViewOpen } = this.props;

    if (!isTextActionViewOpen) {
      return false;
    }

    return (
      <Modal
        onRequestClose={this.onClose}
        visible={isTextActionViewOpen}
        animationType={'slide'}
      >
        <LinearGradient
          style={[styles.container, styles.modalBackgroundStyle]}
          locations={[0, 1]}
          start={{x: 0.35, y: 0}}
          end={{x: 1, y: 1}}
          colors={[theme.white, '#eee']}
        >

          <TouchableHighlight underlayColor="#f4f4f4" onPress={this.onClose} style={styles.closeButton}>
            <Icon style={styles.closeButtonIcon} name="close" />
          </TouchableHighlight>


          <Animated.View style={[styles.okView, { opacity: this.state.okAnimation }]}>
            <Animated.View style={[styles.okWrap,
              { opacity: this.state.okAnimation, transform:[{ scale: this.state.okAnimation }] }
            ]}>
              <Icon name='done' style={styles.okSign} />
            </Animated.View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.okText}>Let's vask your message...</Text>
            </View>
          </Animated.View>


          <Animated.View style={[styles.innerContainer, {opacity:this.state.formAnimation}]}>
          <KeyboardAvoidingView behavior={IOS ? 'position' : 'height'} keyboardVerticalOffset={IOS ? -100 : 30} style={styles.inputContainer}>
          {/*
            <View>
              <View style={styles.title}>
                <Icon name='textsms' style={styles.titleIcon} />
                <Text style={styles.titleText}> Post Text</Text>
              </View>
            </View>
          */}
            <TextInput
              autoFocus={true}
              multiline={true}
              autoCapitalize={'sentences'}
              underlineColorAndroid={'transparent'}
              clearButtonMode={'while-editing'}
              returnKeyType={'send'}
              blurOnSubmit={true}
              onSubmitEditing={this.onSendText}
              style={styles.inputField}
              onChangeText={this.onChangeText}
              numberOfLines={3}
              maxLength={151}
              placeholderTextColor={'rgba(0,0,0, 0.2)'}
              placeholder="Say something..."
              autoCorrect={false}
              value={this.state.text} />


          {/*
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomInfoText}>
                How is it going?
              </Text>
            </View>
          */}

            <View style={styles.bottomButtons}>
              <Button
                onPress={this.onSendText}
                style={[styles.button, styles.modalButton]}
                textStyle={{ color: theme.primary }}
                isDisabled={!this.state.text}>
                Post
              </Button>
            </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </LinearGradient>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center'
  },
  innerContainer: {
    padding: IOS ? 10 : 0,
    paddingBottom: 10,
    flex:1,
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title:{
    padding: 10,
    paddingBottom: 100,
    paddingTop: 0,
    backgroundColor:'transparent',
    flexDirection: 'row',
    justifyContent: IOS ? 'center' : 'center',
  },
  titleText:{
    fontSize: 20,
    color: theme.primary,
    fontWeight: 'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  titleIcon:{
    top:5,
    fontSize:20,
    marginRight:5,
    color:theme.primary,
  },
  bottomButtons:{
    flexDirection: 'row',
    alignItems: IOS ? 'stretch' : 'flex-end',
    justifyContent: IOS ? 'center' : 'flex-end',
    position: 'absolute',
    bottom: IOS ? 0 : 10,
    right: 0,
    left: 0,
    padding: 0,
    paddingBottom: 0,
    paddingLeft: IOS ? 15 : 30,
    paddingRight: IOS ? 15 : 30,
    borderTopWidth: IOS ? 0 : 1,
    borderTopColor:'rgba(0,0,0,.1)',
  },
  button: {
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 7,
      width: 0
    }
  },
  modalButton: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: theme.white,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: IOS ? 50 : 30,
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  closeButtonIcon: {
    fontSize: 26,
    color: '#888',
  },
  cancelButton: {
    flex: 1,
    marginRight: 15,
    backgroundColor: '#aaa',
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondary
  },
  inputField: {
    fontSize: 18,
    margin: 0,
    marginLeft: 20,
    marginTop: IOS ? 110 : 0,
    color: theme.primary,
    textAlign: 'center',
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
    height: 220,
    width: width - 40,
  },
  bottomInfo:{
    padding: 15,
    paddingBottom:10,
    paddingTop:5,
    backgroundColor: 'transparent'
  },
  bottomInfoText:{
    textAlign: IOS ? 'center' : 'left',
    fontSize: 12,
    color: 'rgba(255,255,255,.7)'
  },
  okView: {
    position: 'absolute',
    top: IOS ? height / 2 - 170 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  okWrap:{
    position: 'relative',
    overflow: 'visible',
    paddingTop: 32,
    width: 140,
    height: 140,
    opacity: 0,
    transform: [{ scale: 0 }]
  },
  okSign:{
    fontSize: 105,
    color: theme.primary,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  okText:{
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 15
  }
});


const mapDispatchToProps = {
  closeTextActionView,
  postText
};


const select = store => ({
  isTextActionViewOpen: store.competition.get('isTextActionViewOpen')
})

export default connect(select, mapDispatchToProps)(TextActionView);
