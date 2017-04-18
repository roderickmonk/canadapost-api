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
The demo software does not refer to the concept of a <b>User</b>.  However, it does embody the concept of <b>Credential Tokens</b>.  These tokens are used to retrieve from Canada Post the unique full set of credentials (username, password, and contract number) which are required to exploit the services of the Canada Post API.  Management of these Credential Tokens are assumed to be managed by other software.

Clearly, the secure delivery of these Credential Tokens is important.  For this reason, these tokens are delivered via JWT and then decoded by endpoint processing (which requires knowledge of a 'JWT Secret').

### Least Recently Used Cache
The demo software assumes that if a User is active, then they will continue to be active for some time.  Hence, rather than continually poll the Canada Post API for the full set of credentials, these credentials are maintained in a local cache and purged from the cache in a LRU manner.  The npm component <b>lru-cache</b> provides this service.

### Fedex / UPS
The Canada Post API is the prime focus, however, in order to provide a measure of realism, two further Shippers are also 'supported'.  However, both the Fedex and UPS APIs are spoofs in that both are derived from the Canada Post class.

### Database
This demonstration software is not exploting the services of a database.

## Testing
It is assumed at the outset that both NodeJS and Typescript are already installed.  After cloning the project, it can be tested as follows:
```bash
cd canadapost-api
npm install
tsc  # Transpile the source code
cd app
mocha
```
## File Structure
```
canadapost-api/
├── app/                                * Typescript output area
│
├── src/                                * Typescript source code
│   ├── routes/                         * ExpressJS routing
│   │    └──test.ts                     * Test code to exercise the API
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
│   ├── api-error.ts                    * Class ApiError
│   ├── interfaces.ts                   * Typescript interfaces
│   ├── lru-cache.ts                    * Manages the onboard Shipper objects and will retrieve new credentials if required.
│   │
│   └── test/                           * Server test folder
│       └──test.ts                      * Test code to exercise the API
│   
├── package.json                        * JavaScript dependencies
├── README.md                           * This file
├── tsconfig.json                       * Configures the TypeScript compiler
```
