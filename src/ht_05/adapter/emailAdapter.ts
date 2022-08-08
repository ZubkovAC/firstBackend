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
    sendMailer(emailFrom:string,emailTo:string ,html:string){
        return {
            from: `3y6kob <${emailFrom}>`, // sender address
            to: emailTo, // list of receivers
            subject: "Registration ✔", // Subject line
            text: "Access Email", // plain text body
            html: html, // html body
            // html: "https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=youtcodehere", // html body
        }
    },

}