import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //or delete document.password
        })
    }

    applyRoutes(application: restify.Server) {
        application.get('/users', this.findAll)
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId,this.update])
        application.patch('/users/:id', [this.validateId, this.findByIdAndUpdate])
        application.del('/users/:id', [this.validateId, this.remove])
    }
}

export const usersRouter = new UsersRouter()