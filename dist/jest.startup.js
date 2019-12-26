"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const reviews_router_1 = require("./reviews/reviews.router");
let server;
const beforeAllTests = () => {
    server = new server_1.Server();
    return server
        .bootstrap([users_router_1.usersRouter, reviews_router_1.reviewsRouter])
        .catch(console.error);
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
