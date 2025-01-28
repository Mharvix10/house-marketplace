import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import {toast} from 'react-toastify'
function ForgotPassword() {
  const [email, setEmail] = useState('')
  
  const onChange =(e)=>{
    e.preventDefault()
    setEmail(e.target.value)

  }
  const onSubmit =async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('Email sent')
    } catch (error) {
      toast.error('Could not send reset email')
    }
  }
  return (
    <div className="pageContainer">
      <header>
       <div className="pageHeader">
        Forgot Password
       </div>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input 
          type="email" 
          placeholder='Enter Email'
          onChange={onChange}
          className='emailInput'
          value={email}
          id="email" />

          <Link to='/sign-in' className='forgotPasswordLink'>
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">
              Send Reset Link
            </div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
