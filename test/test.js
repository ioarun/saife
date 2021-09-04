const { expect } = require('chai');
const request = require('supertest');
const router = require('../routes/users')

const app = require('../server')
const db = require('../dbconnect');
//const { connect } = require('../routes');

describe('POST /users/login',()=>{
    // DB connection established
    before((done)=>{
        db.connect()
        .then(()=>done())
        .catch((err)=>done(err))
    })
    // DB connection closed
    after((done)=>{
        db.close()
        .then(()=>done())
        .catch((err)=>done(err))
    })
    it()
})
