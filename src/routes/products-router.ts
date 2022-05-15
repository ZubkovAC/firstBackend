import {Request, Response, Router} from "express";

export const productsRouter = Router({})

const products: Array<{ id:number,title: string }> = [{id:1,title: 'tomato'}, {id:2,title: "orange"}]

productsRouter.get('', (req: Request, res: Response) => {
    if(req.query.title){
        res.send(products.filter(p=>p.title.indexOf(req.query.title.toString()) > -1))
    }
    res.send(products)
})
productsRouter.post('', (req: Request, res: Response) => {
    const newProducts = {id: +(new Date),
        title:req.body.title
    }
    products.push(newProducts)
    res.status(201).send(newProducts)
})
productsRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const updateProduct = products.find(p=>p.id === id)
    if(updateProduct){
        updateProduct.title= req.body.title
        res.status(200).send(updateProduct)
        return
    }
    res.send(404)
})
productsRouter.get('/:id', (req: Request, res: Response) => {
    const searchProductId =  +req.params.id
    let oneProduct = products.find(p => p.id === searchProductId)
    if(oneProduct){
        res.send(oneProduct)
    }else{
        res.send(404)
    }
})
productsRouter.delete('/:id', (req: Request, res: Response) => {
    const searchProductId =  +req.params.id
    for (let i =0 ; i < products.length;i++){
        if(products[i].id === searchProductId){
            products.splice(products[i].id)
            res.send(204)
            return
        }
    }
    res.send(404)
})