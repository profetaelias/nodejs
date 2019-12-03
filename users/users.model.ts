
const users = [
    {
        id: '1',
        nome: 'Elias Ribeiro', 
        age: 39
    },
    {
        id: '2',
        nome: 'Mariazinha', 
        age: 25
    }
]

export class User {
    static findAll(): Promise<any[]> {
        return Promise.resolve(users)
    }

    static findById(id: string): Promise<any> {
        return new Promise(resolve => {
            const filtered = users.filter(user => user.id === id)
            let user = undefined

            if (filtered.length > 0) {
                user = filtered[0]
            }

            resolve(user)
        })
    }
}