import { ObjectId } from "mongoose";
import { EmployerPosts, Post } from "../models/employerPosts";

interface IPostsRepository {

    fetchPostsById(employer_id:string,skip:number, limit:number, sort:string):Promise<EmployerPosts | null>
    fetchTotalNoOfEmployerPosts(employer_id:string): Promise<number>
    triggerPostLike(employer_id:string, post_id:string, user_id:string): Promise<EmployerPosts | null>
    triggerPostSave(employer_Id:string, post_Id:string, user_Id:string): Promise<EmployerPosts>
    addCommentByPostId(user_Id:string, employer_Id:string, post_Id:string, comment:string): Promise<{user_id:ObjectId, comment:string}>
    addPost(description:string,employerid:string, images?:string[]):Promise<EmployerPosts[] | null>
    fetchAPerticularPost(employer_id:string, post_id:string): Promise<EmployerPosts | null>
    editPost(employer_id:string, post_id:string, description:string, images?:string[]): Promise<EmployerPosts | null>
    deletePostById(employer_id:string,post_id:string):Promise<EmployerPosts>
    fetchAllPosts(skip:number, limit:number):Promise<EmployerPosts | null>
    fetchTotalNoOfPosts(): Promise<number>
    fetchSearchedPosts(company_id:string, skip:number, limit:number,query:string, sort?:string):Promise<EmployerPosts | null>

}

export default IPostsRepository