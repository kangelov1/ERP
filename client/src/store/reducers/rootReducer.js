import authReducer from './authReducer'
import materialsReducer from './materialsReducer'

import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    auth:authReducer,
    materials:materialsReducer
})

export default rootReducer