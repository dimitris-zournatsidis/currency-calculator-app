import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_USER_URL = 'http://localhost:5000/api/users/';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function resetAllFields() {
    setEmail('');
    setPassword('');
  }

  function handleLogin(e: any) {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please add your email and password');
    } else {
      try {
        const userData = {
          email: email,
          password: password,
        };
        axios
          .post(API_USER_URL + 'login', userData)
          .then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data));

            const fullNameOfUser = res.data.name.split(' ');
            const userFirstname = fullNameOfUser[0];

            toast.success(`Welcome back, ${userFirstname}!`);
            resetAllFields();
            navigate('/');
          })
          .catch((res) => {
            if (res.code === 'ERR_BAD_REQUEST') {
              toast.error('Invalid email or password! Please try again.');
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <h1>Login User</h1>

      <form onSubmit={handleLogin}>
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

        <button onClick={handleLogin}>Login</button>
      </form>

      <Link to='/' className='back-home-link'>
        <TiArrowBackOutline className='icons' />
        <span>Go Back</span>
      </Link>
    </>
  );
}
