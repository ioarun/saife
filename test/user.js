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
    /**
     * Test the login route
     */
    describe('/GET users/login', () => {
        it('user should be able to access the login page', (done) => {
            chai.request(server)
                .get('/users/login')
                .end((err, res) => {
                    res.should.have.status(200)
                    //console.log(res)
                    done();
                })
        })
        it('user should not be able to access non existing or wrong routes', (done) => {
            chai.request(server)
                .get('/user/login')
                .end((err, res) => {
                    res.should.have.status(404)
                    //console.log(res)
                    done();
                })
        })
    })

    /**
     * Test registration of user
     */
    let user = {
        email: 'izuru@gmail.com',
        password: '123456',
    }
    describe('/POST users/login', function () {
        // it('New user should be able to login', function (done) {
        //     this.timeout(15000)
        //     chai.request(server)                
        //         .post('/users/login')
        //         .send(user)
        //         .end(function (err, res) {
        //             res.should.have.status(200)
        //             done();
        //         })

        // })
        it('New user should be able to login', function () {
            this.timeout(15000)
            return chai.request(server)                
                .post('/users/login')
                .send(user)
                .then(function (err, res) {
                    expect(res).to.have.status(300)
                    expect(res).to.be.json;
                    
                })

        })
    })

})