import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
    auth: any;
}

const reducers = {
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function appReducer(state: any, action: any) {
    if (process.env.ENV === 'Production') {
        return productionReducer(state, action);
    } else {
        return developmentReducer(state, action);
    }
}
