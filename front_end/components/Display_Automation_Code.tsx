import { useAppDispatch } from '@/store/hooks';
import { delete_step_order, refreshStep, removeStepByIndex, Step } from '@/store/StepSlice';
import React, { useState } from 'react'


interface StepMenuProps {
    step: Step;
    index: number
  }

export default function Display_Automation_Code({step, index} : StepMenuProps ) {
    const [isEdit, setEdit] = useState(false)
    const dispatch = useAppDispatch()

    const handleDelete = (stepOrder: number, setUpId: number, index:number) => {
        dispatch(delete_step_order({stepOrder, setUpId}))
        dispatch(removeStepByIndex(index))
        dispatch(refreshStep())
    }
    return (
        <tr>
            <td className="border px-4 py-2 text-center">{step.stepOrder}</td>
            <td className="border px-4 py-2 text-center">{step.actionName}</td>
            <td className="border px-4 py-2 text-center">{step.xPath}</td>
            <td className="border px-4 py-2 text-center">{step.text}</td>
            <td className="border px-4 py-2 text-center">
                {
                    (isEdit) ? <div className='flex flex-row'>
                        <div className='bg-green-300 p-1 rounded-l-xl hover:bg-green-300/70 cursor-pointer'>Save</div>
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
