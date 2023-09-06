import React, {useState} from 'react';
import Input from '../components/Input'
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleUsername = (event) => {
    setUsername(event.target.value);
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  }

  const handleRegistration = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
        confirmPassword,
      });
  
      const token = response.data.token;
      localStorage.setItem("token", `Bearer ${token}`);

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/dashboard');
    } catch (error) {
      // Handle error here
      console.error('Registration failed:', error);
    }
  };


  return (
    <div className='bg-white w-full min-h-[100vh] h-full flex justify-center'>
      <div className='py-[60px] w-full ns:w-[540px] px-[28px] ns:px-0 flex flex-col justify-center items-center'>
        <h2 className='text-primary text-[34px] leading-[51px] font-medium text-center mb-[16px]'>Get Started</h2>
        <p className='text-grey w-[60%] text-center'>Creating an account is easy! Simply fill out the form below to get started.</p>
        <div className='w-full mt-[60px] flex flex-col gap-[20px] mb-[40px]'>
          <Input 
            type="text"
            label="Username"
            value={username}
            placeholder="KonShisho"
            onChange={handleUsername}
          />
          <Input 
            type="email"
            label="Email"
            value={email}
            placeholder="mail@example.com"
            onChange={handleEmail}
          />
          <Input 
            type="password"
            label="Password"
            value={password}
            onChange={handlePassword}
          />
          <Input 
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
          />
        </div>
        <Button
          label="Register"
          type="primary"
          additionalClass="w-full"
          onClick={handleRegistration}
        />
      </div>
    </div>
  )
}

export default Register