import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setStepObjField } from '@/store/StepSlice';

export default function ActionMenu() {
    const dispatch = useAppDispatch()
    const actionNameList = useAppSelector((state) => state.sops.actionNameList)
    const actionName = useAppSelector((state) => state.steps.stepObj.actionName)

    const handlingActionMenu = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStepObjField({key: "actionName", value: e.target.value}))
    }
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-md">
                <select
                    id="actionType"
                    value={actionName}
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