import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Step } from '@/store/StepSlice';

interface Props {
    setTempStepAdd: React.Dispatch<React.SetStateAction<Step>>;
  }
export default function TextMenu({setTempStepAdd}:Props) {
    const step = useAppSelector((state)=>state.steps)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTempStepAdd(prev => ({...prev, file_name: file.name}))
        }
    }
    const handleFolderChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const folder = e.target.value
        setTempStepAdd(prev => ({...prev, folder_path: folder}))
    }

    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setTempStepAdd(prev => ({...prev, Text: text}))
    }
    return (
        <div className="">
            {
                (step.actionName == "upload") ?
                    <div className='flex items-center justify-center w-full'>
                        <input className='w-[100px] text-xs bg-white rounded-full p-1' placeholder='Folder Path' onChange={handleFolderChange} required/>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className='text-[10px] bg-blue-900/50 rounded-full p-1'
                            name="file_name"
                            required
                        />
                    </div>
                    :
                    <>
                        <input className='text-center bg-white py-1 rounded-md w-full' placeholder='(User name, Password)' onChange={handleTextChange}/>
                    </>
            }
        </div>
    );
}