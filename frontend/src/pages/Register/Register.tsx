import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import axios from 'axios';
import InputField from '../../components/InputField/InputField';

const API_USER_URL = 'http://localhost:5000/api/users/';

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const name = firstName + ' ' + lastName;

  function resetAllFields() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPassword2('');
  }

  function isString(x: string) {
    return new RegExp('([\'"]?)[a-zA-Z]+\\1$').test(x);
  }

  function isEmailValid(val: string) {
    let regEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!regEmail.test(val)) {
      return false;
    } else {
      return true;
    }
  }

  function handleRegister(e: any) {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !password2) {
      toast.error('All fields are required.');
    } else if (!isString(firstName) || !isString(lastName)) {
      toast.error('Name should not have numbers.');
    } else if (!isEmailValid(email)) {
      toast.error('Please enter a valid email.');
    } else if (password !== password2) {
      toast.error('Passwords do not match.');
    } else {
      const userData = {
        name: name,
        email: email,
        password: password,
      };
      try {
        axios
          .post(API_USER_URL, userData)
          .then((res) => {
            toast.success('User registered successfully. You can now login with your credentials.');
            resetAllFields();
            navigate('/');
          })
          .catch((error) => {
            toast.warning(error.response.data.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <h1>Register User</h1>

      <form onSubmit={handleRegister}>
        <InputField label='First Name' value={firstName} setValue={setFirstName} />
        <InputField label='Last Name' value={lastName} setValue={setLastName} />
        <InputField label='Email' value={email} setValue={setEmail} />

        <InputField
          inputType={isPasswordVisible ? 'text' : 'password'}
          label='Password'
          value={password}
          setValue={setPassword}
          isValueVisible={isPasswordVisible}
          hasPasswordLength={password.length > 0}
          onEyeClick={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        <InputField
          inputType={isConfirmPasswordVisible ? 'text' : 'password'}
          label='Confirm Password'
          value={password2}
          setValue={setPassword2}
          isValueVisible={isConfirmPasswordVisible}
          hasPasswordLength={password2.length > 0}
          onEyeClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        />

        <button onClick={handleRegister}>Sign Up</button>
      </form>

      <Link to='/' className='back-home-link'>
        <TiArrowBackOutline />
        <span>Go Back</span>
      </Link>
    </>
  );
}
