import { createSlice } from "@reduxjs/toolkit";

const allMessagesRecordOfCurrentEmailSlice = createSlice({
    name: "allMessagesRecordOfCurrentEmail",
    initialState: {
        value: null
    },

    reducers: {
        setAllMessagesRecordOfCurrentEmail: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setAllMessagesRecordOfCurrentEmail } = allMessagesRecordOfCurrentEmailSlice.actions;
export default allMessagesRecordOfCurrentEmailSlice.reducer;