import React, { useEffect ,useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../Usercontext'


const Booking = () => {
  const {user} = useContext(UserContext)
  const [places, setplaces] = useState([])
  useEffect(() => {
   axios.get('http://localhost:3000/places').then(response=>{
     setplaces(response.data);
     console.log(places);
   })
  }, [])


    
  return (
    
    <>
      <div>
          <nav className="bg-slate-600 top-0 left-0 w-full text-white flex justify-between items-center p-4 shadow-lg">
             <div className="flex flex-col p-6">
               <Link to="/">
                 <h1 className="text-4xl font-bold hover:bg-slate-600 transition-colors">
                   Elegancia
                 </h1>
                 <p className="text-lg mt-2 opacity-80">More than a stay, an experience.</p>
               </Link>
             </div>
             <div className="flex justify-end p-6">
               <ul className="flex space-x-6 text-lg">
                 <li>
                   <a href="/" className="hover:bg-slate-600 transition-colors">Home</a>
                 </li>
                 <li>
                   <Link to="/accounts/book" className="hover:bg-slate-600 transition-colors">Places</Link>
                 </li>
                 <li>
                   <Link to="/accounts/booking" className="hover:bg-slate-600 transition-colors">Bookings</Link>
                 </li>
                 <li>
                   <Link to="/accounts/places" className="hover:bg-slate-600 transition-colors">Accommodations</Link>
                 </li>
                 <li>
                   <Link to={user ? "/accounts/profile" : "/Login"} className="hover:bg-slate-600 transition-colors">
                     Login
                   </Link>
                 </li>
               </ul>
             </div>
           </nav>
          </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-7">
    {places.length > 0 && places.map(item => (
      <Link key={item._id} to={'/places/' + item._id} className=" p-2">
        <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
        <div className="h-[20vw] w-[30vw] rounded-lg overflow-hidden">
          {item.photos?.[0] && (
            <img src={item.photos[0]} className="h-full w-full object-cover" />
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">{item.address}</p>
        <p className="mt-1 text-sm text-gray-700">{item.description}</p>
      </Link>
    ))}
  </div>
    </>

    
  
  )
}

export default Booking
