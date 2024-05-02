import express from 'express'
import cors from 'cors'

import userRouter from '../routes/userRouter'
import employerRouter from '../routes/employerRouter'
import adminRouter from '../routes/adminRouter'

export const createServer = () => {

    try {
        const app = express()
        app.use(express.json())
        app.use(cors({
            origin:'http://localhost:4200',
            methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials:true
        }))

        app.use('/', userRouter)
        app.use('/employer', employerRouter)
        app.use('/admin', adminRouter)

        return app
    } catch (error) {

        console.error(error);
        
    }

}
