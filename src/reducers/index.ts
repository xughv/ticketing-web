import * as actions from '../actions';
import { combineReducers } from 'redux';

const defaultDataState = {
  carouselImages: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn'],
  curArea: { id: 0, nm: "番禺区" },
  movieList: [],
  areaList: [],
  cinemaList: [],
  seatsInfo: [],
  showInfo: null,
  movieDetail: null
}

/**
 * 如 action 中包含 response 和 field, 更新 state[field]
 */
function data(state = defaultDataState, action) {
  console.log(action);
  if (action.response && action.field && action.response.data) {
    const data = action.response.data;
    const s = Object.assign({}, state, {
      [action.field]: action.response.data
    });
    return s;
  } else {

    switch(action.type) {
      case actions.CHANGE_AREA:
        return Object.assign({}, state, {
          curArea: action.area
        });
    }

  }

  return state;
}

export default {
  data
};
