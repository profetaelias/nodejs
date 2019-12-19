import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Review} from './reviews.model'
import { NotFoundError } from 'restify-errors'
import * as mongoose from 'mongoose'

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {
        super(Review)
    }

    envelope(document:any):any {
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restId}`
        return resource
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name').populate('restaurant', 'name')
    }

    protected prepareAll(query: mongoose.DocumentQuery<Review[], Review, {}>): mongoose.DocumentQuery<Review[], Review, {}> {
        return query.populate('user', 'name').populate('restaurant', 'name')
    }

    applyRoutes(application: restify.Server) {
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
    }
}

export const reviewsRouter = new ReviewsRouter()