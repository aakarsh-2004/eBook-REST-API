import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../../models/user/userModel";
import bcrypt from 'bcrypt';

const createUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // Validation
    const { name, email, password} = req.body;
    if(!name || !email || !password){
        const err = createHttpError(400, "All fields are required")
        return next(err);
    }

    // Database call
    const user = await userModel.findOne({ email: email});
    if(user){
        const error = createHttpError(400, "User already exists with the same email");
        return next(error);
    }
    
    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Process
    const newUser = await userModel.create({ 
        name, 
        email, 
        password: hashedPassword
    });

    // Token generation
    

    // Response
}


export { createUser };