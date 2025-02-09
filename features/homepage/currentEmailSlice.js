import { createSlice } from "@reduxjs/toolkit";

const currentEmailSlice = createSlice({
    name: "currentEmail",
    initialState: {
        value: null
    },

    reducers: {
        setCurrentEmail: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setCurrentEmail } = currentEmailSlice.actions;
export default currentEmailSlice.reducer;