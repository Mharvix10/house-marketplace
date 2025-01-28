import React from 'react'
import { useState, useEffect, useRef } from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {addDoc, collection, serverTimestamp, doc, getDoc, updateDoc} from 'firebase/firestore'
import {db} from '../firebase-config'
import {v4 as uuidv4} from 'uuid'


function EditListing() {
  const params = useParams()
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)
    const [listing, setListing] = useState(null)
    const [formData, setFormData] = useState({
        type:'sell',
        name:'',
        bedrooms:'1',
        bathrooms:'1',
        parking:'true',
        furnished:'false',
        address:'',
        offers:'true',
        regularPrice:'0',
        discountedPrice:'0',
        images:{},
        latitude:'0',
        longitude:'0'
    })
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offers,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
    } = formData
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        
        if(isMounted){
            onAuthStateChanged(auth, (user)=>{
                if(user){
                    setFormData({...formData, useRef: user.uid})
                }
                else{
                    navigate('/sign-in')
                    
                }
            })
        }
        return()=>{
            isMounted.current = false
        }
    },[isMounted])

    useEffect(()=>{
        if(listing && listing.useRef !== auth.currentUser.uid){
          toast.error('You cannot edit that listing')
          navigate('/')
        }
    },[])

    useEffect(()=>{
      setLoading(true)
      const fetchListing = async()=>{
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
          setListing(docSnap.data())
          setFormData({...docSnap.data()})
          setLoading(false)
        }
        else{
          toast.error('Listings does not exist')
          navigate('/')
        }
      }
      fetchListing()
    }, [params.listingId, navigate])



    if(loading){
        return <Spinner/>
    }
    const onSubmit =async(e)=>{
        e.preventDefault()
        setLoading(true)

        const parsedDiscountedPrice = parseFloat(discountedPrice)
        const parsedRegularPrice = parseFloat(regularPrice)

        if(parsedDiscountedPrice >= parsedRegularPrice){
            setLoading(false)
            toast.error('Discounted price must be less than regular')
            return
        }
        if(images.length > 6){
            setLoading(false)
            toast.error('Max of 6 images')
            return
        }

        // store image in firebase

        const storeImage = async (image) =>{
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}---${image.name}---${uuidv4()}`

                const storageRef = ref(storage, 'images/'+fileName);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;

                            default:
                                console.log('uploading')
                                break;
                        }
                    }, 
                    (error) => {
                        reject(error)
                        // Handle unsuccessful uploads
                    }, 
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                        });
                    }
                    );   // upload task ends here
                    
                                })
                                
                            }

                            
                            const imageUrls = await Promise.all(
                                [...images].map((image)=>{
                                        return storeImage(image)
                                })
                            ).catch(()=>{
                                setLoading(false)
                                toast.error('Images not uploaded')
                                return
                            })
        
                            const formDataCopy = {
                                ...formData,
                                imageUrls,
                                timestamp: serverTimestamp()
                            }

                            delete formDataCopy.images
                            !formDataCopy.offers && delete formDataCopy.discountedPrice

                            try {
                                // const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
                                const docRef = doc(db, 'listings', params.listingId)
                                await updateDoc(docRef, formData)
                                setLoading(false)
                                toast.success('Listings saved')
                                navigate(`/category/${formDataCopy.type}/${docRef.id}`)
                                 
                            } catch (error) {
                                console.log(formDataCopy)
                                console.log('Firestore error: ' + error)
                                setLoading(false)
                                toast.error('Failed to save listing')
                            }

                            setLoading(false)
    }
    const onMutate =(e) =>{
        let boolean = null
        if(e.target.value =='true'){
            boolean = true
        }
        if(e.target.value =='false'){
            boolean = false
        }
        //file
        if(e.target.files){
            setFormData((prevState)=>(
                {
                    ...prevState,
                    images: e.target.files
                }
            ))
        }

        
        if(!e.target.files){
            setFormData((prevState)=>(
                {
                    ...prevState,
                    [e.target.id]: boolean?? e.target.value
                }
            ))
        }
    }
  return (

    <div className="profile">
        <header>
            <p className="pageHeader">
                Edit listing
            </p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <label  className="formLabel"> Rent / Sell</label>
                <div className="formButtons">
                    <button
                    type='button'
                    className={type === 'sell' ?'formButtonActive': 'formButton'}
                    id='type'
                    value='sell'
                    onClick={onMutate}
                    >
                        Sale
                    </button>

                    <button
                    type='button'
                    className={type === 'rent' ?'formButtonActive': 'formButton'}
                    id='type'
                    value='rent'
                    onClick={onMutate}
                    >
                        Rent
                    </button>

                </div>
                <label  className="formLabel"> Name </label>
                <input
                    type='text'
                    className={'formInputName'}
                    id='name'
                    value={name}
                    onChange={onMutate}
                    maxLength='32'
                    minLength='10'
                    required
                    />
                <div className="forRooms flex">
                    <div>
                    <label  className="formLabel"> Bedrooms </label>
                    <input
                    type='number'
                    className={'formInputSmall'}
                    id='bedrooms'
                    value={bedrooms}
                    onChange={onMutate}
                    max='50'
                    min='1'
                    required
                    />
                    </div>
                    <div>
                    <label  className="formLabel"> Bathrooms </label>
                    <input
                    type='number'
                    className={'formInputSmall'}
                    id='bathrooms'
                    value={bathrooms}
                    onChange={onMutate}
                    max='50'
                    min='1'
                    required
                    />
                    </div>
                </div>
                <label  className="formLabel"> Parking Spot </label>
                <div className="formButtons">
                    <button
                    type='button'
                    className={parking ? 'formButtonActive': 'formButton'}
                    id='parking'
                    value={true}
                    onClick={onMutate}
                    >
                        Yes
                    </button>

                    <button
                    type='button'
                    className={!parking && parking !== null ?'formButtonActive': 'formButton'}
                    id='parking'
                    value={false}
                    onClick={onMutate}
                    >
                        No
                    </button>

                </div>
                <label  className="formLabel"> Furnished </label>
                <div className="formButtons">
                    <button
                    type='button'
                    className={furnished ?'formButtonActive': 'formButton'}
                    id='furnished'
                    value={true}
                    onClick={onMutate}
                    >
                        Yes
                    </button>

                    <button
                    type='button'
                    className={!furnished && furnished !== null ?'formButtonActive': 'formButton'}
                    id='furnished'
                    value={false}
                    onClick={onMutate}
                    >
                        No
                    </button>

                </div>
                <label  className="formLabel"> Address </label>
                <textarea
                    className={'formInputAddress'}
                    id='address'
                    value={address}
                    onChange={onMutate}
                    required
                    />
                <label  className="formLabel"> Offers </label>
                <div className="formButtons">
                    <button
                    type='button'
                    className={offers ? 'formButtonActive': 'formButton'}
                    id='offers'
                    value={true}
                    onClick={onMutate}
                    >
                        Yes
                    </button>

                    <button
                    type='button'
                    className={!offers && offers !== null ?'formButtonActive': 'formButton'}
                    id='offers'
                    value={false}
                    onClick={onMutate}
                    >
                        No
                    </button>

                </div>
                <div className="formPriceDiv">
                    <label  className="formLabel"> Regular price </label>
                        <input
                        type='number'
                        className='formInputSmall'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='0'
                        required
                        />
                        { type === 'rent'  &&
                            <p className="formPriceText">
                                N / Year
                            </p>
                    }
                </div>
                {
                    offers  && 
                    <>
                    <div className="formPriceDiv">
                    <label  className="formLabel">  DiscountedPrice </label>
                        <input
                        type='number'
                        className='formInputSmall'
                        id='discountedPrice'
                        value={discountedPrice}
                        onChange={onMutate}
                        min= '0'
                        required
                        />
                        { type === 'rent'  &&
                            <p className="formPriceText">
                                N / Year
                            </p>
                    }
                </div>
                    </>
                }

                <label  className="formLabel">  Images </label>
                <p className="imageInfo">
                    The first image would be the cover (Max 6)
                </p>
                <input
                        type='file'
                        className='formInputFile'
                        id='images'
                        onChange={onMutate}
                        accept='.jpg,.png,.jpeg'
                        multiple
                        max='6'
                        required
                        />
                <button onClick={onSubmit} className="primaryButton createListingButton">
                    Edit Listing
                </button>
            </form>
        </main>
    </div>
  )
}

export default EditListing
