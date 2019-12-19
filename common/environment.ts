export const environment = {
    server: {port : process.env.SERVER_PORT || 3014}, 
    db: {url: process.env.DB_URL || 'mongodb://localhost/restapi'}, 
    security: {saltRounds: process.env.SALT_ROUNDS || 10}
}