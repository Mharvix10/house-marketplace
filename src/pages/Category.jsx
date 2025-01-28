import React from 'react'
import {useEffect, useState} from 'react'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import { db } from '../firebase-config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import { useParams } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing ] = useState(null)
    const params = useParams()

    useEffect(()=>{
        const fetchListing = async () =>{
                try {
                    const listingRef = collection(db, 'listings')
                    const q = query(
                       listingRef,
                       where('type', '==', params.categoryName),
                       orderBy('timestamp', 'desc'),
                       limit(2)
                    )
                   const querySnap = await getDocs(q)
       
                   const lastVisible = querySnap.docs[querySnap.docs.length - 1 ]
       
                   setLastFetchedListing(lastVisible)
       
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
    },[params.categoryName])

    const onFetchMoreListing = async () =>{
            try {
                const listingRef = collection(db, 'listings')
                const q = query(
                   listingRef,
                   where('type', '==', params.categoryName),
                   orderBy('timestamp', 'desc'),
                   startAfter(lastFetchedListing),
                   limit(2)
                   
                )
                
               const querySnap = await getDocs(q)
        
               const lastVisible = querySnap.docs[querySnap.docs.length - 1 ]
        
               setLastFetchedListing(lastVisible)
        
               const fetchedListings = []
               querySnap.forEach((doc)=>{
                   fetchedListings.push(
                       {
                           id: doc.id,
                           data: doc.data()
                       }
                   )
               })
               setListings((prevState)=>[
                ...prevState,
                ...fetchedListings
               ])
               setLoading(false)
            } catch (error) {
                toast.error('Error fetching listing')
            }
   }
  return (
    <div className='category'>
      <header>
        <p className="pageHeader">
            Offers
        </p>
     </header>
      {loading? 
      (<Spinner/>) : listings && listings.length > 0 ?
       (<>
        <main>
            <ul className="categoryListings">
                {listings.map((listing)=>{
                    return <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
                })}
            </ul>
        </main>
        {
            lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListing}>
                    Load More
                </p>
            )
        }
       </>)
      :(<p>No Listings for {params.categoryName }</p>)}
    </div>
  )
}

export default Category
