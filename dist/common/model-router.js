"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError("Document not found"));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => {
            this.prepareAll(this.model.find())
                .then(this.renderAll(res, next))
                .catch(next);
        };
        this.findById = (req, res, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(res, next))
                .catch(next);
        };
        this.save = (req, res, next) => {
            let document = new this.model(req.body);
            document.save()
                .then(this.render(res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const options = { runValidators: true, overwrite: true };
            this.model.update({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            })
                .then(this.render(res, next))
                .catch(next);
        };
        this.findByIdAndUpdate = (req, res, next) => {
            const options = { runValidators: true, new: true };
            this.model.findByIdAndUpdate({ _id: req.params.id }, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        };
        this.remove = (req, res, next) => {
            this.model.remove({ _id: req.params.id }, req.body).exec()
                .then((cmdResult) => {
                if (cmdResult.deletedCount > 0) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).catch(next);
            return next();
        };
    }
    prepareOne(query) {
        return query;
    }
    prepareAll(query) {
        return query;
    }
}
exports.ModelRouter = ModelRouter;
