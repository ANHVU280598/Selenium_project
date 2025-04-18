import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Adjust as needed

export interface Step {
  stepOrder: number;
  actionId: string;
  actionName: string;
  xPath: string;
  folder_path: string;
  file_name: string;
  text: string;
}
export const clearedStep: Step = {
  stepOrder: 0,
  actionId: '',
  xPath: '',
  folder_path: '',
  file_name: '',
  text: '',
  actionName: ''
};

interface StepState {
  sop_name: string;
  setUpType: 'initial' | 'final';
  list_step: Step[];
  actionName: string;
  text: string;
  folder_path: string;
  file_name: string;
  xPath: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  stepObj: {
    stepOrder: number;
    actionId: string;
    actionName: string;
    xPath: string;
    folder_path: string;
    file_name: string;
    text: string;
  }
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
    actionName: 'open',
    text: '',
    folder_path: '',
    file_name: '',
    xPath: '',
    status: 'idle',
    error: null,
    stepObj: {
      stepOrder: 0,
      actionId: '',
      actionName: '',
      xPath: '',
      folder_path: '',
      file_name: '',
      text: ''
    }
  } as StepState,
  reducers: {
    setSelectedSop(state, action: PayloadAction<string>){
      state.sop_name = action.payload
    },
    setSetUpType: (state, action: PayloadAction<'initial' | 'final'>)=>{
      state.setUpType = action.payload;
    },
    setSteps: (state, action: PayloadAction<Step[]>)=>{
      state.list_step = action.payload
    },
    addStep: (state, action: PayloadAction<Step>)=>{
      state.list_step.push(action.payload)
    },
    setActionName: (state, action: PayloadAction<string>)=>{
      state.actionName = action.payload;
    },
    setText: (state, action: PayloadAction<string>)=>{
      state.text = action.payload
    },
    setFolderPath: (state, action: PayloadAction<string>)=>{
      state.folder_path = action.payload
    },
    setFileName: (state, action: PayloadAction<string>)=>{
      state.file_name = action.payload
    },
    setXPath: (state, action: PayloadAction<string>)=>{
      state.xPath = action.payload
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


export const {setSelectedSop, setSetUpType, setSteps, addStep, setActionName, setText, setFolderPath, setFileName, setXPath} = stepsSlice.actions;
export default stepsSlice.reducer;
