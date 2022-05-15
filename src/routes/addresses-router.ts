import {Request, Response, Router} from "express";

export const addressesRouter = Router({})

const addresses: Array<{ id:number,value: string }> = [{id:1,value: 'Angarskay 12'}, {id:2,value: "Poletnay 10"}]

addressesRouter.get('', (req: Request, res: Response) => {
    res.send(addresses)
})
addressesRouter.get('/:id', (req: Request, res: Response) => {
    const searchAddress =  +req.params.id
    let address = addresses.find(a => a.id === searchAddress)
    if(address){
        res.send(address)
    }else{
        res.send(404)
    }
})