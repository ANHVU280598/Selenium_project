import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Step } from '@/store/StepSlice';
interface Props {
    setTempStepAdd: React.Dispatch<React.SetStateAction<Step>>;
  }
export default function XpathMenu({setTempStepAdd}:Props) {

    return (
        <input className='py-1 text-center bg-white rounded-md' placeholder='xpath go here'/>
    );
}