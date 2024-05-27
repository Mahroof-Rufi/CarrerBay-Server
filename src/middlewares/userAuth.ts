import { Request, Response, NextFunction } from "express";
import userRepository from "../infrastructure/repositories/userRepository";
import Jwt from "../providers/jwt";

const jwt = new Jwt()
const userRepo = new userRepository()

export const userAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.header('User-Token');
        if(!token) {
            res.status(403).json({message:'Unauthorized access denied 1'})
            return
        }     

        const decodedToken = jwt.verifyToken(token)
        if(decodedToken?.status && decodedToken.status == 403) {
            res.status(decodedToken.status).json({ message:decodedToken.message })
            return
        } else if ( decodedToken?.role != 'Normal-User') {
            res.status(403).json({ message:'Unauthorized access' })
            return
        }

        const userData = await userRepo.findById(decodedToken.id)

        if (!userData) {
            res.status(403).json({ message:'Unauthorized access' })
        } else if (!userData.isActive) {
            res.status(403).json({ message:'Your account is blocked by admin' })
        } else {
            next();
        } 
    } catch (error) {
        console.error(error);        
    }
}

export default userAuth