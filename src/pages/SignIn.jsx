import React from 'react'
import {useState} from 'react'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { Link,useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'
function SignIn() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ 
    email:'',
    password:''
  })
  const {email, password} = formData
  const onChange =(e)=>{
    setFormData((prevState)=>(
      {
        ...prevState,
        [e.target.id]: e.target.value
      }
    ))
  }
  const onSubmit = async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      if(userCredentials.user){
        toast.success('Logged In Successful')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Incorrect Login Details')
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Welcome Back!</p>
      </header>

      <form onSubmit={onSubmit}>
        <input 
        type="text" 
        name="" id="email" 
        className='emailInput' 
        value={email} 
        placeholder='Email' 
        onChange={onChange} />

        <div className="passwordInputDiv">
          <input 
          type={showPassword? 'text': 'password'}
          name="" id="password" 
          className='passwordInput' 
          value={password}  
          placeholder='Password' 
          onChange={onChange} />
          <img src={visibilityIcon} 
          alt="Show Password"
          className='showPassword'
          onClick={()=>{setShowPassword((prevState) => !prevState)}} />
        </div>
        <OAuth/>
        <Link to='/forgotPassword' className="forgotPasswordLink">
            Forgot Password
        </Link>
        <div className="signInBar">
          <p className="signInText">Sign In</p>
          <button className=''>
            <img src={ArrowRightIcon} alt="" width='34px' height='34px' style={{backgroundColor:'green', color:'white', borderRadius:'100%'}} />
          </button>
        </div>
      </form>
      <Link to='/sign-up' className='registerLink'>
        Sign Up Instead
      </Link>
    </div>
  )
}

export default SignIn
