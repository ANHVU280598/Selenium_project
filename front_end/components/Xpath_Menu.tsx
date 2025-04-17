import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function XpathMenu() {

    return (
        <input className='py-1 text-center bg-white rounded-md' placeholder='xpath go here'/>
    );
}