import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { delete_step_order, refreshStep, removeStepByIndex, Step, updateStepValue } from '@/store/StepSlice';
import React, { useEffect, useState } from 'react'


interface StepMenuProps {
    step: Step;
    index: number
}

export default function Display_Automation_Code({ step, index }: StepMenuProps) {
    const dispatch = useAppDispatch()
    const actionNameList = useAppSelector((state) => state.sops.actionNameList)
    const [isEdit, setEdit] = useState(false)
    const [tempObjStep, setTempObjStep] = useState({
        "actionName": "open",
        "file_name": "",
        "folder_path": "",
        "stepId": 0,
        "text": "",
        "xPath": ""
    })

    useEffect(() => {
        setTempObjStep(step)
    }, [step])

    useEffect(() => {
        console.log(tempObjStep);
    }, [tempObjStep])


    const handleDelete = (stepOrder: number, setUpId: number, index: number) => {
        dispatch(delete_step_order({ stepOrder, setUpId }))
        dispatch(removeStepByIndex(index))
        dispatch(refreshStep())
    }

    const updateDb = () => {
        dispatch(updateStepValue(tempObjStep))
        setEdit(false)
    }


    const actionNameMenu = () => {
        const handlingActionMenu = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setTempObjStep(prev => ({
                ...prev,
                "actionName": e.target.value
            }))
        }
        return (
            <div className="text-md">
                <select
                    id="actionType"
                    value={tempObjStep.actionName}
                    onChange={handlingActionMenu}
                    className=" text-center w-full text-md"
                >
                    {actionNameList.map((action) => (
                        <option key={action.id} value={action.name} className="text-md">
                            {action.name}
                        </option>
                    ))}
                </select>
            </div>
        )

    }
    const xpathInput = () => {
        const handleXPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTempObjStep(prev => ({
                ...prev,
                "xPath": e.target.value
            }))
        }
        return (
            <input className='py-1 text-center bg-white rounded-md' placeholder='xpath go here' onChange={handleXPathChange} />
        )
    }
    const displayText = () => {
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setTempObjStep(prev => ({
                    ...prev,
                    "file_name": e.target.value
                }))
            }
        }
        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setTempObjStep(prev => ({
                ...prev,
                "text": e.target.value
            }))
        }
        if (tempObjStep.actionName == 'upload' && !isEdit) {
            return <>{tempObjStep.folder_path}/{tempObjStep.file_name}</>
        }
        if (tempObjStep.actionName != 'upload' && !isEdit) {
            return <>{tempObjStep.text}</>
        }
        return ((tempObjStep.actionName == "upload") ?
            <div className='flex items-center justify-center w-full'>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className='text-[10px] bg-blue-900/50 rounded-full p-1'
                    name="file_name"
                />
            </div>
            :
            <>
                <input className='text-center bg-white py-1 rounded-md w-full' placeholder='(User name, Password)' onChange={handleTextChange} />
            </>
        )
    }
    return (
        <tr>
            <td className="border px-4 py-2 text-center">{step.stepOrder}</td>
            <td className="border px-4 py-2 text-center">{isEdit ? <div className="flex justify-center items-center h-full">
                {actionNameMenu()}
            </div> : <>{tempObjStep.actionName}</>}</td>
            <td className="border px-4 py-2 text-center">{isEdit ? <>{xpathInput()}</> : <>{tempObjStep.xPath}</>}</td>
            <td className="border px-4 py-2 text-center">
                {displayText()}
            </td>
            <td className="border px-4 py-2 text-center">
                {
                    (isEdit) ? <div className='flex flex-row'>
                        <div className='bg-green-300 p-1 rounded-l-xl hover:bg-green-300/70 cursor-pointer' onClick={() => updateDb()}>Save</div>
                        <div className='bg-green-300 p-1 bg-purple-300 hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(false)}>Discard</div>
                        <div className='bg-red-300 p-1 rounded-r-xl hover:bg-red-300/70 cursor-pointer' onClick={() => handleDelete(step.stepOrder, step.setUpId, index)}>Delete</div>
                    </div>
                        :
                        <div className='bg-purple-300 rounded-md border-1 border-black hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(true)}>Edit</div>
                }
            </td>
        </tr>
    )
}
