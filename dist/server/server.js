"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
class Server {
    initRoutes(routers = []) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'rest-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                for (let route of routers) {
                    route.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    initDB() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url);
    }
    bootstrap(routers = []) {
        return this.initDB()
            .then(() => this.initRoutes(routers)
            .then(() => this));
    }
}
exports.Server = Server;
