import React from 'react'
import Button from '../components/Button'

const Landing = () => {
  return (
    <div>
      <div className='min-h-[100vh] w-full flex flex-col justify-between px-[9vw] header'>
        <div className='flex justify-between w-full mt-[40px]'>
          <span className='text-[24px] font-bold font-poppins text-white'>Logo</span>
          <div className='flex gap-[12px]'>
            <Button
              label="Login"
              type="secondary"
              to="/login"
            />
            <Button
              label="Register"
              type="primary"
              to="/register"
            />
          </div>
        </div>
        <div className='flex flex-col gap-[28px] mb-[100px] w-1/2'>
          <p className='text-secondary uppercase'>Smart Home Made Easy</p>
          <h1 className='text-white text-[60px] leading-[90px] font-medium'>Take care of your smart home</h1>
        </div>
      </div>
    </div>
  )
}

export default Landing