import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Adjust as needed

interface Sop {
  id: number;
  name: string;
}

interface SopsState {
  list: Sop[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// GET all SOPs
export const fetchSops = createAsyncThunk('sops/fetchSops', async () => {
  const res = await axios.get(`${API_BASE}/get_sop`);
  return res.data;
});

// POST new SOP
export const postSop = createAsyncThunk('sops/postSop', async (newSop: { sop_name: string }, { dispatch }) => {
  await axios.post(`${API_BASE}/add_sop`, newSop);
  dispatch(fetchSops()); // Trigger re-fetch
});

// DELETE an SOP
export const delSop = createAsyncThunk('sops/delsop', async (oldSop: { sop_name: string }, { dispatch }) => {
  await axios.delete(`${API_BASE}/delete_sop`, {data: oldSop});
  dispatch(fetchSops());
})

const sopsSlice = createSlice({
  name: 'sops',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  } as SopsState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSops.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchSops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch SOPs';
      });
  },
});


// export const {setSelectedSop, clearSelectedSop} = sopsSlice.actions;
export default sopsSlice.reducer;
