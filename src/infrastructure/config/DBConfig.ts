import mongoose from "mongoose";

export const DBConfig = async () => {
    
    try {
        const DB_url = 'mongodb://localhost:27017/CAREER-BAY' 
        await mongoose.connect(DB_url)
        .then(() => console.log('DB Connected Successfully'))
        .catch(() => console.log('DB Connection failed try again'))
    } catch (error) {
        console.error(error);
    }

}