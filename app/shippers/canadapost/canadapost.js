"use strict";
const XML_1 = require("./XML");
const request = require("request-promise");
const xml2js = require("xml2js-es6-promise");
const shipper_1 = require("../shipper");
class CanadaPost extends shipper_1.Shipper {
    constructor(credentials) {
        super();
        this.endpoint = 'https://ct.soa-gw.canadapost.ca';
        this.getRates = (params) => XML_1.XML.getRatesBody(this.customerNumber, params)
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
        this.createShipment = (params) => XML_1.XML.createNonContractShipmentBody(params)
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
        this.getArtifact = (uri) => request.get({ uri, headers: { 'Accept': 'application/pdf', 'Authorization': this.authorization } });
        this.customerNumber = credentials.customerNumber;
        this.authorization = 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64');
    }
}
CanadaPost.getCredentials = (registrationToken) => Promise.resolve({
    username: '48c261ecfa014827',
    password: '755950ccfb77980ff41e14',
    customerNumber: '0008545231'
});
exports.CanadaPost = CanadaPost;
