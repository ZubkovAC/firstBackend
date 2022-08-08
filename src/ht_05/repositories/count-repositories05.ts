import {countRequest} from "../db";
import {  addSeconds } from 'date-fns'

export const CountRepositories05 ={
    async count(ip:string){
        const date = new Date()
        await countRequest.insertOne({ip,date})
        return
    },
    async count5Error (ip:string){
        const date = new Date()
        const req = await countRequest.find({ip:ip}).toArray()
        const f = req.filter(d=> addSeconds(d.date,10) >= date  )
        return f?.length > 5
    }
}