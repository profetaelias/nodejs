import * as yargs from 'yargs'

export const environment = {
    server: {port : process.env.SERVER_PORT || 3000}, 
    db: {url: yargs.argv.t ? 'mongodb://localhost/node-api-test-db' : 'mongodb://localhost/restapi'}, 
    security: {saltRounds: process.env.SALT_ROUNDS || 10}
}

console.log(environment.db.url)