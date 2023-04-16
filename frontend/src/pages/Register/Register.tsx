import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_USER_URL = 'http://localhost:5000/api/users/';

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
      toast.error('All fields are required');
    } else if (!isString(firstName) || !isString(lastName)) {
      toast.error('Name should not have numbers');
    } else if (!isEmailValid(email)) {
      toast.error('Please enter a valid email');
    } else if (password !== password2) {
      toast.error('Passwords do not match');
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
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success('User registered successfully');
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
        <div className='input-group'>
          <input
            type='text'
            placeholder=''
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label>First Name</label>
        </div>

        <div className='input-group'>
          <input
            type='text'
            placeholder=''
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label>Last Name</label>
        </div>

        <div className='input-group'>
          <input
            type='text'
            placeholder=''
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label>Email</label>
        </div>

        <div className='input-group'>
          <input
            type='password'
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label>Password</label>
        </div>

        <div className='input-group'>
          <input
            type='password'
            placeholder=''
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label>Confirm Password</label>
        </div>

        <button onClick={handleRegister}>Sign Up</button>
      </form>

      <Link to='/' className='back-home-link'>
        <TiArrowBackOutline />
        <span>Go Back</span>
      </Link>
    </>
  );
}
