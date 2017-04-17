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
    console.log(requiredProperties.sort());
    console.log(Object.keys(params).sort());
    if (requiredProperties.sort().join(',') === Object.keys(params).sort().join(',')) {
        console.log('arrs are equal');
    }
    else {
        reject(new api_error_1.ApiError('Invalid HTTP body'));
    }
    resolve(`<?xml version="1.0" encoding="utf-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v3">
  <customer-number>0008545231</customer-number>
  <parcel-characteristics>
    <weight>1</weight>
  </parcel-characteristics>
  <origin-postal-code>K2B8J6</origin-postal-code>
  <destination>
    <domestic>
      <postal-code>J0E1X0</postal-code>
    </domestic>
  </destination>
</mailing-scenario>`);
});
exports.XML = XML;
