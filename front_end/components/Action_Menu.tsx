import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const actionOptions = ['CLICK', 'SEND_KEYS', 'UPLOAD', 'WAIT', 'NAVIGATE'];

interface ActionMenuProps {
    actionName: string;
  }

export default function ActionMenu({ actionName }: ActionMenuProps) {
    const [selectedAction, setSelectedAction] = useState('CLICK'); // default is CLICK

    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-md">
                {actionName}
                {/* <select
                    id="actionType"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className=" text-center w-full text-md"
                >
                    {actionOptions.map((action) => (
                        <option key={action} value={action} className="text-md">
                            {action}
                        </option>
                    ))}
                </select> */}
            </div>
        </div>


    );
}