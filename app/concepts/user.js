import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { parseInt, isNil } from 'lodash';
import moment from 'moment';

import api from '../services/api';
import { trackEvent } from '../services/analytics';
import {createRequestActionTypes} from '../actions';
import { VOTE_FEED_ITEM_REQUEST } from '../actions/feed';
import { SET_COMMENTS } from './comments';
import { getUserId } from './registration';

const PROFILE_TYPES = {
  MY: 'MY',
  OTHER: 'OTHER',
}

// # Selectors
export const getUserProfile = state => state.user.get('profile', Map());
export const getUserImages = state => state.user.getIn(['profile', 'images'], List()) || List();
export const getUserPicture = state => state.user.getIn(['profile', 'profilePicture'], '');
export const getUserTeam = state => state.user.getIn(['profile', 'team'], List()) || List();
export const getTotalSimas = state => state.user.getIn(['profile', 'numSimas'], '') || '';
export const getSelectedUser = state => state.user.get('selectedUser', Map()) || Map();
export const isLoadingUserImages = state => state.user.get('isLoading', false) || false;

export const getMyImages = state => state.user.getIn(['myProfile', 'images'], List()) || List();

export const getTotalVotesForUser = createSelector(
  getUserImages, (posts) => {
    const sumOfVotes = posts.reduce(
      (total, post) => total + parseInt(post.get('votes', 0), 10),
      0
    );
    return sumOfVotes;
  }
);

export const getTimeSinceLastPost = createSelector(
  getUserImages, (posts) => {
    if (!posts.size) {
      return null;
    }

    // let's assume posts are in chronological order
    return moment().diff(moment(posts.getIn([0, 'createdAt'])), 'days');
  }
);


// # Action creators
const {
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAILURE
} = createRequestActionTypes('GET_USER_PROFILE');
const SET_USER_PROFILE = 'user/SET_USER_PROFILE';
const CLOSE_USER_VIEW = 'user/CLOSE_USER_VIEW';

export const fetchUserImages = (userId, myProfile) => (dispatch) => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  return api.getUserProfile(userId)
    .then(images => {
      dispatch({
        type: SET_USER_PROFILE,
        subType: myProfile ? PROFILE_TYPES.MY : PROFILE_TYPES.OTHER,
        payload: images
      });
      dispatch({ type: GET_USER_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_PROFILE_FAILURE, error: true, payload: error }));
}


// Fetchs this/current user profile
export const fetchUserProfile = () => (dispatch, getState) => {
  const id = getUserId(getState());

  if (!isNil(id)) {
    dispatch(fetchUserImages(id, true));
  }
}

// # Open user view
// Params
// user: javascript object
// avatar: string (url)
export const openUserView = (user, avatar) => dispatch => {
  trackEvent('user', 'open', user.name);

  dispatch(fetchUserImages(user.id));
  return dispatch({ type: SET_USER_PROFILE, payload: Object.assign(user, { profilePicture: avatar }) });
}

export const closeUserView = () => ({ type: CLOSE_USER_VIEW });

// # Reducer
const initialState = fromJS({
  myProfile: {},
  profile: {},
  isLoading: false,
  selectedUser: null,
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE: {
      const target = action.subType === PROFILE_TYPES.MY ? 'myProfile' : 'profile';
      return state.set(target, fromJS(action.payload));
    }

    case CLOSE_USER_VIEW: {
      return state.set('profile', Map())
    }

    case GET_USER_PROFILE_REQUEST: {
      return state.merge({
        profile: Map(),
        isLoading: true
      });
    }

    case GET_USER_PROFILE_SUCCESS:
    case GET_USER_PROFILE_FAILURE: {
      return state.set('isLoading', false);
    }

    case VOTE_FEED_ITEM_REQUEST: {
      const list = state.getIn(['profile', 'images'], List());
      const voteItemIndex = list.findIndex((item) => item.get('id') === action.feedItemId);

      // const myList = state.getIn(['myProfile', 'images'], List());
      // const myVoteItemIndex = myList.findIndex((item) => item.get('id') === action.feedItemId);

      if (voteItemIndex < 0) {
        return state;
      } else {
        return state.mergeIn(['profile', 'images', voteItemIndex], fromJS({
          userVote: action.value,
          votes: action.votes
        }));
      }
    }

    case SET_COMMENTS: {
      const list = state.getIn(['profile', 'images'], List());
      const itemIndex = list.findIndex((item) => item.get('id') === action.payload.postId);

      if (itemIndex < 0) {
        console.log('Tried to update comment count for user image posts, but it was not found from state:', itemIndex);
        return state;
      } else {
        console.log('updating comment count for user image posts', itemIndex);
        return state.setIn(['profile', 'images', itemIndex, 'commentCount'], action.payload.comments.length || 0);
      }
    }

    default: {
      return state;
    }
  }
}
