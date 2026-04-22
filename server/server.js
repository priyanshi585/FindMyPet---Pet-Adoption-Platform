require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const petRouter = require('./Routes/PetRoute')
const AdoptFormRoute = require('./Routes/AdoptFormRoute')
const userRoutes = require('./Routes/userRoutes');
const AdminRoute = require('./Routes/AdminRoute');
const postRoutes = require('./Routes/PostRoute');
const { notFound, errorHandler } = require("./middlewares/errrorMIddleware");
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();

connectDB()
    .then(() => {
        console.log('Connected to DB');
       
    })
    .catch((err) => {
        console.error(err);
    })
    app.use(
        cors({
          origin: JSON.parse(process.env.CORS_ORIGIN),
          credentials: true,
          maxAge: 14400,
        })
      );
    
    

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.status(200).json({
        "name" :"BACKEND OF HOMEGATE"
    })
})
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use(petRouter)
app.use('/form', AdoptFormRoute)
app.use('/admin', AdminRoute)
app.use('/api/user',userRoutes)
app.use('/api/posts', postRoutes)



app.use(notFound)
app.use(errorHandler)




const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })

    