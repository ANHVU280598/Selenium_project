import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { delete_step_order, refreshStep, removeStepByIndex, setStepObjField, Step, updateStepValue } from '@/store/StepSlice';
import React, { useState } from 'react'
import ActionMenu from './Action_Menu';
import XpathMenu from './Xpath_Menu';
import TextMenu from './Text_Menu';


interface StepMenuProps {
    step: Step;
    index: number
  }

export default function Display_Automation_Code({step, index} : StepMenuProps ) {
    const [isEdit, setEdit] = useState(false)
    const dispatch = useAppDispatch()
    const stepObjField = useAppSelector((state) => state.steps.stepObj)

    const handleDelete = (stepOrder: number, setUpId: number, index:number) => {
        dispatch(delete_step_order({stepOrder, setUpId}))
        dispatch(removeStepByIndex(index))
        dispatch(refreshStep())
    }

    const updateDb = (stepId: number) => {
        dispatch(setStepObjField({key: 'stepId', value: stepId}))
        dispatch(updateStepValue(stepObjField))          
    }

    const displayText = () => {
        if (step.actionName == 'upload' && !isEdit){
            return <>{step.folder_path}/{step.file_name}</>
        }  
        if (step.actionName != 'upload' && !isEdit){
            return <>{step.text}</>
        }   
        return <TextMenu/>
    }
    return (
        <tr>
            <td className="border px-4 py-2 text-center">{step.stepOrder}</td>
            <td className="border px-4 py-2 text-center">{isEdit ? <ActionMenu/> : <>{step.actionName}</>}</td>
            <td className="border px-4 py-2 text-center">{isEdit ? <XpathMenu/> : <>{step.xPath}</>}</td>
            <td className="border px-4 py-2 text-center">
                {displayText()}
            </td>
            <td className="border px-4 py-2 text-center">
                {
                    (isEdit) ? <div className='flex flex-row'>
                        <div className='bg-green-300 p-1 rounded-l-xl hover:bg-green-300/70 cursor-pointer' onClick={()=> updateDb(step.stepId)}>Save</div>
                        <div className='bg-green-300 p-1 bg-purple-300 hover:bg-purple-300/70 cursor-pointer' onClick={()=>setEdit(false)}>Discard</div>
                        <div className='bg-red-300 p-1 rounded-r-xl hover:bg-red-300/70 cursor-pointer' onClick={()=> handleDelete(step.stepOrder, step.setUpId, index)}>Delete</div>
                    </div>
                        :
                        <div className='bg-purple-300 rounded-md border-1 border-black hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(true)}>Edit</div>
                }
            </td>
        </tr>
    )
}
