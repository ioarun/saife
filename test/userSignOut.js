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
    
    describe('/POST User login', function () {

        this.timeout(15000)
        it('user should be able to login & logout', function (done) {
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

            it('user should be able to logout', (done) => {
                chai.request(server)
                    .get('/users/logout')
                    .redirects(0)
                    .end((err, res) => {
                        // res.should.have.status(200)
                        res.header.location.should.include('/users/login') // Success on logout should redirect to login page
                        done();
                    })
            })
       
        
    })
    
})
