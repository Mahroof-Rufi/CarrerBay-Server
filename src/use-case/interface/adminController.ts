import admin from "../../domain/admin";

interface adminRepo {

    findByEmail(email:string): Promise<admin | null>,

}

export default adminRepo