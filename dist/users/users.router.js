"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify = require("restify");
const users_model_1 = require("./users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.find({ email: req.query.email })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //or delete document.password
        });
    }
    applyRoutes(application) {
        application.get('/users', restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: this.findAll }
        ]));
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.update]);
        application.patch('/users/:id', [this.validateId, this.findByIdAndUpdate]);
        application.del('/users/:id', [this.validateId, this.remove]);
    }
}
exports.usersRouter = new UsersRouter();
