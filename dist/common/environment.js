"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3015 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/restapi' },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
};
