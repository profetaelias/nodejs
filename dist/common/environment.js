"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: yargs.argv.t ? 'mongodb://localhost/node-api-test-db' : 'mongodb://localhost/restapi' },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
};
console.log(exports.environment.db.url);
