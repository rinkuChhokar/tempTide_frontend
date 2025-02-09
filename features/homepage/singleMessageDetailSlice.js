import { createSlice } from "@reduxjs/toolkit";

const singleMessageDetailSlice = createSlice({
    name: "singleMessageDetail",
    initialState: {
        value: null
    },

    reducers: {
        setSingleMessageDetail: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setSingleMessageDetail } = singleMessageDetailSlice.actions;
export default singleMessageDetailSlice.reducer;