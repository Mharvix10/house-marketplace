import {useState, useEffect} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getDoc, doc, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase-config'
import { toast } from 'react-toastify'
function Contact() {
    const params = useParams()
    const {landlordId} = useParams();
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()

    const onChange=(e)=>{
      setMessage(e.target.value)
    }

    // message not storing into the firebase database

    const handleForm=async(e)=>{
        // store message in firestore
        const colRef = collection(db, 'messages')
        await addDoc(colRef, {
          landlordMessge: message
        })
        console.log('messages added')
        // clear the form
    }
    
    useEffect(()=>{
      const getLandlord = async () => {
        const docRef = doc(db, 'users', landlordId);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setLandlord(docSnap.data());
            console.log('landlord data already set');
            toast.success('Landlord data retrieved');
          } else {
            toast.error('Could not get landlord data');
          }
        } catch (error) {
          console.error('Error fetching landlord data:', error);
          toast.error('An error occurred while fetching landlord data');
        }
      };
      getLandlord()
    }, [landlordId])





  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
          Contact Landlord
        </p>
      </header>
      {
        landlord !== null && (
          <main>
            <div className="contactLandlord">
              <p className="landlordName">Contact {landlord?.name}</p>
            </div>
            <form className="messageForm">
              <div className="messageDiv">
                <label htmlFor="message" className="messageLabel">Message</label>
                <textarea 
                name="message" 
                id="message" 
                cols="30" 
                rows="10" 
                value={message}
                onChange={onChange}
                className="textarea">

                </textarea>
              </div>
              <a onClick={handleForm} href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                  <button className="primaryButton" type='button'>
                    Send Message
                  </button>
              </a>
            </form>
          </main>
        )
      }
    </div>
  )
}

export default Contact
