import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'

export class Server {

    application: restify.Server

    initRoutes(routers: Router[] = []) : Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'rest-api',
                    version: '1.0.0'
                })
                
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                
                for (let route of routers) {
                    route.applyRoutes(this.application)
                }
                
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    
    initDB(): Promise<any> {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url)
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initDB()
            .then(() => 
                this.initRoutes(routers)
                    .then(() => 
                        this))
    }
    
}