import { sign, verify, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

class Jwt {

    private secretKey: string;

    constructor() {
        this.secretKey = process.env.JWT_Secret || "";
    }

    createToken(id: string, role: string): string | undefined {
        try {
            
            if (!this.secretKey) {
                throw new Error('Secret key is undefined');
            }

            const payload = { id, role };
            const token = sign(payload, this.secretKey, { expiresIn: '1d' });
            return token;

        } catch (error) {
            console.error(error);
        }
    }

}

export default Jwt