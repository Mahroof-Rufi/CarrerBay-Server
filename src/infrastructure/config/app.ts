import express from 'express'
import cors from 'cors'

import authRouter from '../routes/authRouter'
import userRouter from '../routes/userRouter'
import employerRouter from '../routes/employerRouter'
import adminRouter from '../routes/adminRouter'
import jobsRouter from '../routes/jobsRouter'
import postsRouter from '../routes/postsRouter'
import jobApplicantsRouter from '../routes/jobApplicantsRouter'
import chatRouter from '../routes/chatRouter'

export const createServer = () => {

    try {
        const app = express()
        app.use(express.json())
        app.use(cors({
            origin: process.env.ORIGIN_URL as string,
            methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials:true
        }))

        app.use('/api/auth', authRouter)
        app.use('/api/users', userRouter)
        app.use('/api/employers', employerRouter)
        app.use('/api/admin', adminRouter)
        app.use('/api/jobs', jobsRouter)
        app.use('/api/posts', postsRouter)
        app.use('/api/job-applicants', jobApplicantsRouter)
        app.use('/api/chat', chatRouter)

        return app        
    } catch (error) {
        console.error(error);
    }

}
