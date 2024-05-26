import { EmployerPosts, Post } from "../models/employerPosts";

interface IPostsRepository {

    fetchPostsById(employer_id:string):Promise<EmployerPosts | null>
    addPost(description:string,employerid:string, images?:string[]):Promise<EmployerPosts | null>
    fetchAllPosts():Promise<EmployerPosts | null>
    fetchSearchedPosts(company_id:string, query:string):Promise<EmployerPosts | null>

}

export default IPostsRepository