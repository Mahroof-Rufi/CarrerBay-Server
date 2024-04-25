import user from "../domain/user";
import UserRepo from "./interface/userController";

class userUseCase {

    constructor(private userRepo:UserRepo) { }

    async logIn(user:user) {
        const userData = await this.userRepo.findByEmail(user.email)
        if (userData) {
            return {
                status:200,
                data: 'user found successfully'
            }
        } else {
            return {
                status: 400,
                data: 'user not found'
            }
        }
    }

}

export default userUseCase