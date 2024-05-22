import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";
import adminRepository from "../repository/adminRepository";

const jwt = new Jwt()
const adminRepo = new adminRepository()

export const adminAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.header('Admin-Token');
        if(!token) {
            res.status(401).json({message:'Unauthorized access denied'})
            return
        }     

        const decodedToken = jwt.verifyToken(token)
        if(decodedToken?.status && decodedToken.status == 401) {
            res.status(decodedToken.status).json({ message:decodedToken.message })
            return
        } else if ( decodedToken?.role != 'admin') {
            res.status(401).json({ message:'Unauthorized access' })
            return
        }

        const admin = adminRepo.findById(decodedToken.id)

        if (!admin) {
            res.status(401).json({ message:'Unauthorized access' })
        } else {
            next();
        } 
    } catch (error) {
        console.error(error);        
    }
}

export default adminAuth