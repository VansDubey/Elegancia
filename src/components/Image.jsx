import React, { useEffect, useState } from 'react';
//First Page
import img1 from "../Images/Img1.jpg"
import img2 from "../Images/Img2.jpg"
import img3 from "../Images/Img3.jpg"

const images = [
 img1,img2,img3
];

const Image = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[100vw] h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute w-full h-full">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Background ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="relative z-10 bg-black bg-opacity-50 p-6 rounded-lg text-center text-white">
        <h1 className="text-4xl font-bold">Welcome to Elegancia</h1>
        <p className="mt-2 text-lg">Experience luxury like never before</p>
      </div>
    </div>
  );
};

export default Image;
