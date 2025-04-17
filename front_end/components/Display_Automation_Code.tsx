import { Step } from '@/store/StepSlice';
import React, { useState } from 'react'


interface StepMenuProps {
    step: Step;
  }

export default function Display_Automation_Code({step} : StepMenuProps ) {
    const [isEdit, setEdit] = useState(false)
    return (
        <tr>
            <td className="border px-4 py-2 text-center">{step.StepOrder}</td>
            <td className="border px-4 py-2 text-center">{step.ActionName}</td>
            <td className="border px-4 py-2 text-center">{step.XPath}</td>
            <td className="border px-4 py-2 text-center">{step.Text}</td>
            <td className="border px-4 py-2 text-center">
                {
                    (isEdit) ? <div className='flex flex-row'>
                        <div className='bg-green-300 p-1 rounded-l-xl hover:bg-green-300/70 cursor-pointer'>Save</div>
                        <div className='bg-green-300 p-1 bg-purple-300 hover:bg-purple-300/70 cursor-pointer' onClick={()=>setEdit(false)}>Discard</div>
                        <div className='bg-red-300 p-1 rounded-r-xl hover:bg-red-300/70 cursor-pointer'>Delete</div>
                    </div>
                        :
                        <div className='bg-purple-300 rounded-md border-1 border-black hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(true)}>Edit</div>
                }
            </td>
        </tr>
    )
}
