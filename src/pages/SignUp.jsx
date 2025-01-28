import React from 'react'
import {useState} from 'react'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { Link,useNavigate } from 'react-router-dom'
import {db} from '../firebase-config'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'


function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ 
    name:'',
    email:'',
    password:''
  })

  const {email, password, name} = formData
  const onChange =(e)=>{
    setFormData((prevState)=>(
      {
        ...prevState,
        [e.target.id]: e.target.value
      }
    ))
  }

  const onSubmit =async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await createUserWithEmailAndPassword(auth,email, password)
      const user = userCredentials.user

      updateProfile(auth.currentUser, {
        displayName: name
      })
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      // Add a new document in collection "users"
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success('SignUp Successful')
      navigate('/')

    } catch (error) {
      toast.error('Something went wrong with signup')
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Sign Up</p>
      </header>

      <form onSubmit={onSubmit}>
      <input 
        type="text" 
        name="" 
        id="name" 
        className='nameInput' 
        value={name} 
        placeholder='Name' 
        onChange={onChange} />

        <input 
        type="text" 
        name="" 
        id="email" 
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
          <p className="signInText">Sign Up</p>
          <button className=''>
            <img src={ArrowRightIcon} alt="" width='34px' height='34px' style={{backgroundColor:'green', color:'white', borderRadius:'100%'}} />
          </button>
        </div>
      </form>
      <Link to='/sign-in' className='registerLink'>
        Sign In Instead
      </Link>
    </div>
  )
}

export default SignUp
