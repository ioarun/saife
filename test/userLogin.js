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
    describe('/GET User login', () => {
        it('user should be able to access login page', (done) => {
            chai.request(server)
                .get('/users/login')
                .end((err, res) => {
                    res.should.have.status(200)
                    //console.log(res)
                    done();
                })
        })
    })

    describe('/POST User login', function () {

        this.timeout(15000)
        it('user should be able to login', function (done) {
            chai.request(server)
                .post('/users/login')
                .redirects(0)
                .send({
                    email: 'izuru775@gmail.com',
                    password: '123456'
                })
                .end((err, res) => {
                    
                    //res.should.have.status(302)
                    res.header.location.should.include('/') // Success on login redirect to the root page
                    done();
                })
        })



        it('user should be directed back to login page, on loging faliure', function (done) {
            chai.request(server)
                .post('/users/login')
                .redirects(0)
                .send({
                    email: 'zuru775@gmail.com',  // wrong email
                    password: '123456'
                })
                .end((err, res) => {
                   
                    //res.should.have.status(302)
                    res.header.location.should.include('/users/login') // faliure on login redirect to /users/login'
                    done();
                })
        })
    })

    let user2 = {
        _id: new mongoose.mongo.ObjectId('6136258ca0ba3101c927dc11'),
        firstName: '',
        lastName: '',
        phone:''
    }

    it('User should not be allowed to keep any field empty.', function(done){
        // this.timeout(15000)

        chai.request("server")
            .put('/users/userAccountSettings')
            .set('content-type', 'application/json')
            .send(user2)
            .end((err, res) => {
                // console.log(res)
                res.should.have.status(400) // update success with 200
                done();
            })
        // expect(res.status).to.equal(200)
    })
})