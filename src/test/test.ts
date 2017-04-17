
import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
//let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();
let expect = chai.expect;
let chai_assert = require('chai').assert;

chai.use(chaiHttp);

describe('Test Case', () => {

	it('getRates', (done: any) => {
		chai.request(server)
			.post('/shipper/canadapost/rates')
			.send({
				weight: 1,
				'origin-postal-code': 'V3Z4R3',
				'postal-code': 'V4M1P4'
			})
			.then((res: any) => {
				res.should.have.status(200);
				done();
			})
			.catch(done);
	});
});

const testCreateNonContractShipment = {
	"non-contract-shipment": {
		"requested-shipping-point": "V3Z4R3",
		"delivery-spec": {
			"service-code": "DOM.EP",
			sender:
			{
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
			options: [
				{
					option: {
						"option-code": "DC"
					}
				}
			],
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
}