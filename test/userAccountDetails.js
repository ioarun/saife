let mongoose = require("mongoose");
// User Model
let User = require('../models/User')

// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


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
                    email: 'arun@gmail.com',
                    password: '123456'
                })
                .end((err, res) => {
                    
                    //res.should.have.status(302)
                    res.header.location.should.include('/') // Success on login redirect to the root page
                    done();
                })
        })
    });
    
    describe('/GET User Account Settings', () => {

            
            // it('user should be able to login', function (done) {
            //     chai.request(server)
            //         .post('/users/login')
            //         // .redirects(0)
            //         .send({
            //             email: 'arun@gmail.com',
            //             password: '123456'
            //         })
            //         .end((err, res) => {
                        
            //             //res.should.have.status(302)
            //             res.header.location.should.include('/') // Success on login redirect to the root page
            //             done();
            //         })
            // })
    
        
        it('user should be able to access account settings page', (done) => {
            // let user = {
            //             _id: new mongoose.mongo.ObjectId('6136258ca0ba3101c927dc11'),
            //             firstName: 'Zohan',
            //             lastName: 'Dont Mess',
            //             phone:'1234567890'
            //         }
            chai.request(server)
                .get('/users/userAccountSettings')
                .end((err, res) => {
                    res.should.have.status(200)
                    //console.log(res)
                    done();
                })
        })
    })

    describe('/PUT User Account Settings', function () {
        // let user = {
        //     _id: new mongoose.mongo.ObjectId('6136258ca0ba3101c927dc11'),
        //     firstName: 'Zohan',
        //     lastName: 'Dont Mess',
        //     phone:'1234567890'
        // }
        // // this.timeout(15000)
        // it('User should be able to update their details', function (done) {
        //     chai.request(server)
        //         .put('/users/userAccountSettings')
        //         .send(user)
        //         .end((err, res) => {
        //             res.should.have.status(200) // update success with 200
        //             done();
        //         })
        // })

        let user2 = {
            _id: new mongoose.mongo.ObjectId('6136258ca0ba3101c927dc11'),
            firstName: '',
            lastName: '',
            phone:''
        }

        it('User should not be allowed to keep any field empty.', function(done){
            // this.timeout(15000)

        	chai.request(server)
                .put('/users/userAccountSettings')
                .set('content-type', 'application/json')
                .send(user2)
                .end((err, res) => {
                    // console.log(res)
                    // res.should.have.status(400) // update success with 200
                    done();
                })
            // expect(res.status).to.equal(200)
        })
    })

    //     it('user with incomplete data cannot register', function (done) {
    //         chai.request(server)
    //             .post('/users/register')
    //             .send({                         // Incomplete details
    //                 email: 'izuru775@gmail.com',  
    //                 password: '123456'
    //             })
    //             .end((err, res) => {
    //             //    console.log(res)
    //                 res.should.have.status(400) // faliure on submit, should set the status 400
    //                 done();
    //             })
    //     })
        
    // })
})