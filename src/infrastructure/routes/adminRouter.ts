import express from "express";
import adminRepository from "../repository/adminRepo";
import adminUseCase from "../../use-case/adminUseCase";
import Jwt from "../utils/jwt";
import adminController from "../../adaptor/adminController";

const jwt = new Jwt()

const router = express.Router()

const repository = new adminRepository()
const useCase = new adminUseCase(repository,jwt)
const controller = new adminController(useCase)

router.post('/login', (req, res) => controller.login(req, res))

export default router