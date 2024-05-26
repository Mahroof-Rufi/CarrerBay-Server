import { sign, verify, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

class Jwt {

    private _secretKey: string;

    constructor() {
        this._secretKey = process.env.JWT_Secret || "";
    }

    createToken(id: string, role: string): string | undefined {
        try {
            
            if (!this._secretKey) {
                throw new Error('Secret key is undefined');
            }

            const payload = { id, role };
            const token = sign(payload, this._secretKey, { expiresIn: '1d' });
            return token;

        } catch (error) {
            console.error(error);
        }
    }

    verifyToken(token:string): JwtPayload | null {
        try {
            const decodedToken = verify(token, this._secretKey) as JwtPayload;
            return decodedToken
        } catch (error:any) {
            if (error.name == 'TokenExpiredError') {
                return {
                    status: 401,
                    message: 'Token expired, login again'
                }
            } else {
                console.error(error);
            }
            return null            
        }
    }

}

export default Jwt