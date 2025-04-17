import { configureStore } from '@reduxjs/toolkit';
import sopReducer from './sopSlice';
import stepReducer from './StepSlice'

export const store = configureStore({
  reducer: {
    sop: sopReducer,
    steps: stepReducer
  },
});

// ✅ Add these exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
