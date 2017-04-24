import { combineReducers } from "redux"
import formFields from "./formReducers";
// import todos from "./todos"
// import visibilityFilter from "./visibilityFilter"

const combinedReducers = combineReducers({
    formFields
//   todos,
//   visibilityFilter
})

export default combinedReducers;