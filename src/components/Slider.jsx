import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {collection, query, getDocs, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase-config'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import {Pagination} from 'swiper/modules'
import Spinner from './Spinner'
function Slider() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchListing =async()=>{
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(10))
            const querySnap = await getDocs(q)
            // console.log(querySnap)
            const listings = []
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
             
        }
        
        fetchListing()
    }, [])
    if(loading){
        return <Spinner/>
    }
  return (
    <>
      <p className="exploreHeading">
        Recommended
      </p>
      <Swiper
          spaceBetween={50}
          slidesPerView={1}
          modules={[ Pagination]}
          pagination={{ clickable: true }}
        >
          
            {
              listings &&
              listings.map(({data, id})=>{
                return <SwiperSlide key={id}>
                    <div style={{
                    background:`url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize:'cover',
                    width:'100%',
                    height:'250px'
            }}
            className='swipperSlideDiv'
            onClick={()=>{navigate(`/category/${data.type}/${id}`)}}
            >
                <p className="swiperSlideText">
                    {data.name}
                </p>
                <p className="swiperSlidePrice">
                     {data.discountedPrice ?? data.regularPrice}
                     {data.type === 'rent' && ' / month'}
                </p>
            </div>
                </SwiperSlide>
              })
            }
          ...
    </Swiper>
    </>
  )
}

export default Slider
