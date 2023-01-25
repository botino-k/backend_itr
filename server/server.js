import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { body } from 'express-validator';

import { signUpValidation } from './validation/userValidation.js';
import { handleValidationErrors } from './utils/index.js';
import { userController } from './controllers/index.js';


const app = express();

app.use(express.json());

app.get( '/', ( req, res)=>{ 
  res.send( 'server works with get')
})

app.post('/auth/signup', signUpValidation, handleValidationErrors, userController.signUp);

mongoose
  .connect(process.env.ATLAS_URI || 'mongodb+srv://task4:0Mgf3juajxvxd6y9@botinok.chnhn2a.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DataBase connection'))
  .catch((err) => console.log('DataBase error', err));


app.listen(4444, (error) => {
  if (error) {
    return console.log('error:', error);
  }
  console.log("server connection", 4444);
});

