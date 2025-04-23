import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // Adjust as needed
export interface Step {
  stepId: number;
  setUpId: number;
  stepOrder: number;
  actionId: string;
  actionName: string;
  xPath: string;
  folder_path: string;
  file_name: string;
  text: string;
}
export const clearedStep: Step = {
  stepId: 0,
  setUpId: 0,
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
  status_steps: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  stepObj: {
    stepId: number;
    setUpId: number;
    stepOrder: number;
    actionId: string;
    actionName: string;
    xPath: string;
    folder_path: string;
    file_name: string;
    text: string;
  }
  refreshListStep: boolean
}

// POST to get all steps with given sop_id and setup_type
export const fetchAllStep = createAsyncThunk(
  'sops/fetchAllStep',
  async (payload: { sop_name: string; setup_type: string }) => {
    const res = await axios.post(`${API_BASE}/get_all_step`, payload);

    const rawSteps = res.data;
    // Convert snake_case from API to camelCase used in Step
    const transformedSteps: Step[] = rawSteps.map((step: any) => ({
      stepId: step.StepId,
      stepOrder: step.StepOrder,
      actionId: step.ActionId,
      setUpId: step.SetupId,
      actionName: step.ActionName,
      xPath: step.XPath,
      folder_path: step.Folder_Path,
      file_name: step.File_Path,
      text: step.Text,
    }));

    return transformedSteps
  }
);

export const run_code = createAsyncThunk(
  'sops/runCode',
  async (payload: { sop_name: string; setup_type: string }) => {
    const res = await axios.post(`${API_BASE}/run_code`, payload);
    return 'Run Code Success'
  }
);

export const fetchActions = createAsyncThunk('sops/fetchActions', async () => {
  const res = await axios.get(`${API_BASE}/get_action`);
  return res.data;
});

export const delete_step_order = createAsyncThunk('sops/delete_step_order', async (oldStep: { stepOrder: number, setUpId: number }) => {
  await axios.delete(`${API_BASE}/delete_step_order`, { data: oldStep });
})

// addNewStep
export const addNewStep = createAsyncThunk('sops/addStep', async ({ sop_name, setUpType, step }: { sop_name: string; setUpType: 'initial' | 'final'; step: Step }) => {
  const newStep = { ...step, sop_name, setUpType }
  await axios.post(`${API_BASE}/add_step`, newStep);
});

export const updateStepValue = createAsyncThunk('sops/updateNewStepValue', async(stepUpdateObject:{}) => {  
  await axios.post(`${API_BASE}/update_step_value`, stepUpdateObject )
})


const stepsSlice = createSlice({
  name: 'steps',
  initialState: {
    sop_name: '',
    setUpType: 'initial',
    list_step: [],
    refreshListStep:false,
    status_steps: 'idle',
    error: null,
    stepObj: {
      stepId: 0,
      setUpId: 0,
      stepOrder: 0,
      actionId: '',
      actionName: 'click',
      xPath: 'NA',
      folder_path: 'NA',
      file_name: 'NA',
      text: 'NA'
    }
  } as StepState,
  reducers: {
    setSelectedSop(state, action: PayloadAction<string>) {
      state.sop_name = action.payload
    },
    setSetUpType: (state, action: PayloadAction<'initial' | 'final'>) => {
      state.setUpType = action.payload;
    },
    setStepObjField(
      state,
      action: PayloadAction<{ key: keyof Step; value: string | number }>
    ) {
      (state.stepObj[action.payload.key] as any) = action.payload.value;
    },
    resetStepObj(state) {
      state.stepObj = {
        stepId: 0,
        stepOrder: 0,
        actionId: '',
        setUpId:0,
        actionName: 'click',
        xPath: '',
        folder_path: '',
        file_name: '',
        text: ''
      };
    },
    addNewStepToList(state, action: PayloadAction<Step>){
      state.list_step.push(action.payload)
      resetStepObj()
    },
    clearSteps: (state) => {
      state.list_step = [];
    },
    removeStepByIndex: (state, action: PayloadAction<number>) => {
      state.list_step.splice(action.payload, 1);
    },
    refreshStep: (state) => {
      state.refreshListStep = !state.refreshListStep
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStep.pending, (state) => {
        state.status_steps = 'loading';
      })
      .addCase(fetchAllStep.fulfilled, (state, action) => {
        state.status_steps = 'succeeded';
        state.list_step = action.payload;
        console.log(state.list_step);
      })
      .addCase(fetchAllStep.rejected, (state, action) => {
        state.status_steps = 'failed';
        state.error = action.error.message || 'Failed to fetch SOPs';
      });
  },

});


export const { setSelectedSop, setSetUpType, setStepObjField, resetStepObj, removeStepByIndex, refreshStep, addNewStepToList } = stepsSlice.actions;
export default stepsSlice.reducer;
