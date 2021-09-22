// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// const server = request.agent('http://localhost:5000')

// describe('GET /users/login',()=>{
//     it('login',(done)=>{
//         chai.request(server)
//             .post('/users/login')
//             .send({email:'izuru775@gmail.com',password:'123456'})
//             .end((err,res)=>{
//                 if(err){
//                   return done(err);
//                 }
//                 return done();
//             })
//     })
// })

//Our parent block
describe('Login', () => {
    //   /*
    //   * Test the /POST route
    //   */
      describe('/POST login', () => {
        it('it should log user in', (done) => {
        
        let details = {email: 'izuru775@gmail.com',password: '123456'};
          chai.request(server)
              .get('/users/login')
              .send(details)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    if(err){
                            return done(err);
                        }
                    return done();
                
              });
        });
    });
});
    