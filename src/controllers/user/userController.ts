import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../../models/user/userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { User } from "../../types/user/userTypes";

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
    try {
        const user = await userModel.findOne({ email: email});
        if(user){
            const error = createHttpError(400, "User already exists with the same email");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Errow while getting user"));
    }
    
    // hash password
    const saltRounds = 10;
    let hashedPassword: string;

    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
        return next(createHttpError(500, "Errow while hashing password"));
    };

    // Process
    let newUser: User;
    try {
        newUser = await userModel.create({ 
            name, 
            email, 
            password: hashedPassword
        });
        console.log(`${new Date()}: New User Created -> ${newUser.name}`);
        
    } catch (error) {
        return next(createHttpError(500, "Error while creating user"));
    }


    // Token generation - JWT

    try {
        const token = jwt.sign(
            {sub: newUser._id}, 
            config.JWT_SECRET as string,
            {
                expiresIn: "7d"
            }
        )
        // Response
        res.status(201).json({accessToken: token});
    } catch (error) {
        return next(createHttpError(500, "Error while signing JWT token"));
    };
}

const loginUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const { email, password } = req.body;
    if(!email || !password){
        return next(createHttpError(400, "All fields are required"));
    }

    let user;
    try {
        user = await userModel.findOne({email});
        if(!user){
            return next(createHttpError(404, "User not found"));
        }
    } catch (error) {
        return next(createHttpError(500, "Error while loading user"));
    }

    let isMatch: boolean;
    try {
        isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return next(createHttpError(400, "Username or password incorrect"));
        }
    } catch (error) {
        return next(createHttpError(500, "Error while comparing the passwords"));
    }


    // create token
    let token;
    try {
        token = jwt.sign(
            {sub: user._id},
            config.JWT_SECRET as string,
            {
                expiresIn: "7d",
                algorithm: "HS256"
            }
    )
    } catch (error) {
        return next(createHttpError(500, "Error while signing the token"));
    }


    res.json({accessToken: token});
}


export { createUser, loginUser };