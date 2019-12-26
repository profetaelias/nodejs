import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'

let server: Server
let address = `http://localhost:${environment.server.port}`

test('test get /users', () => {
    return request(`${address}`)
            .get('/users')
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.body.items).toBeInstanceOf(Array)
            }).catch(fail)
})

test('test post /users', () => {
    return request(`${address}`)
            .get('/users')
            .then(response => {
                if(response.body.items.length > 0) {
                    return request(`${address}`)
                        .del(`/users/${response.body.items[0]._id}`)
                        .then(()=> {
                            return request(`${address}`)
                                .post('/users')
                                .send({
                                    name: 'usuario3',
                                    email: 'usuario1@gmail.com',
                                    password: '123456',
                                    cpf: '962.116.531-82'
                                })
                    }).then(response => {
                        expect(response.status).toBe(200)
                        expect(response.body._id).toBeDefined()
                        expect(response.body.name).toBe('usuario3')
                        expect(response.body.cpf).toBe('962.116.531-82')
                        expect(response.body.password).toBeUndefined()
                    }).catch(fail)
                } else {
                    return request(`${address}`)
                        .post('/users')
                        .send({
                            name: 'usuario3',
                            email: 'usuario3@gmail.com',
                            password: '123456',
                            cpf: '962.116.531-82'
                        }).then(response => {
                            expect(response.status).toBe(200)
                            expect(response.body._id).toBeDefined()
                            expect(response.body.name).toBe('usuario3')
                            expect(response.body.cpf).toBe('962.116.531-82')
                            expect(response.body.password).toBeUndefined()
                        }).catch((fail))
                }
            })
})

test('test patch password /users', () => {
    return request(`${address}`)
            .get('/users')
            .then(response => {
                return request(`${address}`)
                    .patch(`/users/${response.body.items[0]._id}`)
                    .send({
                        email: 'usuario1@msn.com',
                    })                        
            }).then((response)=> {
                expect(response.status).toBe(200)
                expect(response.body.email).toBe('usuario1@msn.com')
            }).catch(fail)
})

test('test get /users/aaaaa - not found', () => {
    return request(address)
            .get('/users/aaaaa')
            .then(response => {
                expect(response.status).toBe(404)
            }).catch(fail)
})