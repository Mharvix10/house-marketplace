import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {doc, updateDoc, collection, query, where, orderBy, getDocs, deleteDoc} from 'firebase/firestore'
import ListingItem from '../components/ListingItem'
import { db } from '../firebase-config'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import homeIcon from '../assets/svg/homeIcon.svg'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
function Profile() {
  const params = useParams()
  const [listings, setListings] = useState(null)
  const[loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState(
    {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email
    }
  )

  const {name, email} = formData


  useEffect(()=>{
    const fetchListing = async () =>{
            try {
                const listingRef = collection(db, 'listings')
                const q = query(
                   listingRef,
                   where('useRef', '==', auth.currentUser.uid),
                   orderBy('timestamp', 'desc'),
                   
                )
               const querySnap = await getDocs(q)
   
           
   
               const fetchedListings = []
               querySnap.forEach((doc)=>{
                   fetchedListings.push(
                       {
                           id: doc.id,
                           data: doc.data()
                       }
                   )
               })
               setListings(fetchedListings)
               setLoading(false)
            } catch (error) {
                toast.error('Fetched listing error: ' + error)
            }
    }
    fetchListing()
},[auth.currentUser.uid])

    
  const onLogOut =()=>{
    auth.signOut()
    navigate('/')
  }
  const onSubmit=async()=>{
    try {
      //update display name for auth
      if(auth.currentUser.displayName !== name){
          await updateProfile(auth.currentUser,{
            displayName: name
          })
    
          //update firestore
          await updateDoc(userRef, {
            name: name
          })
          const userRef = doc(db, 'users', auth.currentUser.uid)
      }

    } catch (error) {
      toast.error('Update Failed')
    }
  }
  const onChange =(e)=>{
    e.preventDefault()
    setFormData((prev)=>(
      {
        ...prev,
        [e.target.id]: e.target.value
      }
    ))
  }
  useEffect(()=>{
    setUser(auth.currentUser)
  },[])

  const onEdit =(listingId)=>{
    navigate(`/edit-listing/${listingId}`)
  }


  const onDelete=async(listingId)=>{
    if(window.confirm('Are you sure you wanna delete this listing?')){
      const docRef = doc(db, 'listings', listingId)
      await deleteDoc(docRef)
      const updatedListings = listings.filter((listing)=>
        listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Succesfully deleted listings')
    }
  }
  return(
    <div className='profile'>
      <header className="profileHeader">
        <p className="pageHeader">
          {name} Profile
        </p>
        <button type='button' className='logOut' onClick={onLogOut}>
          Logout
        </button>
        </header>
        <main>
          <div>
            <p className="profileDetailsText"></p>
            <p className="changePersonalDetails" onClick={()=>{
              changeDetails && onSubmit() 
              setChangeDetails((prev)=>
                !prev
              )
            }}>
              {changeDetails ? 'done': 'change'}
            </p>
          </div>
          <div className="profileCard">
            <form>
              <input 
              type="text" 
              value={name}
              id="name"
              onChange={onChange}
              className={changeDetails? 'profileName' : 'profileNameActive'}
              disabled = {!changeDetails} />
              <input 
                type="email" 
                value={email}
                id="email"
                onChange={onChange}
                className={changeDetails? 'profileEmail' : 'profileNameActive'}
                disabled = {!changeDetails} />
            </form>
          </div>
        </main>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="Home Icon" />
          <p>Sell or rent your house</p>
          <img src={arrowRight} alt="arrow Icon" />
          <p></p>
        </Link>
        {
          !loading && listings?.length > 0 && (
            <>
              <p className="listingText">
                Your listings
              </p>
              <ul className="listingsList">
                {
                  listings.map((listing)=>(
                    <ListingItem 
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                      onEdit={()=>onEdit(listing.id)}
                      onDelete={()=>onDelete(listing.id)
                      }
                    />
                  )

                  )
                }
              </ul>
            </>
          )
        }
      
    </div>
  )
}

export default Profile
 