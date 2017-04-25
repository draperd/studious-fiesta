import { combineReducers } from "redux"
import forms from "./formReducers";
// import todos from "./todos"
// import visibilityFilter from "./visibilityFilter"

const combinedReducers = combineReducers({
    forms
//   todos,
//   visibilityFilter
})

export default combinedReducers;