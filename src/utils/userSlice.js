import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        addUser: (state, action) => {
            return  action.payload;
            //state will become action.payload 
        },
        removeUser: (state,action) => {
           return null;
        }
    },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;