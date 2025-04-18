const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()//.env folder is in the same folder so no need to add the option of path
const app = express()
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const download = require('image-downloader');
const multer = require('multer');
const PlacesModel = require('./models/Places.model');
const Booking=require('./models/booking.model')

//(10,11)
//useContext ko study krte raho in more better way.
//Logout ho jane pr.if i go to /login must be redirected /accounts
//name is coming not on logging in but on profile rendering while refreshing
//1/Spread in the array (...)
//2/To be done: Functionality of editing and deleting photos

const bcryptsalt = bcrypt.genSaltSync(10);
const jwtSecretKey = "ksdajgjhaegduqweyuiqyweijlskdlkdfjhj";

function getUserDataFromToken(req){
  return new Promise((resolve,reject)=>{
    jwt.verify(req.cookies.token,jwtSecretKey,{},async(err,user)=>{
      if(err){
          throw err;
      }
    resolve(user);
  })


  })

}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS','PUT'], // Allow necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

app.use('/uploads', express.static('uploads'));
app.use(cookieParser())
app.use(express.json())
app.use(express.static(__dirname)) // The current directory in which your images are saved , to access them http//localhost:3000/directoryname/imagename (if the images are in api directory then the directory is / bydeafult)
const port = 3000

mongoose.connect(process.env.MONGODB_URL)

app.post('/register',async(req,res)=>{
     //Get the data from the  frontend
     //create a db and store that database there
     //Send the response

    const {name,email,password} = req.body

     try {
        if(!name || !email || !password){
            return res.status(400)
                    .json({error:"All the fiels are required"})
        }
    
        const user = await User.create({
        name,
        email,//Write in the same case sensitivity as they are in the schema
        password:bcrypt.hashSync(password,bcryptsalt)
         })
         
        res.json(user)
        
     } catch (error) {
        res.status(422).json(error)
        
     }
   
    
})

app.post('/login',async (req,res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email})
    try{
        if(!user){
            return res.status(400)
                       .json({message:"User not registered yet"})
        }
        else{
            
            const passok = bcrypt.compareSync(password,user.password)
            if(passok){
                jwt.sign({email:user.email,id:user._id,name:user.name},jwtSecretKey,{},(err,token)=>{
                    if(err){
                        throw err;
                    }
                    
                    res.cookie('token',token,{
                        httpOnly: true, // Prevents JavaScript access
                        secure: false, // Set to `true` in production (requires HTTPS)
                    }).json({ message: 'Login successful', user });

                })
               
            }else{
                return res.status(400).json({message:"Password is not correct"})
            }
        }

    }catch(e){
        res.status(400).json(e)
    }
})

app.get('/profile',(req,res)=>{//How does this jadoo happened ki abb name ja nhi rha hai.
    const token = req.cookies.token;
    if(token){
        jwt.verify(token,jwtSecretKey,{},async(err,user)=>{
            if(err){
                throw err;
            }
            const {name,email,_id} = await User.findById(user.id)
            res.json({name,email,_id})
        })

    }
    else{
        res.json(null)
    }
})

app.post('/logout',(req,res)=>{
    res.clearCookie('token').json('true')
})

app.post('/upload-by-link',async(req,res)=>{
    const {link} = req.body
    const newName = Date.now() +  '.jpg'
    const options = {
    url: link,
    dest: __dirname + '\\' + 'uploads' + newName,     

};


  await download.image(options)
  .then(({ filename }) => {
    console.log('Saved to', filename); 
  })
  .catch((err) => console.error(err));

  res.json( __dirname + '\\' + 'uploads' + newName);
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
  })
  
  const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), function (req, res, next) {
     const url = `/uploads/${req.file.filename}`
     res.json({imageurl : `http://localhost:3000/${url}`})
})
     
  app.post('/places',(req,res)=>{
    const { title,address,description,
        checkIn,checkOut,perks,AddedPhotos,price} = req.body;
        const token = req.cookies.token;
        jwt.verify(token,jwtSecretKey,{},async(err,user)=>{
            if(err){
                throw err;
            }
           const places= PlacesModel.create({
                owner:user._id,
                name:title,
                address,
                description,
                checkIn,
                checkOut,
                perks,
                photos:AddedPhotos,
                price

            })
            res.json(places);
        })

  })

  app.get('/user-places', async(req,res)=>{
    const token = req.cookies.token;
    jwt.verify(token,jwtSecretKey,{},async(err,user)=>{
        const data = await PlacesModel.find({owner:user._id});
        res.json(data);
      })
  })

  app.get('/places/:id', async(req,res)=>{
    const {id} = req.params;
    res.json(await PlacesModel.findById(id))
  })

  app.put('/places', async (req, res) => {


    const { id,title,address,description,
      checkIn,checkOut,perks,AddedPhotos,price} = req.body;
   
      const placeDoc = await PlacesModel.findById(id);
        placeDoc.set({
         name: title,
         address,
         description,
      checkIn,
      checkOut,
      perks,
      photos:AddedPhotos,
      price
        });
        await placeDoc.save();
        res.json('ok');
      }
    );


  app.get('/places',async (req,res)=>{
        res.json( await PlacesModel.find())
  })

  app.post('/booking', async (req, res) => {
    try {
      const userData = await getUserDataFromToken(req);
      const { place, checkin, checkout, name, mobile, guests, price,
        
       } = req.body;
      
      const booking = await Booking.create({
        place, checkin, checkout, name, mobile, guests, price,
        user:userData.id
      })
  
      res.json(booking);
    } catch (err) {
      console.error('Booking error:', err);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });
   
  
  app.get('/booking',async(req,res)=>{
   const userData = await getUserDataFromToken(req);
   const booking = (await Booking.find({user : userData.id})
   .populate('place'))
  res.json(booking);
  })

  app.get('/profilebooking',async(req,res)=>{
    res.json(await Booking.find().populate('place'));

  })


  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

