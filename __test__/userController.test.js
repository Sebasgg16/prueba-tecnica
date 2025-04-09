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

    it("NO deberia registrar un usurio si no tiene un email", async ()=> {
        const email= ""
        const password="$Clave123456"

        const response = await request (app).post("/api/register")
                                            .send({"email":email, "password":password})
        

       expect(response.body.msg.email).toHaveProperty("msg","Ups!! Email is required")
        expect(response.statusCode).toBe(400)
        
    })

    it("NO deberia registrar si el email no es valido", async ()=>{
        const email= "juan"
        const password= "$Clave123456"
         const response = await request (app).post("/api/register")
                                             .send ({email, password})
                                    
        expect(response.body.msg.email).toHaveProperty("msg", "Email is invalid!!")
        expect(response.statusCode).toBe(400)
    })

    it("NO deberia registrar si la contraseÃ±a no es de tipado fuerte", async()=>{
        const email= "juan@1234.com"
        const password= "2345"

        const response =await request (app).post("/api/register")
                                           .send ({email, password})

        expect(response.body.msg.password).toHaveProperty("msg", "Hey!! pasword must contain at least, uppercase, lowercase, numbers and characters")
        expect(response.status).toBe(400)   
    })  

})