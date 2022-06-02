import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBackward } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  function handleRegister(e: any) {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !password2) {
      toast.error('Please fill all required fields');
    } else if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      toast.success('User signed in successfully');
      navigate('/');
      console.log('email:', email);
      console.log('pass:', password);
    }
  }

  return (
    <>
      <h1>Register</h1>

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

        <button onClick={handleRegister}>Register</button>
      </form>

      <Link to='/' className='back-home-link'>
        <FaBackward />
        Go Back
      </Link>
    </>
  );
}
