import { combineReducers } from "@reduxjs/toolkit";
import isEmailTokenPresentReducer from "../features/homepage/isEmailTokenPresentSlice";
import allMessagesRecordOfCurrentEmailReducer from "../features/homepage/allMessagesRecordOfCurrentEmailSlice";
import currentEmailReducer from "../features/homepage/currentEmailSlice";
import singleMessageDetailReducer from "../features/homepage/singleMessageDetailSlice";


const rootReducer = combineReducers({
    isEmailTokenPresent: isEmailTokenPresentReducer,
    allMessagesRecordOfCurrentEmail: allMessagesRecordOfCurrentEmailReducer,
    currentEmail: currentEmailReducer,
    singleMessageDetail: singleMessageDetailReducer
});

export default rootReducer;