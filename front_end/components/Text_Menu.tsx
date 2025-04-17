import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
const actionOptions = ['CLICK', 'SEND_KEYS', 'UPLOAD', 'WAIT', 'NAVIGATE'];

export default function TextMenu() {
    const [textOps, setTextOps] = useState('UPLOAD')
    const [fileName, setFileName] = useState('');
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name); // can't get full path, only name
        }
    }
    return (
        <div className="">
            {
                (textOps == "UPLOAD") ?
                    <div className='flex items-center justify-center w-full'>
                        <input className='w-[100px] text-xs bg-white rounded-full p-1' placeholder='Folder Path'/>
                        <input
                            type="file"
                            onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                            className='text-[10px] bg-blue-900/50 rounded-full p-1'
                            name="file_name"
                        />
                    </div>
                    :
                    <>
                        OK
                    </>
            }
        </div>
    );
}