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
        console.log('email',`<h1>confirmation email <a href=https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=${code}>click</a></h1>`)
        return {
            from: `3y6kob <${emailFrom}>`, // sender address
            to: emailTo, // list of receivers
            subject: "Registration ✔", // Subject line
            text: "Access Email", // plain text body
            // html: `<h1>confirmation email</h1><div><a href=https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=${code}>click</a></div> `, // html body
            html: `https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=${code}`, // html body
            // html: "https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=youtcodehere", // html body
        }
    },

}