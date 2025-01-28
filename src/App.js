import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import ExploreNew from './pages/ExploreNew';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';
function App() {

    return(
      <>
      <Router>
          <Routes>
            <Route path='/' element={<PrivateRoute/>}>
              <Route path='/' element={<ExploreNew/>}/>
            </Route>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/offers' element={<Offers/>}/>
            <Route path='/create-listing' element={<CreateListing/>}/>
            <Route path='/edit-listing/:listingId' element={<EditListing/>}/>
            <Route path='/category/:categoryName' element={<Category/>}/>
            <Route path='/category/:categoryName/:listingId' element={<Listing/>}/>
            <Route path='/contact/:landlordId/' element={<Contact/>}/>
            <Route path='/profile' element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>}/>
            </Route>
            <Route path='/sign-in' element={<SignIn/>}/>
            <Route path='/sign-up' element={<SignUp/>}/>
            


          </Routes>
          <Navbar/>
        </Router>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
          {/* Same as */}
        <ToastContainer />
      </>


    )
}

export default App;
// error in listingitem component. Not fetching the source of the image of the house