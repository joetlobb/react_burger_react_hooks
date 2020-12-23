import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';

import * as actions from '../actions/index';

export function* initIngredientSaga(action) {
  try {
    const response = yield axios.get('https://react-burger-builder-1fc0e.firebaseio.com/ingredients.json')
    yield put(actions.setIngredients(response.data));
  } catch (error) {
    yield put(actions.fetchIngredientsFailed());
  };
};