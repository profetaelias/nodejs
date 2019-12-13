"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.on('beforeRender', document => {
            document.password = undefined;
            //or delete document.password
        });
    }
    applyRoutes(application) {
        application.get('/users', this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId, this.update]);
        application.patch('/users/:id', [this.validateId, this.findByIdAndUpdate]);
        application.del('/users/:id', [this.validateId, this.remove]);
    }
}
exports.usersRouter = new UsersRouter();
