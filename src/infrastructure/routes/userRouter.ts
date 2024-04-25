import express from "express";
import userController from "../../adaptor/userController";
import userUseCase from "../../use-case/userUseCase";
import userRepository from "../repository/userRepo";

const router = express.Router()

const repository = new userRepository()
const useCase = new userUseCase(repository)
const controller = new userController(useCase);

router.post('/login', (req,res) => controller.signIn(req,res))

export default router