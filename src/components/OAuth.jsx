import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, getDoc, setDoc,serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase-config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick =async()=>{
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            // Store User In Database
            const userRef = doc(db,'users', user.uid)
            const docSnap = await getDoc(userRef)

            //Check if user exist and create new user if it doesn't exist
            if(!docSnap){
              console.log('breakpoint here')
                await setDoc(doc(db, 'users', user.uid, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                }))
              

                navigate('/')
            }
            
            toast.success('Login successful')
        } catch (error) {
            toast.error('Cannot authenticate user: ' + error)
        }
    }
  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <div className="socialIconDiv" onClick={onGoogleClick}>
        <img src={googleIcon} alt="" className="socialIconImg" />
      </div>
    </div>
  )
}

export default OAuth
