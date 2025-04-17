'use client'
import React, { useEffect, useState } from 'react';
import { delSop, fetchSops, postSop } from '../store/sopSlice'; // Make sure the filename matches
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedSop } from '@/store/StepSlice';

export default function DisplaySop() {
  const [sopName, setSopName] = useState('')
  const dispatch = useAppDispatch();
  const { list, status, error} = useAppSelector((state) => state.sop);
  const sop_name = useAppSelector((state) => state.steps.sop_name)

  const handle_add_action = () => {
    dispatch(postSop({ sop_name: sopName }));
  }

  const handle_delete_action = () => {
    dispatch(delSop({ sop_name: sopName }));
  }

  useEffect(() => {
    dispatch(fetchSops());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading SOPs...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className='grid grid-cols-8 gap-4 items-center justify-center'>
      <div className='col-span-4 text-center font-bold'>SOP LISTS</div>
      <div className='col-span-4'>
        <div className='flex items-center justify-center text-center'>
          <input className='w-[200px] bg-white px-2 py-1 text-center rounded-xl border-2 border-gray-200 mr-5' placeholder='type name of sop' value={sopName} onChange={(e) => setSopName(e.target.value)} />
          <div className='py-1 w-[60px] bg-green-400 rounded-l-xl hover:bg-green-400/50 cursor-pointer' onClick={() => handle_add_action()}>Add</div>
          <div className='py-1 w-[60px] bg-red-400 rounded-r-xl hover:bg-red-400/50 cursor-pointer' onClick={() => handle_delete_action()}>Delete</div>
        </div>
      </div>
      <>
        {list.map((sop) => (
          <div className={`p-2 border-2 rounded-xl text-center hover:bg-green-400/10 cursor-pointer
            ${sop_name === sop.name ? 'bg-green-200' : ''}
            ${sop_name && sop.name !== sop_name ? 'opacity-50' : ''}
          `} key={sop.id} onClick={() => dispatch(setSelectedSop(sop.name))}>{sop.name}</div>
        ))}
      </>
    </div>
  );
}
