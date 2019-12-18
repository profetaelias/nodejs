import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'

export class Server {

    application: restify.Server

    initRoutes(routers: Router[] = []) : Promise<any> {
        return new Promise((resolve, reject) => { 
            try {
                this.application = restify.createServer({
                    name: 'rest-api',
                    versions: ['1.0.0', '2.0.0']
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                
                for (let route of routers) {
                    route.applyRoutes(this.application)
                }
                                
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError) 
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