"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const XML_1 = require("./XML");
const request = require("request-promise");
const xml2js = require("xml2js-es6-promise");
const shipper_1 = require("../shipper");
class CanadaPost extends shipper_1.Shipper {
    constructor({ username, password, customerNumber }) {
        super();
        this.endpoint = 'https://ct.soa-gw.canadapost.ca';
        this.getRates = (params) => __awaiter(this, void 0, void 0, function* () {
            return yield request.post({
                uri: this.endpoint + '/rs/ship/price',
                headers: {
                    'Authorization': this.authorization,
                    'Content-Type': 'application/vnd.cpc.ship.rate-v3+xml',
                    'Accept': 'application/vnd.cpc.ship.rate-v3+xml'
                },
                body: XML_1.XML.getRatesBody(this.customerNumber, params)
            }).then(xml2js);
        });
        this.createShipment = (params) => __awaiter(this, void 0, void 0, function* () {
            return yield request.post({
                uri: `${this.endpoint}/rs/${this.customerNumber}/ncshipment`,
                headers: {
                    'Accept': 'application/vnd.cpc.ncshipment-v4+xml',
                    'Content-Type': 'application/vnd.cpc.ncshipment-v4+xml',
                    'Authorization': this.authorization
                },
                body: XML_1.XML.createNonContractShipmentBody(params)
            }).then(xml2js);
        });
        this.getArtifact = (uri) => __awaiter(this, void 0, void 0, function* () { return yield request.get({ uri, headers: { 'Accept': 'application/pdf', 'Authorization': this.authorization } }); });
        this.customerNumber = customerNumber;
        this.authorization = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    }
}
CanadaPost.getCredentials = (registrationToken) => Promise.resolve({
    username: '48c261ecfa014827',
    password: '755950ccfb77980ff41e14',
    customerNumber: '0008545231'
});
exports.CanadaPost = CanadaPost;
