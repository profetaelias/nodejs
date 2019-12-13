import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Restaurant} from './restaurants.model'

class RestaurantsRouter extends ModelRouter<Restaurant> {

    constructor() {
        super(Restaurant)
        this.on('beforeRender', document => {
            document.password = undefined
            //or delete document.password
        })
    }

    applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [this.validateId, this.findById])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [this.validateId,this.update])
        application.patch('/restaurants/:id', [this.validateId, this.findByIdAndUpdate])
        application.del('/restaurants/:id', [this.validateId, this.remove])
    }
}

export const restaurantsRouter = new RestaurantsRouter()