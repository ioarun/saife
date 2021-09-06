const { expect } = require('chai')
const request = require('supertest')
const passport = require('passport')
// const app = require('../server')

const server = request.agent('http://localhost:5000')

describe('GET /users/login',()=>{
    it('login',(done)=>{
        server
            .post('/users/login')
            .send({email:'izuru775@gmail.com',password:'123456'})
            .expect(302)
            .expect('Location','/')
            .end((err,res)=>{
                if(err){
                  return done(err)
                }
                return done()
            })
    })
})

