import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setStepObjField } from '@/store/StepSlice';

export default function TextMenu() {
    const dispatch = useAppDispatch()
    const actionName = useAppSelector((state) => state.steps.stepObj.actionName)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            console.log(`file change ${file.name}`);
            dispatch(setStepObjField({key: 'file_name', value: file.name}))
        }
        
    }
    const handleFolderChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const folder = e.target.value
        dispatch(setStepObjField({key: 'folder_path', value: folder}))
    }

    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        dispatch(setStepObjField({key: 'text', value: text}))
    
        
    }
    return (
        <div className="">
            {
                (actionName == "upload") ?
                    <div className='flex items-center justify-center w-full'>
                        <input className='w-[100px] text-xs bg-white rounded-full p-1' placeholder='Folder Path' onChange={handleFolderChange}/>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className='text-[10px] bg-blue-900/50 rounded-full p-1'
                            name="file_name"
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