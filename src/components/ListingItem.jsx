import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
function ListingItem({id, listing,onEdit, onDelete}) {
  return (
    <div>
      <li className="categoryListing">
        <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
            <img className='categoryListingImg' src={listing.imageUrls[0]} alt={listing.name} />

            <div className="categoryListingDetails">
                <p className="categoryListingLocation">
                    {listing.location}
                </p>
                <p className="categoryListingName">
                    {listing.name}
                </p>
                <p className="categoryListingPrice">
                    ${listing.offer? listing.discountedPrice.toLocaleString('en-US') : 
                    listing.regularPrice.toLocaleString('en-US')}

                    {listing.type == "rent" && ' yearly' }
                </p>
                <div className="categoryListingInfoDiv">
                    <img src={bedIcon} alt={bedIcon} />
                    <p className="categoryListingInfoText">
                        {listing.bedrooms > 1? `${listing.bedrooms} bedrooms` : '1 bedroom' }
                    </p>

                    <img src={bathtubIcon} alt={bathtubIcon} />
                    <p className="categoryListingInfoText">
                        {listing.bathrooms > 1? `${listing.bathrooms} baathrooms` : '1 bathroom' }
                    </p>
                </div>
            </div>
        </Link>
        {onEdit && <EditIcon onClick={()=>{onEdit(id)}} className='editIcon'/>}
        {onDelete && <DeleteIcon
        onClick={()=>{onDelete(listing.id, listing.name)}}
        className='removeIcon' fill='rgb(231, 76, 60)'/>}
      </li>
    </div>
  )
}

export default ListingItem
