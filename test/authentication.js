'use strict';

const should = require('chai').should;
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080');

describe('Authentication', function() {
    let userInfoReceived;
    let userInfo = {
        username: 'jeannot37',
        email: 'j@w.com',
        password: 'tpz,c',
        type: 'Owner'
    };
        
    it('should return a 401 response in case of wrong login', function(done) {
        api.post('/login')
        .set('Accept', 'application/json')
        .send({
            email: 'xx@g.com',
            password: 'xx'
        })
        .expect(401)
        .end(function(err, res) {
            if(err) return done(err);

            expect(res.body.message).to.equal('Login failed');
            done();
        });
    });

    it('should create user with correct information', function(done) {
        api.post('/users')
        .set('Accept', 'application/json')
        .send(userInfo)
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);

            expect(res.body).to.be.an('object');
            expect(res.body.username).to.be.equal(userInfo.username);
            expect(res.body.email).to.be.equal(userInfo.email);
            expect(res.body.password).to.be.undefined;
            expect(res.body.token).to.be.a('string');

            let tokenExpiry = new Date(res.body.tokenExpiry);
            expect(tokenExpiry).to.be.a('date');
            // Check that the expiry date is around 30 days from now
            expect(tokenExpiry).to.satisfy(function(date) { return date.getTime() >= (Date.now() + (60 * 60 * 24 * 30) - 10000); });
            done();
        });
    });

    it('should login correctly and returns a User object', function(done) {
        api.post('/login')
        .set('Accept', 'application/json')
        .send({
            email: userInfo.email,
            password: userInfo.password
        })
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);

            expect(res.body).to.be.an('object');
            expect(res.body.username).to.be.equal(userInfo.username);
            expect(res.body.email).to.be.equal(userInfo.email);
            expect(res.body.password).to.be.undefined;
            expect(res.body.token).to.be.a('string');

            let tokenExpiry = new Date(res.body.tokenExpiry);
            expect(tokenExpiry).to.be.a('date');
            // Check that the expiry date is around 30 days from now
            expect(tokenExpiry).to.satisfy(function(date) { return date.getTime() >= (Date.now() + (60 * 60 * 24 * 30) - 10000); });

            userInfoReceived = res.body;

            done();
        });
    });

    it('should return current logged in user object', function(done) {
        api.get('/users/me/')
        .set('Token', userInfoReceived.token)
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);

            expect(res.body).to.be.an('object');
            expect(res.body.username).to.be.equal(userInfo.username);
            expect(res.body.email).to.be.equal(userInfo.email);
            expect(res.body.password).to.be.undefined;
            expect(res.body.token).to.be.undefined;
            expect(res.body.tokenExpiry).to.be.undefined;

            done();
        });
    });
});