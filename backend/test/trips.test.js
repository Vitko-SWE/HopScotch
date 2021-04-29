process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

// describe('trips', () => {
//   describe('/GET trip', () => {
//     it('it should GET a trip', (done) => {
//       setTimeout(function() {
//         chai.request(app)
//         .get('/api/trips/gettrip/1')
//         .end((err, res) => {
//           res.should.have.status(200);
//           console.log(err);
//           done();
//         });
//       }, 1000);
//     });
//   });
// });
