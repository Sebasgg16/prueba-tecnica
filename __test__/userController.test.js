const request = require('supertest');
const app = require('./../index');

const mongoose = require('mongoose');
const User = require('./../models/User');


describe('user controller test', () => {
    beforeEach(async () => {
        await User.deleteMany();
    }, 10000)

    afterAll(async () => {
        await User.deleteMany()
        await mongoose.connection.close()
    })

    it('deberia registrar un usuario nuevo si el correo no existe en la base de datos', async () => {
        const email = 'juan@juan.com'
        const password = '#Clave1234'


        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: password })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('msg', `${email} created successfuly`)
    })
    it('NO deberia registrar un emain que ya exista en la base de datos', async () => {
        const email = 'juan@juan.com'
        const password = '#Clave1234'

        const dbUser = new User({
            email: email,
            password: password
        })
        await dbUser.save()

        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: password })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('msg', `${email} is already exist in database`)
    })

    it("NO deberia registrar un usurio si no tiene un email", async () => {
        const email = ""
        const password = "$Clave123456"

        const response = await request(app).post("/api/register")
            .send({ "email": email, "password": password })


        expect(response.body.msg.email).toHaveProperty("msg", "Ups!! Email is required")
        expect(response.statusCode).toBe(400)

    })

    it("NO deberia registrar si el email no es valido", async () => {
        const email = "juan"
        const password = "$Clave123456"
        const response = await request(app).post("/api/register")
            .send({ email, password })

        expect(response.body.msg.email).toHaveProperty("msg", "Email is invalid!!")
        expect(response.statusCode).toBe(400)
    })

    it("NO deberia registrar si la contraseÃ±a no es de tipado fuerte", async () => {
        const email = "juan@1234.com"
        const password = "2345"

        const response = await request(app).post("/api/register")
            .send({ email, password })

        expect(response.body.msg.password).toHaveProperty("msg", "Hey!! pasword must contain at least, uppercase, lowercase, numbers and characters")
        expect(response.status).toBe(400)
    })

    it('Deberia caer en catch al registrar un usuario', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Error trayendo datos de la base de datos')
        })

        const response = await request(app).post('/api/register').send({
            email: "juan@juan.com",
            password: "#Clave1234"
        })

        expect(response.status).toBe(500)
    })


    //pruebas unitarias de login////////////////////////////////////////////////////////////////////////////////////////////////////////


    it('Deberia iniciar sesion si el usuario existe en la base de datos', async () => {
        const email = "juanse@gmail.com"
        const password = "$Sebas12345"

        const dbUser = new User({
            email: email,
            password: password
        }) 
        await dbUser.save()

        const response = await request(app)
            .post('/api/login')
            .send({ email, password })

       


        expect(response.status).toBe(200)

    })


    it('Debería retornar 400 si el usuario no existe en la base de datos', async () => {
        const email = "jajajja@correo.com"
        const password = "$Sebas12345"
       
    
        const response = await request(app)
            .post('/api/login')
            .send({ email: "juan@juan.com", password: password })
    
        expect(response.status).toBe(400)

    })

    it('Deberia retornar 400 si la contrase;a es incorrecta', async () => {
        const email = "juan@juan.com"
        const password = "#Clave1234"
        const dbUser = new User({
            email: email,
            password: password
        })
        await dbUser.save()


        const response = await request(app)
        .post('/api/login')
        .send({ email: email, password:"2354" })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('msg', 'Incorrect password!!')
    console.log(response.status)

    })
    it('Deberia caer en catch al logear un usuario', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Error trayendo datos de la base de datos')
        })
        const response = await request(app).post('/api/login').send({email: "juan@juan.com", password: "#Clave1234"})
        expect(response.status).toBe(500)
        console.log(response.status)
    })
    it("deberia eliminar el usurio mediante el id que le pase", async () => {
        const email= "juan@juan.com"
        const password= "#Clave1234"

        const dbUser = new User({
            email: email,
            password: password
        })
        await dbUser.save()

        const response = await request(app).delete(`/api/delete-user/${dbUser._id}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('msg', `User with ID ${dbUser._id} deleted successfully`)
        console.log(dbUser._id)
    })

    it("NO debe eliminar si no encuentra el usuario por id ", async () => {
       const id = new mongoose.Types.ObjectId()
       expect(id.toString())
       const response = await request(app).delete(`/api/delete-user/${id}`)
       expect(response.status).toBe(404)
       console.log(response.body.msg)

    })


})