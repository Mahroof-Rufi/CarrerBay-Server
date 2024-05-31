import { Request,Response,NextFunction, json } from "express";
import Jwt from "../providers/jwt";
import employerRepository from "../infrastructure/repositories/employerRepository";

const jwt = new Jwt()
const employerRepo = new employerRepository()

export const employerAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.header('Employer-Token');
        if(!token) {
            res.status(401).json({message:'Unauthorized employer access denied'})
            return
        }     

        const decodedToken = jwt.verifyToken(token,"Employer")
        if(decodedToken?.status && decodedToken.status == 401) {
            res.status(decodedToken.status).json({ message:decodedToken.message })
            return
        } else if ( decodedToken?.role != 'Normal-employer') {
            res.status(401).json({ message:'Unauthorized employer access denied' })
            return
        }

        const employerData = employerRepo.findById(decodedToken.id)

        if (!employerData) {
            res.status(401).json({ message:'Unauthorized employer token' })
        } else {
            next();
        } 
    } catch (error) {
        console.error(error);        
    }
}

export default employerAuth