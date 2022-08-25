import {
    countRequestEmailResending06,
    countRequestLogin06,
    countRequestRegistration06,
    countRequestRegistrationConformation06
} from "../db";
import {  addSeconds } from 'date-fns'

export const searchRepo = (path:string) => {
    if(path==='/registration-confirmation') return  countRequestRegistrationConformation06
    if(path==='/login') return  countRequestLogin06
    if(path==='/registration-email-resending') return  countRequestEmailResending06
    if(path==='/registration') return  countRequestRegistration06
}

export const CountRepositories07 ={
    async count(ip:string,path:string){
        const date = new Date()
        const repo = await searchRepo(path)
        repo.insertMany([{ip,date}])
        // const repo = searchRepo(path)
        // await repo.insertOne({ip,date})
        return
    },
    async count5Error (ip:string ,path:string){
        const date = new Date()
        const repo = searchRepo(path)
        const req = await repo.find({ip:ip}).lean()
        const f = req.filter(d=> addSeconds(d.date,10) > date )
        return f?.length >= 5
    },
}