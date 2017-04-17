"use strict";
const canadapost_1 = require("../canadapost/canadapost");
class UPS extends canadapost_1.CanadaPost {
    constructor(credentials) {
        super(credentials);
    }
}
exports.UPS = UPS;
