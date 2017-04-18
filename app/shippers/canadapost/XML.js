"use strict";
const api_error_1 = require("../../api-error");
class XML {
    constructor() { }
}
XML.createNonContractShipment = (params) => new Promise((resolve, reject) => {
    resolve(`<?xml version="1.0" encoding="utf-8"?>
<non-contract-shipment xmlns="http://www.canadapost.ca/ws/ncshipment-v4">
  <requested-shipping-point>V3Z4R3</requested-shipping-point>
  <delivery-spec>
    <service-code>DOM.EP</service-code>
    <sender>
      <company>Canada Post Corporation</company>
      <contact-phone>555-555-5555</contact-phone>
      <address-details>
        <address-line-1>2701 Riverside Drive</address-line-1>
        <city>Ottawa</city>
        <prov-state>ON</prov-state>
        <postal-zip-code>K1A0B1</postal-zip-code>
      </address-details>
    </sender>
    <destination>
      <name>John Doe</name>
      <company>Consumer</company>
      <address-details>
        <address-line-1>2701 Receiver Drive</address-line-1>
        <city>Ottawa</city>
        <prov-state>ON</prov-state>
        <country-code>CA</country-code>
        <postal-zip-code>K1A0B1</postal-zip-code>
      </address-details>
    </destination>
    <options>
      <option>
        <option-code>DC</option-code>
      </option>
    </options>
    <parcel-characteristics>
      <weight>15</weight>
      <dimensions>
        <length>1</length>
        <width>1</width>
        <height>1</height>
      </dimensions>
    </parcel-characteristics>
    <preferences>
      <show-packing-instructions>true</show-packing-instructions>
    </preferences>
  </delivery-spec>
</non-contract-shipment>`);
});
XML.getRates = (customerNo, params) => new Promise((resolve, reject) => {
    const requiredProperties = ['weight', 'origin-postal-code', 'postal-code'];
    if (requiredProperties.sort().join(',') !== Object.keys(params).sort().join(',')) {
        reject(new api_error_1.ApiError('Invalid HTTP body', 400));
    }
    else {
        resolve(`<?xml version="1.0" encoding="utf-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v3">
  <customer-number>${customerNo}</customer-number>
  <parcel-characteristics>
    <weight>${params.weight}</weight>
  </parcel-characteristics>
  <origin-postal-code>${params['origin-postal-code']}</origin-postal-code>
  <destination>
    <domestic>
      <postal-code>${params['origin-postal-code']}</postal-code>
    </domestic>
  </destination>
</mailing-scenario>`);
    }
});
exports.XML = XML;
