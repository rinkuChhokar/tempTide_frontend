import { createSlice } from "@reduxjs/toolkit";

const isEmailTokenPresentSlice = createSlice({
    name: "isEmailTokenPresent",
    initialState: {
        value: false
    },

    reducers: {
        setIsEmailTokenPresent: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setIsEmailTokenPresent } = isEmailTokenPresentSlice.actions;
export default isEmailTokenPresentSlice.reducer;