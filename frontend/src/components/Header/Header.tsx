import { Link } from 'react-router-dom';
import { RiLoginBoxLine } from 'react-icons/ri';
import { FaUserTie } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header(props: HeaderProps) {
  // Check if there is a user logged in
  const isUserLoggedIn = localStorage.getItem('user');

  return (
    <header className='top-container'>
      {!isUserLoggedIn ? (
        <>
          <Link to='/login' className='top-container-links'>
            <RiLoginBoxLine />
            <span>Login</span>
          </Link>

          <Link to='/register' className='top-container-links'>
            <FaUserTie />
            <span>Register</span>
          </Link>
        </>
      ) : (
        <Link to='/' className='top-container-links'>
          <FiLogOut />
          <span onClick={props.onLogout}>Logout</span>
        </Link>
      )}
    </header>
  );
}
