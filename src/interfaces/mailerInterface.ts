interface mailerInterface {
    
    sendMail(email:string, otp:number):boolean
    sendVerificationMail(id:any,to:any):Promise<any>
}
export default mailerInterface