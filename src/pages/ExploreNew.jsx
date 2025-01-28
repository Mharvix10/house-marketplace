import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider'
function ExploreNew() {
 
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <Slider/>
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Houses for rent</p>
          </Link>

          <Link to='/category/sell'>
            <img src={sellCategoryImage} alt="" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Houses for sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ExploreNew
