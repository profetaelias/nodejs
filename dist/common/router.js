"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    envelope(document, objeto) {
        return document;
    }
    envelopeAll(documents, options = {}) {
        return documents;
    }
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(this.envelope(document, this));
            }
            else {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            }
            return next();
        };
    }
    renderAll(response, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document, this);
                });
                response.json(this.envelopeAll(documents, options));
            }
            else {
                response.json(this.envelopeAll([], options));
            }
            return next();
        };
    }
}
exports.Router = Router;
