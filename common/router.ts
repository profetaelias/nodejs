import * as restify from 'restify'
import { EventEmitter } from 'events'
import {NotFoundError} from 'restify-errors'

export abstract class Router extends EventEmitter{
    abstract applyRoutes(application: restify.Server)

    envelope(document:any):any {
        let resource = Object.assign({_links:{}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if(document){
                this.emit('beforeRender', document)
                response.json(this.envelope(document, this))
            } else {
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }
    }

    renderAll(response: restify.Response, next: restify.Next) {
        return (documents: any[]) => {
            if(documents){
                documents.forEach((document, index, array) => {
                    
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document, this)
                })
                response.json(documents)
            } else {
                response.json([])
            }
            return next()
        }
    }
}