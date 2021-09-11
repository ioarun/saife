let mongoose = require("mongoose");
// User Model
let User = require('../models/User')

// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const bcrypt = require('bcryptjs');
const { json } = require("body-parser");

const expect = chai.expect

chai.use(chaiHttp);



describe('App', () => {
    describe('/GET User register', () => {
        it('user should be able to access register page', (done) => {
            chai.request(server)
                .get('/users/register')
                .end((err, res) => {
                    res.should.have.status(200)
                    //console.log(res)
                    done();
                })
        })
    })

    describe('/POST User register', function () {

        this.timeout(15000)
        it('user should be able to register', function (done) {
            chai.request(server)
                .post('/users/register')
                .send({
                    firstName: 'mytestmail2@gmail.com',
                    lastName: '123456',
                    email:'775@gmail.com',
                    phone:1234567890,
                    password:123456,
                    password2:123456
                })
                .end((err, res) => {
                    
                    console.log(res)
                    res.header.location.should.include('/users/login') // Success on sumbit redirect to the login page
                    done();
                })
        })



        it('user should be directed back to login page, on loging faliure', function (done) {
            chai.request(server)
                .post('/users/register')
                .redirects(0)
                .send({                         // Incomplete details
                    email: 'izuru775@gmail.com',  
                    password: '123456'
                })
                .end((err, res) => {
                   console.log(res)
                    res.should.have.status(200) // faliure on submit should rerender the registration page
                    done();
                })
        })
    })
})