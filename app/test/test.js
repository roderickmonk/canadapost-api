"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
let server = require('../app.js');
let should = chai.should();
let expect = chai.expect;
let chai_assert = require('chai').assert;
chai.use(chaiHttp);
describe('Test Case: Adding `members`: ', () => {
    afterEach(function (done) {
        chai.request(server)
            .get('/api/members/count')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        })
            .catch(done);
    });
    after(function (done) {
        chai.request(server)
            .get('/api/members/count')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            chai_assert(res.body === TEST_MEMBER_COUNT, 'Wrong number of members');
            done();
        })
            .catch(done);
    });
    for (let i = 0; i < TEST_MEMBER_COUNT; ++i) {
        it('Add a member: ' + i, (done) => {
            chai.request(server)
                .post('/api/members')
                .send({
                firstname: 'test' + i,
                familyname: 'name' + i,
                dob: '1970-01-01',
                address: 'address' + i,
                place: 'Delta, BC, Canada',
                postcode: 'V4M1P4',
                primaryphone: '604-916-0162',
                emailaddress: 'test' + i + '@example.com',
                liabilityagreed: true,
                communicationsagreed: true
            })
                .then((res) => {
                res.should.have.status(200);
                done();
            })
                .catch(done);
        });
    }
});
describe('Test Case: `Signups and Logins`: ', function () {
    it('Failed Login', function (done) {
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/login')
            .send({ firstname: 'nonsense', emailaddress: 'nonsense@example.com', password: 'nonsense' })
            .then((res) => done('Test failure: Signup did not fail'))
            .catch((res) => {
            res.should.have.status(401);
            done();
        })
            .catch(done);
    });
    it('Signup and get members', function (done) {
        let JWT;
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/signup')
            .send({
            firstname: 'test' + test_member_index,
            familyname: 'name' + test_member_index,
            dob: '1970-01-01',
            postcode: 'V4M1P4',
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then((res) => {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members').set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            chai_assert(res.body.length === TEST_MEMBER_COUNT, 'Incorrect number of members returned');
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        })
            .catch(done);
    });
    it('Login, get members, and then renew them all', function (done) {
        let JWT;
        let agent = chai.request.agent(server);
        let members;
        agent
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then((res) => {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members').set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            members = res.body;
            chai_assert(members.length === TEST_MEMBER_COUNT, 'Incorrect number of members returned');
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
        })
            .then(() => {
            for (let member of members) {
                agent.put('/api/members/' + member._id + '/renew').set('x-auth', JWT)
                    .then((res) => res.should.have.status(200))
                    .catch(done);
            }
            done();
        })
            .catch(done);
    });
    it('Signup and edit personal profile', function (done) {
        let JWT;
        let member = {};
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/signup')
            .send({
            firstname: 'test' + test_member_index,
            familyname: 'name' + test_member_index,
            dob: '1970-01-01',
            postcode: 'V4M1P4',
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then((res) => {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            member = res.body;
            member.joiningyear = 2004;
        })
            .then(() => agent.put('/api/members/' + JWT).send(member).set('x-auth', JWT))
            .then((res) => {
            chai_assert(res.body.joiningyear === 2004, 'Requested Update not performed');
            res.should.have.status(200);
            done();
        })
            .catch(done);
    });
    it('Login and edit personal profile', function (done) {
        let JWT;
        let member = {};
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then((res) => {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            member = res.body;
            chai_assert(member.joiningyear === 2004, 'joiningyear incorrect');
            member.joiningyear = 2005;
        })
            .then(() => agent.put('/api/members/' + JWT).send(member).set('x-auth', JWT))
            .then((res) => {
            chai_assert(res.body.joiningyear === 2005, 'Update not done');
            res.should.have.status(200);
            done();
        })
            .catch(done);
    });
    it('Signup failure', function (done) {
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/signup')
            .send({
            firstname: 'test' + test_member_index,
            familyname: 'name' + test_member_index,
            dob: '1970-01-01',
            postcode: 'V4M1P4',
            emailaddress: 'nonsense' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then(() => done('Test failure: Signup did not fail'))
            .catch(function (res) {
            res.should.have.status(401);
            done();
        })
            .catch(done);
    });
    it('Login failure', function (done) {
        chai.request(server)
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: 'nonsense'
        })
            .then(() => done('Test failure: Login did not fail'))
            .catch((res) => {
            res.should.have.status(401);
            done();
        })
            .catch(done);
    });
    it('Logout and then fail to get all members', function (done) {
        let agent = chai.request.agent(server);
        agent
            .post('/api/members/logout')
            .then((res) => {
            res.should.have.status(200);
            agent
                .get('/api/members')
                .then(() => done('Test Failure: Read `members` without authorization'))
                .catch((err) => {
                err.should.have.status(440);
                done();
            })
                .catch(done);
        })
            .catch(done);
    });
});
describe('Test Case: `renewals`: ', () => {
    let JWT;
    let memberId;
    let agent = chai.request.agent(server);
    it('Login', function (done) {
        agent
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then((res) => {
            res.should.have.status(200);
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then((res) => {
            memberId = res.body._id;
            done();
        })
            .catch(done);
    });
    for (let i = 0; i < TEST_RENEWALS_COUNT; ++i) {
        it('Add Renewal[' + i + ']', (done) => {
            agent
                .put('/api/renewals').set('x-auth', JWT)
                .send({
                memberId: memberId,
                year: 2016 + i,
                renewed: false,
                paid: true
            })
                .then((res) => {
                res.should.have.status(200);
                done();
            })
                .catch(done);
        });
    }
    it('Read renewals', (done) => {
        agent
            .get('/api/renewals').set('x-auth', JWT)
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        })
            .catch(done);
    });
});
describe('Test Case: `newsitems`: ', () => {
    after(function (done) {
        done();
        return;
        chai.request(server)
            .get('/api/newsitems')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            chai_assert(res.body.length === 0, 'Failed to delete all News Items');
            done();
        })
            .catch(done);
    });
    let JWT;
    let member = {};
    let agent = chai.request.agent(server);
    it('Login and ensure member has sufficient privilges to add Renewals', function (done) {
        agent
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[0]
        })
            .then(function (res) {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members/' + JWT).set('x-auth', JWT))
            .then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            member = res.body;
            member.role = 'admin';
        })
            .then(() => agent.put('/api/members/' + JWT).send(member).set('x-auth', JWT))
            .then(function (res) {
            res.should.have.status(200);
            chai_assert(res.body.role === 'admin', 'Role change failed');
            done();
        })
            .catch(done);
    });
    for (let i = 0; i < TEST_NEWS_ITEM_COUNT; ++i) {
        it('Add News Item: ' + i, (done) => {
            let newObjectId;
            agent
                .get('/api/newobject').set('x-auth', JWT)
                .then((res) => newObjectId = res.body)
                .then(() => agent
                .post('/api/newsitems')
                .set('x-auth', JWT)
                .send({
                _id: newObjectId,
                headline: 'headline_' + i,
                body: 'body_' + i
            }))
                .then((res) => {
                res.should.have.status(200);
                done();
            })
                .catch(done);
        });
    }
    it('Delete all the News Items', (done) => {
        let newsItems;
        agent
            .get('/api/newsitems')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            newsItems = res.body;
            chai_assert(res.body.length === TEST_NEWS_ITEM_COUNT, 'Incorrect number of News Items recorded');
            for (let newsItem of newsItems) {
                agent.delete('/api/newsitems/' + newsItem._id).set('x-auth', JWT)
                    .then((res) => res.should.have.status(200))
                    .catch(done);
            }
        })
            .then(() => agent.get('/api/newsitems/count').set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        })
            .catch(done);
    });
    it('Get `newsitems` files', (done) => {
        chai.request(server)
            .get('/api/newsitems/1/files')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        })
            .catch(done);
    });
});
describe('Test Case: `executive`: ', () => {
    it('GET /api/executive', (done) => {
        chai.request(server)
            .get('/api/executive')
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            chai_assert(res.body.length >= 10, 'Test Failure: Too few executive positions');
            done();
        })
            .catch(done);
    });
});
describe('Test Case: Miscellaneous: ', () => {
    it('Read from a nonsense endpoint', (done) => {
        chai.request(server)
            .get('/api/nonsense')
            .then((res) => done('Test Failure: Read of nonsense endpoint succeeded'))
            .catch((res) => {
            res.should.have.status(440);
            done();
        })
            .catch(done);
    });
});
describe('Test Case: Changing Passwords: ', () => {
    let JWT;
    let agent = chai.request.agent(server);
    for (let i = 0; i < TEST_CHANGE_PASSWORDS_COUNT; ++i) {
        it('Login and change passwords: ' + i, function (done) {
            agent
                .post('/api/members/login')
                .send({
                firstname: 'test' + test_member_index,
                emailaddress: 'test' + test_member_index + '@example.com',
                password: passwords[i]
            })
                .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                JWT = res.body.jwt;
            })
                .then(() => agent.post('/api/members/' + JWT + '/change-password').set('x-auth', JWT).send({ password: passwords[i + 1] }))
                .then((res) => {
                res.should.have.status(200);
                done();
            })
                .catch(done);
        });
    }
});
describe('Final Cleanup: ', () => {
    it('Delete all members', function (done) {
        let JWT;
        let agent = chai.request.agent(server);
        let members;
        agent
            .post('/api/members/login')
            .send({
            firstname: 'test' + test_member_index,
            emailaddress: 'test' + test_member_index + '@example.com',
            password: passwords[TEST_CHANGE_PASSWORDS_COUNT]
        })
            .then((res) => {
            res.should.have.status(200);
            res.should.have.cookie('sessionID');
            res.should.be.json;
            JWT = res.body.jwt;
        })
            .then(() => agent.get('/api/members').set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            members = res.body;
            chai_assert(members.length === TEST_MEMBER_COUNT, 'Incorrect number of members returned');
            for (let member of members) {
                agent.delete('/api/members/' + member._id).set('x-auth', JWT)
                    .then((res) => res.should.have.status(200))
                    .catch(done);
            }
        })
            .then(() => agent.get('/api/members').set('x-auth', JWT))
            .then((res) => {
            res.should.have.status(200);
            res.should.be.json;
            chai_assert(res.body.length === 0, 'Test failure: number of members should be 0');
            done();
        })
            .catch(done);
    });
});
