# Canada Post API
This repository forms part of a wider professional software engineering portfolio maintained by Rod Monk.  Here demonstration code is provided that exercises Canada Post's development API. The following end points are exercised: [Get Rates](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/rating/getrates/default.jsf), [Create Non-Contract Shipment](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/onestepshipping/createshipment.jsf), and [Get Artifact](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/shippingmanifest/shipmentartifact.jsf).  You can find more about the [Canada Post API here](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/onestepshipping/default.jsf). 

## Technologies
<ol>
<li>NodeJS</li>
<li>ExpressJS</li>
<li>Typescript</li>
<li>JSON Web Tokens (JWT)</li>
<li>Mocha</li>
<li>A Least Recently Used component to manage active shipping objects</li>
</ol>

## Theory of Operation

### JWT Tokens
This demonstration software does not have a concept of a <b>User</b>.  However, it does embody the concept of <b>Credential Tokens</b>.  Such tokens are used to retrieve from Canada Post the full set of unique credentials (username, password, and contract number) which are required to exploit the services of the API.

Clearly, the secure delivery of these Credential Tokens is critical.  For this reason, these tokens are delivered via JWT and then decoded by endpoint processing (which requires knowledge of a 'JWT Secret').

### Least Recently Used Cache
The demo software assumes that if a User is active, then they will continue to be active for some time.  Hence, rather than continually polling the Canada Post API for the full set of credentials on each API request, these credentials are maintained in a local cache and purged from the cache in a LRU manner.  The npm component [lru-cache](https://www.npmjs.com/package/lru-cache) provides this service.

### Fedex / UPS
The Canada Post API is the prime focus, however, in order to provide a measure of realism, two further Shippers are also 'supported'.  However, both the Fedex and UPS APIs are spoofs in that both are derived from the Canada Post class.

### Database
This demonstration software is not exploting the services of a database.

## Adding Shippers
The software is designed to require minimum effort to extend the suite of Shipper APIs.  Adding a further Shipper requires only the following:
<ul>
<li>Add the new shipper class to the src/shippers/ folder; the new shipper class must be derived from the Shipper class (which can be found in the source file shipper.ts).</li>
<li>Include the new Shipper in the Shipper Id to Shipper class object map, located in the file src/shippers/shippers.ts.</li>
</ul>

## Testing
It is assumed that both NodeJS and Typescript are already installed.  After cloning the project, it can be tested as follows:
```bash
cd canadapost-api
npm install
tsc  # Transpile the source code
mocha app/test
```
## File Structure
```
canadapost-api/
├── app/                                * Typescript output area
│
├── src/                                * Typescript source code
│   ├── routes/                         * ExpressJS routing
│   │    └── shipments.ts               * API reception
│   │
│   ├── shippers/                       * ExpressJS routing
│   │    ├── shipper.ts                 * Base class from which all Shippers are derived
│   │    │
│   │    ├── shippers.ts                * Object map from Shipper Id to Shipper class name
│   │    │
│   │    ├── canadapost/                * Canada Post
│   │    │    ├── canadapost.ts         * Canada Post API code
│   │    │    └── XML.ts                * XML template literals
│   │    │
│   │    ├── fedex/                     * Fedex API
│   │    │    └── fedex.ts              * Spoof code: simply derived from the Canada Post class
│   │    │
│   │    └── ups/                       * UPS API
│   │         └── ups.ts                * Spoof code: simply derived from the Canada Post class
│   │
│   ├── app.ts                          * API executive
│   ├── api-error.ts                    * Class ApiError
│   ├── interfaces.ts                   * Typescript interfaces
│   ├── lru-cache.ts                    * Manages the onboard Shipper objects and will retrieve new credentials if required.
│   │
│   └── test/                           * Test code folder
│       └── test.ts                     * Test code to exercise the API
│   
├── package.json                        * Project dependencies
├── README.md                           * This file
├── tsconfig.json                       * Configures the TypeScript compiler
```
