import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { usersRouter } from '../users/users.router'
import { User } from '../dist/users/users.model'
import { environment } from '../common/environment'

let server: Server
let address = undefined

beforeAll(()=>{    
    environment.server.port = process.env.SERVER_PORT || 3017
    address = `http://localhost:${environment.server.port}`
    
    server = new Server()

    return server.bootstrap([usersRouter])
                 .then(() => User.remove({}).exec())
                 .catch(console.error)
})

afterAll(() => {
    return server.shutdown()
})

test('get /users', () => {
    return request(`${address}`)
            .get('/users')
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.body.items).toBeInstanceOf(Array)
            }).catch(fail)
})

test('post /users', () => {
    return request(`${address}`)
            .post('/users')
            .send({
                name: 'usuario1',
                email: 'usuario1@gmail.com',
                password: '123456',
                cpf: '962.116.531-82'
            })
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.body._id).toBeDefined()
                expect(response.body.name).toBe('usuario1')
                expect(response.body.cpf).toBe('962.116.531-82')
                expect(response.body.password).toBeUndefined()
            }).catch(fail)
})