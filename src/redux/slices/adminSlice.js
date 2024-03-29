import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fileSliceActions } from './fileSlice';


export const { loadFiles } = fileSliceActions;

export const initialAdminState = {
  users: [],
  files: [],
  loading: false,
  error: null
}

export const loadUsers = createAsyncThunk(
  'admin/loadUsers',
  async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid data');
    }

    const data = await response.json();
    return data
  }
)

export const createUser = createAsyncThunk(
  'admin/createUser',
  async ({ username, password, is_staff }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
      },
      body: JSON.stringify({ username, password, is_staff })
    });

    if (!response.ok) {
      throw new Error('Invalid data');
    }
    const data = await response.json();
    return data
  }
)

export const editUser = createAsyncThunk(
  'admin/editUser',
  async ({ userId, newUsername, isStaff }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
      },
      body: JSON.stringify({ username: newUsername, is_staff: isStaff })
    });

    if (!response.ok) {
      throw new Error('Invalid data');
    }
    const data = await response.json();
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid data');
    }
    const data = await response.json();
    return data;
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.users = action.payload
      });
    builder.addCase(loadFiles.fulfilled, (state, action) => {
      state.files = action.payload
    });
  },
});


export default adminSlice.reducer