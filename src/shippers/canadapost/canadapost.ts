import { XML } from './XML';
import * as request from 'request-promise';
import * as moment from 'moment';
import * as builder from 'xmlbuilder';
import { pd as beautifier } from 'pretty-data';
import * as xml2js from 'xml2js-es6-promise';
import { Shipper } from '../shipper';

export class CanadaPost extends Shipper {

	private customerNumber: string;
	private endpoint = 'https://ct.soa-gw.canadapost.ca';

	constructor(credentials) {

		super();
		this.customerNumber = credentials.customerNumber;
		this.authorization = 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64');
	}

	// The following static routine mocks the retrieving of credentials from the Shipper
	// Note that the registrationToken is completely ignored
	public static getCredentials = (registrationToken) => Promise.resolve({
		username: '48c261ecfa014827',
		password: '755950ccfb77980ff41e14',
		customerNumber: '0008545231'
	});

	public getRates = (params) =>

		XML.getRatesBody(this.customerNumber, params)
			.then(body => request.post({
				uri: this.endpoint + '/rs/ship/price',
				headers: {
					'Authorization': this.authorization,
					'Content-Type': 'application/vnd.cpc.ship.rate-v3+xml',
					'Accept': 'application/vnd.cpc.ship.rate-v3+xml'
				},
				body
			}))
			.then(xml2js);

	public createShipment = (params) =>

		XML.createNonContractShipmentBody(params)
			.then(body => request.post({
				uri: `${this.endpoint}/rs/${this.customerNumber}/ncshipment`,
				headers: {
					'Accept': 'application/vnd.cpc.ncshipment-v4+xml',
					'Content-Type': 'application/vnd.cpc.ncshipment-v4+xml',
					'Authorization': this.authorization
				},
				body
			}))
			.then(xml2js);

	public getArtifact = (uri) => request.get({ uri, headers: { 'Accept': 'application/pdf', 'Authorization': this.authorization } });

}