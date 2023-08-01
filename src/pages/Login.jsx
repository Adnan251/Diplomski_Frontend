import React, {useState} from 'react';
import Input from '../components/Input'
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  return (
    <div className='bg-white w-full min-h-[100vh] h-full flex justify-center'>
      <div className='py-[60px] w-full ns:w-[540px] px-[28px] ns:px-0 flex flex-col justify-center items-center'>
        <h2 className='text-primary text-[34px] leading-[51px] font-medium text-center mb-[16px]'>Get Started</h2>
        <p className='text-grey w-[60%] text-center'>Creating an account is easy! Simply fill out the form below to get started.</p>
        <div className='w-full mt-[60px] flex flex-col gap-[20px] mb-[40px]'>
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
        </div>
        <Button
          label="Login"
          type="primary"
          additionalClass="w-full"
        />
      </div>
    </div>
  )
}

export default Login