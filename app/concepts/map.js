// # concepts/map
// This is so called 'view concept'
// that combines core concepts like 'marker' and 'event'

import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { has, chain } from 'lodash';
import moment from 'moment';

import { getCurrentCityName } from './city';
import {
  updateShowFilter as _updateShowFilter,
  toggleLocateMe as _toggleLocateMe
} from '../actions/event';
import { fetchMarkers as _fetchMarkers } from '../actions/marker';

import { isLocating, getShowFilter, getEvents, getEventListState } from '../reducers/event';
import * as m from '../reducers/marker';
import { getAllPostsInStore } from '../reducers/feed';
import LoadingStates from '../constants/LoadingStates';
import MarkerImages from '../constants/MarkerImages';
import time from '../utils/time';
import location from '../services/location';
import { HELSINKI, CITY_CATEGORIES, CITY_MAX_DISTANCE } from '../constants/Cities';

// # Selectors
const getSelectedCategory = state => state['map'].get('selectedCategory');
const getSelectedMarker = state => state['map'].get('selectedMarker');

const isMapLoading = createSelector(
  m.getMarkerListState, getEventListState, (a, b) =>
  a === LoadingStates.LOADING || b === LoadingStates.LOADING
);

const isEventBetweenSelectedTime = (event, firstFutureEvent, showFilter) => {
  switch (showFilter) {
    case '24H':
    return firstFutureEvent &&
      firstFutureEvent.get('endTime') &&
      time.eventsBetweenHours(event.get('endTime'), firstFutureEvent.get('endTime'), 24);
    default:
      return true;
  }
}

const getFirstFutureEvent = createSelector(
  getEvents, (events) => {
    const event = chain(events.toJS())
      .filter(item => time.isEventInFuture(item.endTime))
      .sortBy(item => time.getTimeStamp(item.endTime))
      .head()
      .value();

    return fromJS(event);
  }
)

const getMarkers = createSelector(
  m.getMarkers, getAllPostsInStore,
  (markers, posts) => {
    const postMarkers = posts.filter(post => post.has('location'));
    return postMarkers.concat(markers);
  }
)

const locationFilter = (marker, category) => {
  const markerLocation = marker.get('location').toJS();
  const categoryCenter = CITY_CATEGORIES[category];

  if (!markerLocation || !categoryCenter) {
    return false;
  }

  return location.getDistanceInMeters(markerLocation, categoryCenter) <= CITY_MAX_DISTANCE;
}

const stickyMarkerCategories = ['HOTEL'];
const getMapMarkers = createSelector(
  getMarkers, getSelectedCategory,
  (markers, categoryFilter) => {

    const validMarkers = markers
      .filter(marker => marker.has('location'))
      .filter(marker => locationFilter(marker, categoryFilter))

    return validMarkers;
});

const getMapMarkersCoords = createSelector(getMapMarkers, markers => {
  return markers.map(marker => marker.get('location')).toJS();
});



const getMarkerCategories = createSelector(
  m.getMarkers, (markers) => {
    const validMarkers = markers
      .map(marker => marker.get('type', '').toUpperCase())
      .toSet().toList(); // Immutable uniq

    return validMarkers;
    // return validMarkers.unshift('ALL');
  }
);

const cityCategories = fromJS(Object.keys(CITY_CATEGORIES))

// View concept selector
export const mapViewData = createStructuredSelector({
  currentCity: getCurrentCityName,
  locateMe: isLocating,
  showFilter: getShowFilter,
  events: getEvents,
  markers: getMarkers,
  loading: isMapLoading,
  mapMarkers: getMapMarkers,
  firstFutureEvent: getFirstFutureEvent,
  selectedMarker: getSelectedMarker,
  selectedCategory: getSelectedCategory,
  categories: getMarkerCategories,
  visiblemarkerCoords: getMapMarkersCoords
})

// # Action types & creators
const SELECT_MARKER = 'map/SELECT_MARKER';
const SELECT_CATEGORY = 'map/SELECT_CATEGORY';

export const fetchMarkers = _fetchMarkers;
export const updateShowFilter = _updateShowFilter;
export const toggleLocateMe = _toggleLocateMe;

export const selectMarker = payload => ({ type: SELECT_MARKER, payload });
export const selectCategory = payload => (dispatch) => Promise.resolve(
  dispatch({ type: SELECT_CATEGORY, payload })
);

// # Reducer
const initialState = fromJS({
  selectedMarker: null,
  selectedCategory: HELSINKI,
});

export default function map(state = initialState, action) {
  switch (action.type) {
    case SELECT_MARKER: {
      return state.set('selectedMarker', fromJS(action.payload));
    }

    case SELECT_CATEGORY: {
      return state.merge({
        selectedCategory: action.payload,
        selectedMarker: null
      });
    }

    default: {
      return state;
    }
  }
}

