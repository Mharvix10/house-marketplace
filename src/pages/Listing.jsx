import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase-config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { getAuth } from 'firebase/auth'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import {Pagination} from 'swiper/modules'
import 'swiper/css/pagination'
function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)


  // const params = useParams()
  const { categoryName, listingId } = useParams();
  const auth = getAuth()


  useEffect(()=>{
    const fetchListing =async () =>{
    const docRef = doc(db, 'listings', listingId)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      console.log(docSnap.data())
      // error caused by ommitting set listing
      setListing(docSnap.data())
      setLoading(false)
    }
    }
    fetchListing()
  },[listingId, categoryName])

  if(loading){
    return <Spinner/>
  }
  return (
    <div>
      <main>
      <Swiper
          spaceBetween={50}
          slidesPerView={1}
          modules={[ Pagination]}
          pagination={{ clickable: true }}
        >
          
            {
              listing.imageUrls.map((url, index)=>{
                return <SwiperSlide key={index}>
                    <div style={{
                    background:`url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize:'cover',
                    width:'100%',
                    height:'250px'
            }}>

            </div>
                </SwiperSlide>
              })
            }
          ...
    </Swiper>
        <div className="shareIconDiv" onClick={()=>{
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(()=>{
            setShareLinkCopied(false)
          }, 2000)
        }}>
          <img src={shareIcon} alt="" />
        </div>

        {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

        <div className="listingDetails">
          <p className="listingName">
            {listing.name} - N{listing.offer ? listing.discountedPrice : listing.regularPrice}
          </p>

          <p className="listingLocation">
            {listing.address}
          </p>

          <p className="listingType">
            For {listing.type === 'rent'? 'rent' : 'sale'}
          </p>

          {listing.offer && (
            <p className="discountedPrice">
              N{listing.regularPrice - listing.discountedPrice}
            </p>
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1 ?
                `${listing.bedrooms} bedrooms`:
                '1 bedroom'
            }
            </li>

            <li>
              {listing.bathrooms > 1 ?
                `${listing.bathrooms} bathrooms`:
                '1 bathroom'
            }
            </li>

            <li>
              {listing.parking && 'ParkingSpot'}
            </li>

            <li>
            {listing.furnished && 'Furnished'}
            </li>

            {
              auth.currentUser?.uid !== listing.userRef && (
                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
                    Contact Landlord
                </Link>
              )
            }
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Listing
