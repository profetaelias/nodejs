"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
            //or delete document.password
        });
    }
    applyRoutes(application) {
        application.get('/users', [(req, res, next) => {
                users_model_1.User.find()
                    .then(this.render(res, next))
                    .catch(next);
            }]);
        application.get('/users/:id', [(req, res, next) => {
                users_model_1.User.findById(req.params.id)
                    .then(this.render(res, next))
                    .catch(next);
            }]);
        application.post('/users', [(req, res, next) => {
                let user = new users_model_1.User(req.body);
                user.save()
                    .then(this.render(res, next))
                    .catch(next);
            }]);
        application.put('/users/:id', (req, res, next) => {
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    res.send(404);
                }
            })
                .then(this.render(res, next))
                .catch(next);
        });
        application.patch('/users/:id', (req, res, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate({ _id: req.params.id }, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        });
        application.del('/users/:id', (req, res, next) => {
            users_model_1.User.remove({ _id: req.params.id }, req.body).exec()
                .then((cmdResult) => {
                console.log(cmdResult.deletedCount > 0);
                if (cmdResult.deletedCount > 0) {
                    res.send(204);
                }
                else {
                    res.status(404);
                }
            }).catch(next);
            return next();
        });
    }
}
exports.usersRouter = new UsersRouter();
