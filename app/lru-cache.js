"use strict";
const cache = require("lru-cache");
const _ = require("lodash");
const shippers_1 = require("./shippers/shippers");
const api_error_1 = require("./api-error");
class UserShipperCache {
    constructor() {
        this.lru = new cache;
        this.set = (userShipper) => new Promise((resolve, reject) => {
            if (shippers_1.Shippers.hasOwnProperty(userShipper.shipper)) {
                shippers_1.Shippers[userShipper.shipper].getCredentials(userShipper.registrationToken)
                    .then(credentials => {
                    this.lru.set(userShipper, new shippers_1.Shippers[userShipper.shipper](credentials));
                    resolve();
                });
            }
            else {
                reject(new api_error_1.ApiError('Unknown Shipper', 400));
            }
        });
        this.get = (userShipper) => new Promise((resolve, reject) => {
            const shipper = this.lru.get(userShipper);
            if (_.isUndefined(shipper)) {
                reject(new api_error_1.ApiError('Cache entry unavailable'));
            }
            else {
                resolve(shipper);
            }
        });
        this.has = (userShipper) => this.lru.has(userShipper);
    }
}
exports.UserShipperCache = UserShipperCache;
