process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../server');

const configuration = require('../knexfile').test;
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('test server side routes', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => database.seed.run())
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('Client routes', () => {
    it('should send an html static file at homepage', (done) => {
      chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
    });

    it('should return a 404 for a non existent route', (done) => {
      chai.request(server)
      .get('/sad/sad')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
  })

  describe('GET endpoints', () => {
    it('GET /api/v1/items', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('items');
        response.body.items.should.be.a('array');
        response.body.items.length.should.equal(1);
        response.body.items[0].should.have.property('name');
        response.body.items[0].name.should.equal('boots');
        response.body.items[0].should.have.property('reason');
        response.body.items[0].reason.should.equal('too big');
        response.body.items[0].should.have.property('cleanliness');
        response.body.items[0].cleanliness.should.equal('Dusty');
        response.body.items[0].should.have.property('id');
        response.body.items[0].id.should.equal(1);
        response.body.should.have.property('Dusty');
        response.body.Dusty.should.equal(1);
        response.body.should.have.property('totalCount');
        response.body.totalCount.should.equal(1);

        done();
      });
    });

    it('GET /api/v1/1/item', (done) => {
      chai.request(server)
      .get('/api/v1/1/item')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('boots');
        response.body[0].should.have.property('reason');
        response.body[0].reason.should.equal('too big');
        response.body[0].should.have.property('cleanliness');
        response.body[0].cleanliness.should.equal('Dusty');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);

        done();
      });
    })
  })

  describe('POST routes', () => {
    it('HAPPY /api/v1/items', (done) => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'vaccum',
          reason: 'it sucks',
          cleanliness: 'Sparkling',
          id: 2
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(2);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('vaccum');
          response.body[0].should.have.property('reason');
          response.body[0].reason.should.equal('it sucks');
          response.body[0].should.have.property('cleanliness');
          response.body[0].cleanliness.should.equal('Sparkling');
          chai.request(server)
          .get('/api/v1/items')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.items.length.should.equal(2);
            response.body.items[0].should.have.property('name');
            response.body.items[0].should.have.property('reason');
            response.body.items[0].should.have.property('cleanliness');
            response.body.items[0].should.have.property('id');
            response.body.should.have.property('Dusty');
            response.body.Dusty.should.equal(1);
            response.body.should.have.property('Sparkling');
            response.body.Sparkling.should.equal(1);
            response.body.should.have.property('totalCount');
            response.body.totalCount.should.equal(2);
            done();
          });
        });
      });


    it('SAD /api/v1/items', (done) => {
        chai.request(server)
          .post('/api/v1/items')
          .send({
            name: 'vaccum',
            id: 2
          })
          .end((err, response) => {
            response.should.have.status(422);
            // response.body.should.be.a('object');
            // response.body.should.have.property('success');
            // response.body.success.should.equal(false);
            // response.body.should.have.property('message');
            // response.body.message.should.equal('Please enter a mountain range value');
            done();
          });
    });

  });

})
