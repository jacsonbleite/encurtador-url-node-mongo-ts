import express, {Request, Response} from 'express'
import shortId from 'shortid'
import { config } from '../config/Constants'
import { URLModel } from '../database/model/URL'

export class URLController{
    public async shorten(req: Request, response: Response): Promise<void>{
        //URL JÁ EXITE?        
        const {originURL} = req.body
        const url = await URLModel.findOne({ originURL })
        if(url){
            response.json(url)
            return
        }

        //CRIAR HASH PARA URL        
        const hash = shortId.generate()
        const shortURL = `${config.URL_API}/${hash}`
        
        //SALVAR URL BANCO
        const newUrl = await URLModel.create({hash, shortURL, originURL})
        
        //RETORNAR URL SALVA
        response.json(newUrl)
    }

    public async redirect(req: Request, response: Response): Promise <void>{
        //hash URL
        const { hash } = req.params
        //URL original do hash
        
        const url = await URLModel.findOne({hash})

        if(url){
            response.redirect(url.originURL) 
            return
        }   
        
        response.status(400).json({error: "URL not found"})
        
    }

}