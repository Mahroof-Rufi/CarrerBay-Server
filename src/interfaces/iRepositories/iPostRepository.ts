import { EmployerPosts, Post } from "../models/employerPosts";

interface IPostsRepository {

    fetchPostsById(employer_id:string,skip:number, limit:number):Promise<EmployerPosts | null>
    fetchTotalNoOfEmployerPosts(employer_id:string): Promise<number>
    addPost(description:string,employerid:string, images?:string[]):Promise<EmployerPosts | null>
    fetchAllPosts(skip:number, limit:number):Promise<EmployerPosts | null>
    fetchTotalNoOfPosts(): Promise<number>
    fetchSearchedPosts(company_id:string, query:string):Promise<EmployerPosts | null>

}

export default IPostsRepository