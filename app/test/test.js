"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jwt-simple");
const jwt_secret_1 = require("../jwt-secret");
let server = require('../app.js');
let should = chai.should();
let expect = chai.expect;
let chai_assert = require('chai').assert;
chai.use(chaiHttp);
const randomInteger = () => Math.floor(100000000 * Math.random());
describe('Test Case', () => {
    it('getRates', () => new Promise((resolve, reject) => chai.request(server)
        .post('/shipper/canadapost/rates')
        .set('x-auth', jwt.encode({ registrationToken: randomInteger() }, jwt_secret_1.JWT_SECRET))
        .send({
        weight: 1,
        'origin-postal-code': 'V3Z4R3',
        'postal-code': 'V4M1P4'
    })
        .then(res => { res.should.have.status(200); resolve(); })
        .catch(reject)));
    let artifactLink;
    it('createNonContractShipment', () => new Promise((resolve, reject) => chai.request(server)
        .post('/shipper/canadapost/shipment')
        .set('x-auth', jwt.encode({ registrationToken: randomInteger() }, jwt_secret_1.JWT_SECRET))
        .send(testCreateNonContractShipment)
        .then(res => {
        res.should.have.status(200);
        artifactLink = res.body['non-contract-shipment-info']['links'][0]['link'].find(link => link['$'].rel == 'label')['$'].href;
        resolve();
    })
        .catch(reject)));
    it('getArtifact', () => new Promise((resolve, reject) => chai.request(server)
        .get('/shipper/canadapost/artifact')
        .set('x-auth', jwt.encode({ registrationToken: randomInteger() }, jwt_secret_1.JWT_SECRET))
        .send({ artifactLink })
        .then(res => { res.should.have.status(200); resolve(); })
        .catch(reject)));
});
const testCreateNonContractShipment = {
    "non-contract-shipment": {
        "requested-shipping-point": "V3Z4R3",
        "delivery-spec": {
            "service-code": "DOM.EP",
            sender: {
                company: "Canada Post Corporation",
                "contact-phone": "555-555-5555",
                "address-details": {
                    "address-line-1": "2701 Riverside Drive",
                    city: "Ottawa",
                    "prov-state": "ON",
                    "postal-zip-code": "K1A0B1"
                }
            },
            destination: {
                name: "John Doe",
                company: "Consumer",
                "address-details": {
                    "address-line-1": "2701 Receiver Drive",
                    city: "Ottawa",
                    "prov-state": "ON",
                    "country-code": "CA",
                    "postal-zip-code": "K1A0B1"
                }
            },
            options: {
                option: {
                    "option-code": "DC"
                }
            },
            "parcel-characteristics": {
                weight: 15,
                dimensions: {
                    length: 1,
                    width: 1,
                    height: 1
                }
            },
            preferences: {
                "show-packing-instructions": true
            }
        }
    }
};
