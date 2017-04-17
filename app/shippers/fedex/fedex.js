"use strict";
const canadapost_1 = require("../canadapost/canadapost");
class Fedex extends canadapost_1.CanadaPost {
    constructor(credentials) {
        super(credentials);
    }
}
exports.Fedex = Fedex;
