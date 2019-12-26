import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'

let server: Server
let address = `http://localhost:${environment.server.port}`

test('test get /reviews', () => {
    return request(`${address}`)
            .get('/reviews')
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.body.items).toBeInstanceOf(Array)
            }).catch(fail)
})
