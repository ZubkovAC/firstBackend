import {
    countRequestEmailResending,
    countRequestLogin,
    countRequestRegistration,
    countRequestRegistrationConformation
} from "../db";
import {  addSeconds } from 'date-fns'

export const searchRepo = (path:string) => {
    if(path==='/registration-confirmation')return  countRequestRegistrationConformation
    if(path==='/login')return  countRequestLogin
    if(path==='/registration-email-resending')return  countRequestEmailResending
    if(path==='/registration')return  countRequestRegistration
}

export const CountRepositories05 ={
    async count(ip:string,path:string){
        const date = new Date()
        const repo = await searchRepo(path)
        repo.insertOne({ip,date})
        // const repo = searchRepo(path)
        // await repo.insertOne({ip,date})
        return
    },
    async count5Error (ip:string ,path:string){
        const date = new Date()
        const repo = searchRepo(path)
        const req = await repo.find({ip:ip}).toArray()
        const f = req.filter(d=> addSeconds(d.date,10) > date  )
        console.log('test f',f.length)
        return f?.length >= 5
    },
    async count5ErrorRegistration (ip:string ,path:string){
        const date = new Date()
        const repo = searchRepo(path)
        const req = await repo.find({ip:ip}).toArray()
        const f = req.filter(d=> addSeconds(d.date,9) > date  )
        console.log('test f',f.length)
        return f?.length >= 5
    },
}