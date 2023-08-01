import React from 'react'

const Input = ({label, placeholder, additionalClass, value, onChange, type}) => {
  return (
    <div className='flex flex-col w-full gap-[6px]'>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${additionalClass} input`}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input