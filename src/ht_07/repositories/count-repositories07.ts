import {
    countRequestEmailResendingModel,
    countRequestLoginModel,
    countRequestRegistrationModel,
    countRequestRegistrationConformationModel
} from "../db";
import {  addSeconds } from 'date-fns'

export const searchRepo = (path:string) => {
    if(path==='/registration-confirmation') return  countRequestRegistrationConformationModel
    if(path==='/login') return  countRequestLoginModel
    if(path==='/registration-email-resending') return  countRequestEmailResendingModel
    if(path==='/registration') return  countRequestRegistrationModel
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