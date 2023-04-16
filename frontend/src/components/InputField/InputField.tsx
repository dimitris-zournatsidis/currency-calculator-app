import './InputField.css';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';

interface InputFieldProps {
  value: string;
  label: string;
  inputType?: string;
  isValueVisible?: boolean;
  hasPasswordLength?: boolean;
  setValue: (value: string) => void;
  onEyeClick?: () => void;
}

export default function InputField(props: InputFieldProps) {
  return (
    <div className='input-group'>
      <input
        type={props.inputType ? props.inputType : 'text'}
        placeholder=''
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        required
      />
      <span className='highlight'></span>
      <span className='bar'></span>
      <label>{props.label}</label>

      {props.hasPasswordLength && (
        <div className='eye-icon-container'>
          {props.isValueVisible ? (
            <AiOutlineEyeInvisible className='eye-icon' onClick={props.onEyeClick} />
          ) : (
            <AiOutlineEye className='eye-icon' onClick={props.onEyeClick} />
          )}
        </div>
      )}
    </div>
  );
}
