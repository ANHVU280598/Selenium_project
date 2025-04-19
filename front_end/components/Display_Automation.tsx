'use client'
import React, { use, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ActionMenu from './Action_Menu';
import TextMenu from './Text_Menu';
import XpathMenu from './Xpath_Menu';
import { addNewStep, addNewStepToList, fetchAllStep, refreshStep, resetStepObj, setSetUpType, setStepObjField } from '@/store/StepSlice';
import { Step } from '@/store/StepSlice';
import Display_Automation_Code from './Display_Automation_Code';
import { fetchActionName } from '@/store/sopSlice';

export default function Display_Automation() {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const [addStep, isAddStep] = useState(false)
  const sop_name = useAppSelector((state) => state.steps.sop_name)
  const setUpType = useAppSelector((state) => state.steps.setUpType)
  const refreshListStep = useAppSelector((state) => state.steps.refreshListStep)
  const { list_step, status, error, stepObj } = useAppSelector((state) => state.steps)
  const stepOrder = useAppSelector(state => state.steps.stepObj.stepOrder)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSetUpType((e.target.value as 'initial' | 'final')));
  };

  const addNewStepToDB = () => {
    dispatch(addNewStep({sop_name: sop_name, setUpType: setUpType , step: stepObj})) 
    dispatch(addNewStepToList(stepObj))   
    dispatch(resetStepObj())
    dispatch(setStepObjField({key: 'stepOrder', value: stepOrder + 1}))
    console.log(stepOrder);
    
  }
  useEffect(() => {
    if (sop_name) {
      dispatch(fetchAllStep({ sop_name, setup_type: setUpType }));
      dispatch(resetStepObj())
      isAddStep(false)
    }
  }, [dispatch, sop_name, setUpType, refreshListStep]);

  const addNewStepBtn = () => {
    if (status === 'succeeded') {
      dispatch(setStepObjField({key: 'stepOrder', value: list_step.length + 1}))
      isAddStep(true)
    }
  }

  if (status === 'loading' && sop_name) return <div>Loading SOPs...</div>;
  if (status === 'failed' && sop_name) return <div>Error: {error}</div>;

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
          <div className='p-2 bg-green-300 rounded-lg border-1 border-black text-sm hover:bg-green-300/70 cursor-pointer'>Run Test</div>
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
              <Display_Automation_Code key={step.stepOrder + step.actionName + sop_name} step={step} index = {index}/>
            ))
          }
          {
            (addStep) ?
              <tr className='bg-green-300'>
                <td className="border px-4 py-2 text-center">{stepOrder}</td>
                <td className="border px-4 py-2 text-center"><ActionMenu/></td>
                <td className="border px-4 py-2 text-center"><XpathMenu/></td>
                <td className="border px-4 py-2 text-center"><TextMenu/></td>
                <td className="border px-4 py-2 text-center">
                  {
                    (isEdit) ? <div className='flex flex-row'>
                      <div className='bg-green-300 p-1 rounded-l-xl hover:bg-green-300/70 cursor-pointer' onClick={addNewStepToDB}>Save</div>
                      <div className='bg-green-300 p-1 bg-purple-300 hover:bg-purple-300/70 cursor-pointer'>Discard</div>
                      <div className='bg-red-300 p-1 rounded-r-xl hover:bg-red-300/70 cursor-pointer'>Delete</div>
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
