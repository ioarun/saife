let mongoose = require("mongoose");
// User Model
let User = require('../models/User')

// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Push', () => {
//   /*
//   * Test the /POST route
//   */
  describe('/POST subscribe', () => {
    it('it should create a new subscription object and save it in db', (done) => {
    
    let subscription = {
            id: '6136258ca0ba3101c927dc11',
            pushSubObj: '{"endpoint":"https://fcm.googleapis.com/fcm/send/fAIKMSLJoY4:APA91bGdzuTVV3joJyplpcHY9ZPKFifHrag0yCyw-J4lkbqL6GKoRjz1x_noPQSQrlPD2Mm6akoDFfYqlNUxdg8Za09g6tuaOdjdVwUjJaCC8Ee7dWz-Wd50u9fXwackuO-QQNVnDSNq","expirationTime":null,"keys":{"p256dh":"BDL2lhqbCfUf-ZJRoflA4IGUWuLWuzYNqg__nN5nKSEWM3Ib_HtMiRmuY3iyGxvocpRDD5ZIpdchX75J8A1LVZU","auth":"Pi2TPf41NRIRYTEs10Hsvw"}}'
          }
      chai.request(server)
          .post('/subscribe')
          .send(subscription)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('statusMessage').eql('Subscribed');
                // res.body.errors.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
});

// describe('/POST send push', () => {
//     it('it should send a push notification to the user', (done) => {
    
//     let userId = {
//         _id: "6136258ca0ba3101c927dc11"
//         }
//       chai.request(server)
//           .post('/send-push')
//           .send(userId)
//           .end((err, res) => {
//                 if (!err){
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('statusMessage').eql('Notification sent');
//                 }
//                 else{
//                     return done(err);
//                 }
                
//                 // res.body.errors.should.have.property('pages');
//                 // res.body.errors.pages.should.have.property('kind').eql('required');
//             done();
//           });
//     });
// });

});
