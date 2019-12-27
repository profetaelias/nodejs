import {Router} from './router'
import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'
import {environment} from '../common/environment'


export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    
    basePath: string
    pageSize: number = 4
    
    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
    }

    envelope(document:any):any {
        let resource = Object.assign({_links:{}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    envelopeAll(documents:any[], options: any = {}) : any {
        const resource: any = {
            _links: {
                self: `${options.url}`
            }, 
            items: documents
        }
        
        if(options.page && options.count && options.pageSize) {
            if(options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            }
            const remaing = options.count - (options.page * options.pageSize)

            if(remaing > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
            }
        }

        return resource
    }

    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> {
        return query
    }

    protected prepareAll(query: mongoose.DocumentQuery<D[],D, {}>): mongoose.DocumentQuery<D[],D, {}> {
        return query
    }

    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError("Document not found"))
        } else {
            next()
        }
    }

    findAll = (req, res, next) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize

        this.model.count({}).exec()
            .then(count => this.prepareAll(
                this.model.find()
                            .limit(this.pageSize))
                            .skip(skip)
                .then(this.renderAll(res, next, {page, count, pageSize: this.pageSize, url: req.url})))
            .catch(next)
    }

    findById = (req, res, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next)
    }

    save = (req, res, next) => {
        let document = new this.model(req.body)
        console.log(this.model)
        document.save()
            .then(this.render(res, next))
            .catch(next)
    }

    update = (req, res, next) => {
        const options = {runValidators: true, overwrite: true}
        this.model.update({_id: req.params.id}, req.body, options).exec()
            .then(result => {
                if (result.n) {
                    return this.model.findById(req.params.id)
                } else {
                    throw new NotFoundError('Documento não encontrado')
                }
            })
            .then(this.render(res, next))
            .catch(next)
    }

    findByIdAndUpdate = (req, res, next) => {
        const options = {runValidators: true, new: true}
        this.model.findByIdAndUpdate({_id: req.params.id}, req.body, options)
            .then(this.render(res, next))
            .catch(next)
    }

    remove = (req, res, next) => {
        this.model.deleteOne({_id: req.params.id}, req.body).exec()
            .then((cmdResult: any) => {
                if(cmdResult.deletedCount > 0) {
                    res.send(204)
                } else {
                    throw new NotFoundError('Documento não encontrado')
                }
            }).catch(next)
            return next()
    }
    
}
