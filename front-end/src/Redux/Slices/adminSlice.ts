/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from "axios";
import { ADMIN_API_URL, deleteUserAPI } from '../../api/adminAuth'

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    profileImage: string;
    phone: number;
}

interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    profileImage: string;
    phone: number;
}

interface AdminState {
    admin: Admin | null;
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    admin: null,
    users: [],
    loading: false,
    error: null,
};

export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${ADMIN_API_URL}/getUsers`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            return response.data.users || [];
        } catch (error: any) {
            console.error('Error fetching users:', error); 
            return rejectWithValue(error.response?.data || "Failed to fetch users");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async ({ userId, token }: { userId: string; token: string }, { rejectWithValue }) => {
        try {
            await deleteUserAPI(userId, token);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to delete user");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLoginSuccess: (state, action: PayloadAction<Admin>) => {
            state.admin = action.payload;
        },
        adminLogout: (state) => {
            state.admin = null;
            state.users = [];
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {        
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = Array.isArray(action.payload)?action.payload : [];
                state.error = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Error deleting user";
            })
            
    },
});

export const { adminLoginSuccess, adminLogout, setError, setLoading } = adminSlice.actions;
export default adminSlice.reducer;