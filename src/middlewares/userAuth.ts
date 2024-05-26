import { Request, Response, NextFunction } from "express";
import userRepository from "../infrastructure/repositories/userRepository";
import Jwt from "../providers/jwt";

const jwt = new Jwt()
const userRepo = new userRepository()

export const userAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.header('User-Token');
        if(!token) {
            res.status(401).json({message:'Unauthorized access denied 1'})
            return
        }     

        const decodedToken = jwt.verifyToken(token)
        if(decodedToken?.status && decodedToken.status == 401) {
            res.status(decodedToken.status).json({ message:decodedToken.message })
            return
        } else if ( decodedToken?.role != 'Normal-User') {
            res.status(401).json({ message:'Unauthorized access' })
            return
        }

        const userData = userRepo.findById(decodedToken.id)

        if (!userData) {
            res.status(401).json({ message:'Unauthorized access' })
        } else {
            next();
        } 
    } catch (error) {
        console.error(error);        
    }
}

export default userAuth