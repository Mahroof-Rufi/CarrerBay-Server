class GenerateOTP{
    generateOTP(): string {
  
       const otp: number = Math.floor(100000 + Math.random() * 999999);
       return otp.toString();
   }
}

export default GenerateOTP