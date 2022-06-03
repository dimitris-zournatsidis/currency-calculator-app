import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = '/api/users/';

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const name = firstName + ' ' + lastName;

  function resetAllFields() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPassword2('');
  }

  async function handleRegister(e: any) {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !password2) {
      toast.error('Please fill all required fields');
    } else if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name: name,
        email: email,
        password: password,
      };
      try {
        const response = await axios.post(API_URL, userData);
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          toast.success('User signed in successfully');
          resetAllFields();
          navigate('/');
        }
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <h1>Register User</h1>

      <form onSubmit={handleRegister}>
        <input
          type='text'
          placeholder='Enter your first name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Enter your last name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='password'
          placeholder='Confirm password'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
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
