'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  PropTypes,
  Dimensions,
  Animated,
  StyleSheet,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/common/Button';
import theme from '../../style/theme';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import autobind from 'autobind-decorator';

import { closeTextActionView, postText } from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const {width} = Dimensions.get('window');


class TextActionView extends Component {
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    isTextActionViewOpen: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      formAnimation: new Animated.Value(1),
      okAnimation: new Animated.Value(0)
    }
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isTextActionViewOpen) {
        this.onCancel()
        return true;
      }
      return false;
    })
  }

  showOK() {
    Animated.spring(this.state.okAnimation, {toValue:1, duration:250}).start();
    Animated.timing(this.state.formAnimation, {toValue:0, duration:100}).start();
  }

  @autobind
  hideOK() {
    this.state.formAnimation.setValue(1);
    this.state.okAnimation.setValue(0);
  }

  @autobind
  onChangeText(text) {
    this.setState({ text });
  }

  @autobind
  onCancel() {
    this.setState({ text: '' });
    this.props.closeTextActionView();
  }

  @autobind
  onSendText() {

    if (!this.state.text.length) {
      this.onCancel();
      return;
    }

    this.showOK()
    setTimeout(() => {
      this.props.postText(this.state.text);
      this.setState({text: ''});
      this.props.closeTextActionView();

      // reset values for the next time
      setTimeout(() => {
        this.hideOK();
      },100);

    }, 600);

  }

  render() {
    return (
      <Modal
        isOpen={this.props.isTextActionViewOpen}
        swipeToClose={false}
        backdropPressToClose={false}>
        <View style={[styles.container, styles.modalBackgroundStyle]}>


          <Animated.View style={[styles.okWrap,
            {opacity: this.state.okAnimation, transform:[{scale:this.state.okAnimation}]}
          ]}>
            <Icon name='done' style={styles.okSign} />
          </Animated.View>
          <Animated.Text style={[styles.okText, { opacity: this.state.okAnimation}]}>
            Let's publish your message...
          </Animated.Text>

          <Animated.View style={[styles.innerContainer, {opacity:this.state.formAnimation}]}>

            <View>
              <View style={styles.title}>
                <Icon name='textsms' style={styles.titleIcon} />
                <Text style={styles.titleText}> Share your Wappu feelings</Text>
              </View>
            </View>
            <TextInput
              autoFocus={true}
              multiLine={true}
              autoCapitalize={'sentences'}
              underlineColorAndroid={theme.accent}
              clearButtonMode={'while-editing'}
              returnKeyType={'send'}
              onSubmitEditing={this.onSendText}
              style={[styles.inputField, styles['inputField_' + Platform.OS]]}
              onChangeText={this.onChangeText}
              value={this.state.text} />



            <View style={styles.bottomInfo}>
              <Text style={styles.bottomInfoText}>
                Earn points for your guild by sharing a wappu message!
              </Text>
            </View>

            <View style={styles.bottomButtons}>
              <Button
                onPress={this.onCancel}
                style={styles.cancelButton}>
                Cancel
              </Button>

              <Button
                onPress={this.onSendText}
                style={styles.modalButton}
                isDisabled={!this.state.text}>
                Send!
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:0,
    paddingBottom:IOS ? 49 : 0,
  },
  innerContainer: {
    padding:10,
    flex:1,
  },
  title:{
    padding: 10,
    paddingTop: IOS ? 0 : 0,
    backgroundColor:'transparent',
    flex:1,
    flexDirection: 'row',
    justifyContent: IOS ? 'center' : 'flex-start',
  },
  titleText:{
    fontSize: 20,
    color: theme.light,
    fontWeight: 'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  titleIcon:{
    top:5,
    fontSize:20,
    marginRight:5,
    color:theme.accent,
  },
  bottomButtons:{
    flex: 1,
    flexDirection: 'row',
    alignItems: IOS ? 'stretch' : 'flex-end',
    justifyContent: IOS ? 'center' : 'flex-end',
    position: IOS ? 'relative' : 'absolute',
    bottom:0,
    right:0,
    left:0,
    padding:10,
    paddingLeft:20,
    paddingRight: IOS ? 20 : 0,
    borderTopWidth: IOS ? 0 : 1,
    borderTopColor:'rgba(0,0,0,.1)'
  },
  modalButton: {
    flex:1,
    marginLeft: 10,
  },
  cancelButton: {
    flex:1,
    marginRight: 10,
    backgroundColor: '#999',
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondary
  },
  inputField: {
    height: 50,
    fontSize: 18,
    margin: 10,
    color:'#FFF',
  },
  inputField_android: {

  },
  inputField_ios: {
    padding:10,
    backgroundColor: 'rgba(250,250,250,0.4)',
  },
  bottomInfo:{
    padding: 15,
    paddingBottom:10,
    paddingTop:5,
    backgroundColor: 'transparent'
  },
  bottomInfoText:{
    textAlign: IOS ? 'center' : 'left',
    fontSize: 11,
    color: theme.light
  },
  okWrap:{
    top: 60,
    left: width / 2 - 72,
    position: 'absolute',
    overflow: 'visible',
    borderWidth: 5,
    borderColor: theme.light,
    paddingTop: 32,
    borderRadius: 70,
    width: 140,
    height: 140,
    opacity: 0,
    transform: [{scale: 0}]
  },
  okSign:{
    fontSize: 65,
    color: theme.light,
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  okText:{
    color: theme.light,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 15,
    top: 220
  }
});

const mapDispatchToProps = { closeTextActionView, postText };


const select = store => {
  return {
    isTextActionViewOpen: store.competition.get('isTextActionViewOpen')
  };
};

export default connect(select, mapDispatchToProps)(TextActionView);
