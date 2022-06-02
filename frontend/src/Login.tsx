import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBackward } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: any) {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please add your credentials');
    } else {
      toast.success('User logged in');
      navigate('/');
      console.log('email:', email);
      console.log('pass:', password);
    }
  }

  return (
    <>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
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

        <button onClick={handleLogin}>Login</button>
      </form>

      <Link to='/' className='back-home-link'>
        <FaBackward />
        Go Back
      </Link>
    </>
  );
}
