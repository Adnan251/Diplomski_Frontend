import React from 'react'
import { Link } from 'react-router-dom';

const Button = ({onClick, label, type, additionalClass, to}) => {
  return (
    <Link to={to} onClick={onClick} className={`button ${additionalClass} ${type === 'primary' ? 'primary' : 'secondary'}`}>
      {label}
    </Link>
  )
}

export default Button