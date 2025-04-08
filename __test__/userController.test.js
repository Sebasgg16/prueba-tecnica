const request = require('supertest');
const app = require('./../index');

const mongoose = require('mongoose');
const User = require('./../models/User');


describe('user controller test',()=>{
     beforeEach(async () => {
        await User.deleteMany();
    },10000)
    
      afterAll(async () => {
        await User.deleteMany()
        await mongoose.connection.close()
      })

    it('deberia registrar un usuario nuevo si el correo no existe en la base de datos', async () =>{
        const email = 'juan@juan.com'
        const password = '#Clave1234'


    const response = await request(app)
                        .post('/api/register')
                        .send({email: email, password: password})

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('msg', `${email} created successfuly`)
    })
    it('NO deberia registrar un emain que ya exista en la base de datos', async () =>{
        const email = 'juan@juan.com'
        const password = '#Clave1234'

         const dbUser = new User({
                    email: email,
                    password: password
                })
                await dbUser.save()

        const response = await request(app)
                        .post('/api/register')
                        .send({email: email, password: password})

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('msg', `${email} is already exist in database`)
    })


    it('No deberia registrar si el email no es valido', async () =>{
        const email = 'juan@juancom'
        const password = '#Clave1234'

        const response = await request(app)
                                .post('/api/register')
                                 .send({email: email, password: password})
                                 
        expect( response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('msg',`${email} this emain is not valitd`)


 
    })
    it('NO deberia registrar si no cuenta con un email', async () =>{
        const email = ''
        const password = '#Clave12345'
        const response = await request(app)
                                .post('/api/register')
                                 .send({email: email, password: password})
    })

})