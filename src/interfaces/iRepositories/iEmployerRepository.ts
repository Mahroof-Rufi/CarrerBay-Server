import employer from "../models/employer";

interface IEmployerRepository {

    insertOne(employer:employer): Promise<employer>,
    findByEmail(email:string): Promise<employer | null>,
    findById(user_id:string): Promise<employer | null>
    updatePassword(email:string, password:string): Promise<employer | null>
    updateProfile(email:string, newData:employer): Promise<employer | null>
    updateEmail(email:string,newEmail:string): Promise<employer | null>
    fetchAllEmployers(limit:number, employer_id?:string):Promise<employer | null>
    changeStatusById(employer_id:string):Promise<employer | null>
}

export default IEmployerRepository