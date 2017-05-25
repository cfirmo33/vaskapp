import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Image } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const heartIcon = require('../../../assets/icons/love.png');

class VotePanel extends Component {
  @autobind
  getVotes() {
    const { votes } = this.props.item;
    return parseInt(votes, 10);
  }

  @autobind
  voteThisItem(vote) {

    const { id } = this.props.item;

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      this.props.voteFeedItem(id, vote);
    }
  }

  renderVoteButton(positive) {
    const { userVote } = this.props.item;

    // const value = positive ? 1 : -1;
    // const iconName = positive ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
    // const alreadyVotedThis = userVote === value;

    const value = userVote && userVote > 0 ? -1 : 1;
    const alreadyVotedThis = userVote !== 0;

    return (
      <View style={styles.itemVoteButtonWrap}>
        <TouchableHighlight
          // disabled={alreadyVotedThis}
          activeOpacity={1}
          style={styles.itemVoteButton}
          underlayColor={'rgba(0,0,0,.05)'}
          onPress={() => this.voteThisItem(value)}>
            <View style={styles.itemVoteButton}>
              <Image
                source={heartIcon}
                style={[styles.voteImage, {tintColor: alreadyVotedThis ? theme.primary : theme.grey} ]}
              />
              {/*
              <Text style={{color: alreadyVotedThis ? theme.primary : theme.grey}}>
                <Icon name={iconName} size={25}/>
              </Text>
              */}
            </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {

    return (
      <View style={styles.itemVoteWrapper}>
        {this.renderVoteButton(true)}
        <Text style={styles.itemVoteValue}>{this.getVotes()}</Text>
        {/* this.renderVoteButton() */}
      </View>
    );
  }
};


const styles = StyleSheet.create({
  itemVoteWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 5,
    width: 50,
  },
  itemVoteButtonWrap: {
    flex: 1,
    width: 28,
    height: 28,
    top: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemVoteButton: {
    flex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemVoteValue: {
    minWidth: 15,
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 5,
    color: theme.grey
  },
  voteImage: {
    height: 22,
    width: 22,
  }
});


export default VotePanel;
