import { XML } from './XML';
import * as request from 'request-promise';
import * as moment from 'moment';
import { pd as beautifier } from 'pretty-data';
import * as xml2js from 'xml2js-es6-promise';
import { Shipper } from '../shipper';
import * as co from 'co';

export class CanadaPost extends Shipper {

	private customerNumber: string;
	private endpoint = 'https://ct.soa-gw.canadapost.ca';

	constructor({username, password, customerNumber}) {

		super();
		this.customerNumber = customerNumber;
		this.authorization = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	}

	// The following static routine mocks the retrieving of credentials from the Shipper
	// Note that registrationToken is ignored
	public static getCredentials = (registrationToken) => Promise.resolve({
		username: '48c261ecfa014827',
		password: '755950ccfb77980ff41e14',
		customerNumber: '0008545231'
	});

	public getRates = co.wrap(function* (params) {

		return yield request.post({
			uri: this.endpoint + '/rs/ship/price',
			headers: {
				'Authorization': this.authorization,
				'Content-Type': 'application/vnd.cpc.ship.rate-v3+xml',
				'Accept': 'application/vnd.cpc.ship.rate-v3+xml'
			},
			body: yield XML.getRatesBody(this.customerNumber, params)
		}).then(xml2js);
	})

	public createShipment = co.wrap(function* (params) {

		return yield request.post({
			uri: `${this.endpoint}/rs/${this.customerNumber}/ncshipment`,
			headers: {
				'Accept': 'application/vnd.cpc.ncshipment-v4+xml',
				'Content-Type': 'application/vnd.cpc.ncshipment-v4+xml',
				'Authorization': this.authorization
			},
			body: yield XML.createNonContractShipmentBody(params)
		}).then(xml2js);
	})

	public getArtifact = co.wrap(function* (uri) {
		return yield request.get({ uri, headers: { 'Accept': 'application/pdf', 'Authorization': this.authorization } });
	});

}