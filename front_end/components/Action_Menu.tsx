import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActionName, Step } from '@/store/StepSlice';

interface Props {
    tempStepAdd: Step;
    setTempStepAdd: React.Dispatch<React.SetStateAction<Step>>;
}

export default function ActionMenu({ tempStepAdd, setTempStepAdd }: Props) {
    const actionNameList = useAppSelector((state) => state.sop.actionNameList)
    const dispatch = useAppDispatch()

    const handlingActionMenu = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTempStepAdd(prev => ({ ...prev, actionName: e.target.value }))
        dispatch(setActionName(e.target.value))
        // setTempStepAdd(prev => ({ ...prev, folder_path: '', file_name: '', text: '' }))
    }
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-md">
                <select
                    id="actionType"
                    value={tempStepAdd.actionName}
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
        </div>


    );
}