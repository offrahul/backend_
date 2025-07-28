// require('dotenv').config({path: './.env'});


import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
import connectDb from './db/index.js';

dotenv.config({ path: './.env' });

connectDb().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("server is running on port",process.env.PORT);
    })
}).catch((error) => {
    console.log("mon failed !!",error);
})







// first approachfor db connect
// import express from 'express';
// const app=express()


// (async()=>{
//     try {
//         const db = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
//         console.log('Conectado a la base de datos');
//         app.on("error",(error)=>{
//             console.log("Error en el server not connect to express",error)
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log("Server is running on port 3000",${process.env.PORT});
//         })
//     } catch (error) {
//         console.error(error);
//         throw error
//     }
// })()
