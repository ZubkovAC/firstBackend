export const EmailAdapter05 = {
    createTransporter(email:string,pass:string){
        return {
            service: "gmail",
            auth: {
                user: email,
                pass: pass,
            },
        }
    },
    async sendMailer(emailFrom:string,emailTo:string ,code:string){
        return {
            from: `3y6kob <${emailFrom}>`, // sender address
            to: emailTo, // list of receivers
            subject: "Registration ✔", // Subject line
            text: `https://some-front.com/confirm-registration?code=${code}`, // plain text body
            // html: "https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=youtcodehere", // html body

        }
    },

}