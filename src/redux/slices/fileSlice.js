import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const initialFileState = {
  files: [],
  loading: false,
  error: null,
  success: null,
};


export const editFile = createAsyncThunk(
  'file/editFile',
  async ({ fileId, newFilename, newDescription }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/${fileId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
        },
        body: JSON.stringify({ filename: newFilename, description: newDescription }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    } catch (error) {
      console.error(error);
    }
  }
);


export const loadFiles = createAsyncThunk(
  "file/loadFiles",
  async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/`, {
        credentials: 'include',
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + user.token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error(error);
    }
  }
);


export const deleteFile = createAsyncThunk(
  'file/deleteFile',
  async (fileId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/${fileId}`, {
        credentials: 'include',
        headers: {
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token
        },
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

    } catch (error) {
      console.error(error);
    }
  }
);


export const downloadFile = createAsyncThunk(
  'file/downloadFile',
  async (fileId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/${fileId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + JSON.parse(sessionStorage.getItem('user')).token,
        },
      });

      const fileData = await response.json();
      const fileUrl = fileData.file;
      const fileResponse = await fetch(fileUrl);

      if (!fileResponse.ok) {
        const errorMessage = await fileResponse.text();
        console.error('File response error:', errorMessage);
        throw new Error("Network response was not ok");
      }

      const data = await fileResponse.blob();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', fileData.filename);
      document.body.appendChild(link);
      link.click();


    } catch (error) {
      console.error(error);
    }
  }
);


export const uploadFile = createAsyncThunk(
  'file/uploadFile',
  async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/`, {
        headers: {
          'Authorization': 'Token ' + JSON.parse(sessionStorage.getItem('user')).token,
        },
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

    } catch (error) {
      console.error(error);
    }
  }
);

export const fileSliceActions = {
  loadFiles: loadFiles,
};

const fileSlice = createSlice({
  name: 'file',
  initialState: initialFileState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadFiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadFiles.fulfilled, (state, action) => {
      state.loading = false;
      state.files = action.payload;
    });
    builder.addCase(loadFiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load files';
    });
    builder.addCase(editFile.fulfilled, (state, action) => {
      state.success = true;
      state.error = null;
    });
    builder.addCase(editFile.rejected, (state, action) => {
      state.success = false;
      state.error = action.error.message || 'File renaming failed';
    });
    builder.addCase(deleteFile.rejected, (state, action) => {
      state.success = false;
      state.error = action.error.message || 'File deletion failed';
    });
    builder.addCase(downloadFile.rejected, (state, action) => {
      state.success = false;
      state.error = action.error.message || 'File download failed';
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.success = false;
      state.error = action.error.message || 'File upload failed';
    });
  },
});

export default fileSlice.reducer;
