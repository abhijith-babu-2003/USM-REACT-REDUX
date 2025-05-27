/* eslint-disable @typescript-eslint/no-unused-vars */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../api/userAuth";

interface Users {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    profileImage: string;
    phone: number;
}
  
interface Authstate {
  user: Users | null;
  loading: boolean;
  error: string | null;
}

const initialState: Authstate = {
  user: null,
  loading: false,
  error: null,
};

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (updatedData:Partial<Users>,{rejectWithValue}) => {
        try {
            const response = await axios.patch(`${API_URL}/updateProfile`,updatedData,{
                headers:{Authorization:`Bearer ${updatedData.token}`}
            });
            console.log("API Response",response.data);
            return response.data.user
        } catch (error) {
            return rejectWithValue( "Failed to update profile");
        }
    }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginsuccess: (state, action: PayloadAction<Users>) => {
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<Users>) => {
        state.loading = false;
        state.user ={...state.user,...action.payload}
      
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginsuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;