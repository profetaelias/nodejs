import 'jest'
import * as jestCli from 'jest-cli'
import * as request from 'supertest'
import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { reviewsRouter } from './reviews/reviews.router'
import { environment } from './common/environment'

let server: Server

const beforeAllTests = () => {
    
    server = new Server()
    
    return server
            .bootstrap([usersRouter, reviewsRouter])
            .catch(console.error)
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
    .then(()=>jestCli.run())
    .then(()=>afterAllTests())
    .catch(console.error)