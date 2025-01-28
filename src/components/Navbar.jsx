import React from 'react'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ProfileIcon} from '../assets/svg/personOutlineIcon.svg'
import {useNavigate, useLocation} from 'react-router-dom'
function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchPath = (route) =>{
        if(route === location.pathname){
            return true
        }
    }
  return (
    <footer className='navbar'>
        <nav className='navbarNav'>
            <ul className='navbarListItems'>
                <li className='navbarListItem' onClick={()=>{navigate('/')}}>
                    <ExploreIcon fill={pathMatchPath('/')? '#2c2c2c': '#8f8f8f'} width='36px' height='36px'/>
                    <p className={pathMatchPath('/') ? 'navbarListItemNameActive': 'navbarListItemName' }>Explore</p>
                </li>
                <li className='navbarListItem' onClick={()=>navigate('/offers')}>
                    <OfferIcon fill={pathMatchPath('/offers')? '#2c2c2c': '#8f8f8f'} width='36px' height='36px'/>
                    <p className={pathMatchPath('/offers')? 'navbarListItemNameActive': 'navbarListItemName' }lassname={pathMatchPath('/offers') ? 'navbarListItemNameActive': 'navbarListItemName'} >Offer</p>
                </li>
                <li className='navbarListItem' onClick={()=>{navigate('/profile')}}>
                    <ProfileIcon fill={pathMatchPath('/profile')? '#2c2c2c': '#8f8f8f'} width='36px' height='36px'/>
                    <p className={pathMatchPath('/profile')? 'navbarListItemNameActive': 'navbarListItemName' }>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>
  )
}

export default Navbar
