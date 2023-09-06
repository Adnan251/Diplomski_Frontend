import React from 'react'

const Navbar = ({isHouseActive, isLogsActive, getHouse, getLogs}) => {
  return (
    <div className='flex rounded-[24px] bg-[#3A3A3A] justify-between p-[16px]'>
      <div className='flex gap-[12px] items-center'>
        <div className='w-[54px] h-[54px] rounded-full bg-grey'></div>
        <div className='flex flex-col'>
          <span className='font-medium text-[14px] text-grey'>Welcome</span>
          <h3 className='text-white text-[22px] font-bold'>Adnan</h3>
        </div>
      </div>
      <div className='flex'>
        <button onClick={getHouse} className={`${isHouseActive ? 'active' : ''} main-button rounded-l-[16px]`}>House List</button>
        <button onClick={getLogs} className={`${isLogsActive ? 'active' : ''} main-button rounded-r-[16px]`}>Logs List</button>
      </div>
      <button className='button text-white logout-button'>
        Log Out
      </button>
    </div>
  )
}

export default Navbar