import admin from "../../domain/admin";

interface adminInterface {

    findByEmail(email:string): Promise<admin | null>,
    findById(id:string): Promise<admin |null>
}

export default adminInterface