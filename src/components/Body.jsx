import React from 'react'
import Image from './Image'
import MidSec from './Midsec'
import Footer from './Footer'
import Preview from './Preview';
import { Link } from 'react-router-dom';
import { useContext } from 'react'
import { UserContext } from '../Usercontext'

const Body = () => {
   const {user} = useContext(UserContext)
  return (
    <>
    <div>
        {/* <Homepage/> */}
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

        <Image/>
        <Preview/>
        <MidSec/>
        <Footer/>

    </>
    
  )
}

export default Body