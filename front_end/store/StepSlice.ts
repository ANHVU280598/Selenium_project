import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Adjust as needed

export interface Step {
  StepOrder: number;
  ActionId: string;
  XPath: string;
  folder_path: string;
  file_name: string;
  Text: string;
  ActionName: string;
}
export const clearedStep: Step = {
  StepOrder: 0,
  ActionId: '',
  XPath: '',
  folder_path: '',
  file_name: '',
  Text: '',
  ActionName: ''
};

interface StepState {
  sop_name: string;
  setUpType: 'initial' | 'final';
  list_step: Step[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  actionList: string[];
}

// POST to get all steps with given sop_id and setup_type
export const fetchAllStep = createAsyncThunk(
  'sops/fetchAllStep',
  async (payload: { sop_name: string; setup_type: string }) => {
    const res = await axios.post(`${API_BASE}/get_all_step`, payload);
    return res.data;
  }
);

export const fetchActions = createAsyncThunk('sops/fetchActions', async () => {
  const res = await axios.get(`${API_BASE}/get_action`);
  return res.data;
});


const stepsSlice = createSlice({
  name: 'steps',
  initialState: {
    sop_name: '',
    setUpType: 'initial',
    list_step: [],
    status: 'idle',
    error: null,
    actionList: []
  } as StepState,
  reducers: {
    setSelectedSop(state, action: PayloadAction<string>){
      state.sop_name = action.payload
    },
    setSteps: (state, action: PayloadAction<Step[]>)=>{
      state.list_step = action.payload
    },
    setSetUpType: (state, action: PayloadAction<'initial' | 'final'>)=>{
      state.setUpType = action.payload;
    },
    clearSteps: (state) => {
      state.list_step = [];
    },
    removeStepByIndex: (state, action: PayloadAction<number>) => {
      state.list_step.splice(action.payload, 1);
    }

  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllStep.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAllStep.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.list_step = action.payload;
          console.log(state.list_step);
          
        })
        .addCase(fetchAllStep.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch SOPs';
        });
    },

});


export const {setSteps, setSelectedSop, setSetUpType} = stepsSlice.actions;
export default stepsSlice.reducer;
