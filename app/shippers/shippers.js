"use strict";
const canadapost_1 = require("./canadapost/canadapost");
const fedex_1 = require("./fedex/fedex");
const ups_1 = require("./ups/ups");
exports.Shippers = {
    canadapost: canadapost_1.CanadaPost,
    fedex: fedex_1.Fedex,
    ups: ups_1.UPS
};
