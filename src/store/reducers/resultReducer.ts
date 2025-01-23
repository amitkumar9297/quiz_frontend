import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${import.meta.env.VITE_BASE_URL}/results/user`;

// Fetch results using RTK Query
export const fetchResults = createAsyncThunk('results/fetchResults', async (userId: string) => {
  const response = await fetch(`${API_URL}/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }
  return await response.json();
});
const resultSlice = createSlice({
    name: 'results',
    initialState: {
      results: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchResults.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchResults.fulfilled, (state, action) => {
          state.loading = false;
          state.results = action.payload;
        })
        .addCase(fetchResults.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An unknown error occurred';
        });
    },
  });
  
  export default resultSlice.reducer;
  