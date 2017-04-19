"use strict";
const api_error_1 = require("../../api-error");
class XML {
    constructor() { }
}
XML.createNonContractShipmentBody = (params) => new Promise((resolve, reject) => {
    try {
        resolve(`<?xml version="1.0" encoding="utf-8"?>
<non-contract-shipment xmlns="http://www.canadapost.ca/ws/ncshipment-v4">
  <requested-shipping-point>${params['non-contract-shipment']['requested-shipping-point']}</requested-shipping-point>
  <delivery-spec>
    <service-code>${params['non-contract-shipment']['delivery-spec']['service-code']}</service-code>
    <sender>
      <company>${params['non-contract-shipment']['delivery-spec']['sender']['company']}</company>
      <contact-phone>${params['non-contract-shipment']['delivery-spec']['sender']['contact-phone']}</contact-phone>
      <address-details>
        <address-line-1>${params['non-contract-shipment']['delivery-spec']['sender']['address-details']['address-line-1']}</address-line-1>
        <city>${params['non-contract-shipment']['delivery-spec']['sender']['address-details']['city']}</city>
        <prov-state>${params['non-contract-shipment']['delivery-spec']['sender']['address-details']['prov-state']}</prov-state>
        <postal-zip-code>${params['non-contract-shipment']['delivery-spec']['sender']['address-details']['postal-zip-code']}</postal-zip-code>
      </address-details>
    </sender>
    <destination>
      <name>${params['non-contract-shipment']['delivery-spec']['destination']['name']}</name>
      <company>${params['non-contract-shipment']['delivery-spec']['destination']['company']}</company>
      <address-details>
        <address-line-1>${params['non-contract-shipment']['delivery-spec']['destination']['address-details']['address-line-1']}</address-line-1>
        <city>${params['non-contract-shipment']['delivery-spec']['destination']['address-details']['city']}</city>
        <prov-state>${params['non-contract-shipment']['delivery-spec']['destination']['address-details']['prov-state']}</prov-state>
        <country-code>${params['non-contract-shipment']['delivery-spec']['destination']['address-details']['country-code']}</country-code>
        <postal-zip-code>${params['non-contract-shipment']['delivery-spec']['destination']['address-details']['postal-zip-code']}</postal-zip-code>
      </address-details>
    </destination>
    <options>
      <option>
        <option-code>${params['non-contract-shipment']['delivery-spec']['options']['option']['option-code']}</option-code>
      </option>
    </options>
    <parcel-characteristics>
      <weight>${params['non-contract-shipment']['delivery-spec']['parcel-characteristics']['weight']}</weight>
      <dimensions>
        <length>${params['non-contract-shipment']['delivery-spec']['parcel-characteristics']['dimensions']['length']}</length>
        <width>${params['non-contract-shipment']['delivery-spec']['parcel-characteristics']['dimensions']['width']}</width>
        <height>${params['non-contract-shipment']['delivery-spec']['parcel-characteristics']['dimensions']['height']}</height>
      </dimensions>
    </parcel-characteristics>
    <preferences>
      <show-packing-instructions>
          ${params['non-contract-shipment']['delivery-spec']['preferences']['show-packing-instructions']}</show-packing-instructions>
    </preferences>
  </delivery-spec>
</non-contract-shipment>`);
    }
    catch (e) {
        reject(new api_error_1.ApiError('Invalid HTTP body', 400));
    }
});
XML.getRatesBody = (customerNo, params) => new Promise((resolve, reject) => {
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
