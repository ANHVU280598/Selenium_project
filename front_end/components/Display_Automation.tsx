'use client'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ActionMenu from './Action_Menu';
import TextMenu from './Text_Menu';
import XpathMenu from './Xpath_Menu';
import { addNewStep, addNewStepToList, fetchAllStep, resetStepObj, run_code, setSetUpType, setStepObjField, stop_code } from '@/store/StepSlice';
import Display_Automation_Code from './Display_Automation_Code';

export default function Display_Automation() {
  const dispatch = useAppDispatch()
  const [isRun, setRunCode] = useState(true)
  const [isEdit, setEdit] = useState(false)
  const [addStep, isAddStep] = useState(false)
  const sop_name = useAppSelector((state) => state.steps.sop_name)
  const setUpType = useAppSelector((state) => state.steps.setUpType)
  const refreshListStep = useAppSelector((state) => state.steps.refreshListStep)
  const { list_step, status_steps, error, stepObj } = useAppSelector((state) => state.steps)
  const stepOrder = useAppSelector(state => state.steps.stepObj.stepOrder)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSetUpType((e.target.value as 'initial' | 'final')));
  };

  const addNewStepToDB = () => {
    dispatch(addNewStep({ sop_name: sop_name, setUpType: setUpType, step: stepObj }))
    dispatch(addNewStepToList(stepObj))
    isAddStep(false)
  }
  useEffect(() => {
    if (sop_name) {
      dispatch(resetStepObj())
      dispatch(fetchAllStep({ sop_name, setup_type: setUpType }));
      isAddStep(false)
    }
  }, [dispatch, sop_name, setUpType, refreshListStep]);

  const addNewStepBtn = () => {
    dispatch(setStepObjField({ key: 'stepOrder', value: list_step.length + 1 }))
    dispatch(setStepObjField({key: 'xPath', value: ''}))
    dispatch(setStepObjField({key: 'text', value: ''}))
    dispatch(setStepObjField({key: 'file_name', value: ''}))
    isAddStep(true)
  }

  const runCode = () => {
    setRunCode(false)
    dispatch(run_code({ sop_name, setup_type: setUpType }));
  }

  const stopCode = () => {
    setRunCode(true)
    dispatch(stop_code())
  }
  if (status_steps === 'loading' && sop_name) return <div>Loading SOPs...</div>;
  if (status_steps === 'failed' && sop_name) return <div>Error: {error}</div>;

  if (!sop_name) return <span className='text-md text-gray-400'>Please select SOP</span>
  return (
    <div>
      <div className='col-span-8 p-2'>
        {/* Initial or Final Set Up Options */}
        <div className="flex w-full gap-4 items-center justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sopType"
              value="initial"
              checked={setUpType === 'initial'}
              onChange={handleChange}
              className="accent-green-500"
            />
            <span>Initial</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sopType"
              value="final"
              checked={setUpType === 'final'}
              onChange={handleChange}
              className="accent-blue-500"
            />
            <span>Final</span>
          </label>

          <div className='p-2 bg-green-300 rounded-lg border-1 border-black text-sm hover:bg-green-300/70 cursor-pointer' onClick={() => addNewStepBtn()}>Add New Step</div>
          <>
            {
              (isRun) ? <div className='p-2 bg-green-300 rounded-lg border-1 border-black text-sm hover:bg-green-300/70 cursor-pointer' onClick={() => runCode()}>Run Test</div>
                : <div className='p-2 bg-red-300 rounded-lg border-1 border-black text-sm hover:bg-red-300/70 cursor-pointer' onClick={() => stopCode()}>Stop Test</div>
            }
          </>
        </div>
      </div>
      <table className="table-auto border border-gray-300 text-sm w-[850px] mx-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 w-[20px]">Step</th>
            <th className="border px-4 py-2 w-[130px]">Action</th>
            <th className="border px-4 py-2 w-[300px]">XPATH</th>
            <th className="border px-4 py-2 w-[200px]">Text/File_Path</th>
            <th className="border px-4 py-2 w-[150px]">Modify</th>
          </tr>
        </thead>
        <tbody>
          {
            list_step.map((step, index) => (
              <Display_Automation_Code key={step.stepOrder + step.actionName + sop_name} step={step} index={index} />
            ))
          }
          {
            (addStep) ?
              <tr className='bg-green-300'>
                <td className="border px-4 py-2 text-center">{stepOrder}</td>
                <td className="border px-4 py-2 text-center"><ActionMenu /></td>
                <td className="border px-4 py-2 text-center"><XpathMenu /></td>
                <td className="border px-4 py-2 text-center"><TextMenu /></td>
                <td className="border px-4 py-2 text-center">
                  {
                    (isEdit) ? <div className='flex flex-row items-center justify-center'>
                      <div className='bg-blue-300 p-1 rounded-l-xl hover:bg-pruprle-300/70 cursor-pointer' onClick={addNewStepToDB}>Save</div>
                      <div className='bg-green-300 p-1 rounded-r-xl  bg-purple-300 hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(false)}>Discard</div>
                    </div>
                      :
                      <div className='bg-purple-300 rounded-md border-1 border-black hover:bg-purple-300/70 cursor-pointer' onClick={() => setEdit(true)}>Edit</div>
                  }
                </td>
              </tr> :
              <></>
          }

        </tbody>
      </table>

    </div>
  )
}
