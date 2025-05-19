import { useAppDispatch } from '../store/hooks';
import { setStepObjField } from '@/store/StepSlice';

export default function XpathMenu() {
    const dispatch = useAppDispatch()

    const handleXPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setStepObjField({key: 'xPath', value: e.target.value}))
    }

    return (
        <input className='py-1 text-center bg-white rounded-md' placeholder='xpath go here' onChange={handleXPathChange} />
    );
}