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
const sinon = require('sinon')
const supertest =require('supertest')
const ejs = require('ejs');

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
        it('Exisiting users should not be able to register', function (done) {
            chai.request(server)
                .post('/users/register')
                .send({
                    firstName: 'test',
                    lastName: 'subjec',
                    email:'man@gmail3.com',
                    phone:'1234567890',
                    password:'123456',
                    password2:'123456'
                })
                .end((err, res) => {
                    
                    // console.log(res)
                    res.should.have.status(400) // register failure with 400
                    done();
                })
        })



        it('user with incomplete data cannot register', function (done) {
            chai.request(server)
                .post('/users/register')
                .send({                         // Incomplete details
                    email: 'izuru775@gmail.com',  
                    password: '123456'
                })
                .end((err, res) => {
                //    console.log(res)
                    res.should.have.status(400) // faliure on submit, should set the status 400
                    done();
                })
        })
        
    })
})