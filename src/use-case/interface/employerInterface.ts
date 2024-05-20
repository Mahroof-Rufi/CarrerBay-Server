import employer from "../../domain/employer";

interface employerInterface {

    insertOne(employer:employer): Promise<employer>,
    findByEmail(email:string): Promise<employer | null>,
    findById(user_id:string): Promise<employer | null>
    updatePassword(email:string, password:string): Promise<employer | null>
    updateProfile(email:string, newData:employer): Promise<employer | null>
    updateEmail(email:string,newEmail:string): Promise<employer | null>
    fetchAllEmployers():Promise<employer | null>
    changeStatusById(employer_id:string):Promise<employer | null>
}

export default employerInterface