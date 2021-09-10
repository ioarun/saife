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
    describe('/POST User Regiter', () => {
        it('user should be able to register and redirected to login page', (done) => {
            chai.request(server)
                .post('/users/register')
                .send({
                    firstName: 'Iuru',
                    lastName: 'amikaram',
                    email: 'iuru775@gmail.com',
                    phone: '1234567890',
                    password: '123456',
                    password2: '123456'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    //console.log(res)
                   
                })
                done();

        })
    })

})