import employer from "../models/employer";

interface IEmployerRepository {

    insertOne(employer:employer): Promise<employer>,
    findByEmail(email:string): Promise<employer | null>,
    findById(user_id:string): Promise<employer | null>
    updatePassword(email:string, password:string): Promise<employer | null>
    updateProfile(email:string, newData:employer): Promise<employer | null>
    updateEmail(email:string,newEmail:string): Promise<employer | null>
    fetchAllEmployers(skip:number, limit:number, employer_id?:string, sort?:string, filterQuery?:any):Promise<employer | null>
    getEmployersStatistics(startDate:string, endDate:string): Promise<number[]>
    FetchEmployersCount(filterQuery?:any): Promise<number>
    changeStatusById(employer_id:string):Promise<employer | null>
    verifyAccountById(employer_id:string): Promise<employer | null>
}

export default IEmployerRepository