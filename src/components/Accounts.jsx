import React from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { FaRegAddressCard } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import { UserContext } from '../Usercontext';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Accounts = () => {
  const [redirect, setredirect] = useState(null);
  const { ready, user } = useContext(UserContext);
  const [booking, setbooking] = useState([]);
  const [places, setplaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/profilebooking').then(response => {
      setbooking(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/places').then(response => {
      setplaces(response.data);
    });
  }, []);

  if (ready && !user) {
    return <Navigate to='/login' />
  }

  async function logout() {
    await axios.post('http://localhost:3000/logout');
    setredirect('/');
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  // Random Profile Image URL from RandomUser.me
  const randomProfileImage = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;

  return (
    <div >

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <div className="flex items-center space-x-2">
            <img src={randomProfileImage} alt="Profile" className="rounded-full w-12 h-12 object-cover" />
            <span className="font-medium text-gray-800">{user.name}</span>
          </div>
        </header>

        <div className="grid ">
          {/* Profile Card */}
          <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
            <img src={randomProfileImage} alt="Profile" className="rounded-full mx-auto mb-4 w-24 h-24 object-cover" />
            <h2 className="text-center text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-center text-sm text-gray-600">{user.email}</p>
            <p className="text-center text-sm text-gray-600">+1 - 856-589-093-1236</p>

            <div className="flex justify-center items-center my-4">
              <div className="ml-2 w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600 transition-all">Logout</button>
          </div>

          {/* My Bookings Card */}
          <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Bookings</h2>
            {booking.length > 0 ? (
              booking.map(item => (
                <div key={item._id} className="mb-4">
                  <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Price: ${item.price}</p>
                  <p className="text-sm text-gray-600">{item.mobile}</p>
                  <p className="text-sm text-gray-600">{item.place.name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No bookings found</p>
            )}
          </div>

          {/* My Places Card */}
          <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">My Places</h2>
            </div>
            {places.length > 0 ? (
              places.map(item => (
                <div key={item._id} className="mb-4">
                  <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  <p className="text-sm text-gray-600">Price: ${item.price}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No places found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
