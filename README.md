# Canada Post API
This repository forms part of a wider professional software engineering portfolio maintained by Rod Monk.  Here demonstration code is provided that exercises Canada Post's development API. The following end points are exercised: [Get Rates](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/rating/getrates/default.jsf), [Create NonContract Shipment](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/onestepshipping/createshipment.jsf), and [Get Artifact](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/shippingmanifest/shipmentartifact.jsf).  You can find more about the [Canada Post API here](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/onestepshipping/default.jsf). 

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
The demo software does not refer to the concept of a <b>User</b>, it does, however, embody the concept of <b>Credential Tokens</b>.  These tokens are used to retrieve from Canada Post the unique full set of credentials (username, password, and contract number) which are required to exploit the services of the Canada Post API.  Management of these Credential Tokens are assumed to be managed by other software.

Clearly, the secure delivery of these Credential Tokens is important.  For this reason, these tokens are delivered via JWT and then decoded by endpoint processing (which requires knowledge of a 'JWT Secret').

### Least Recently Used Cache
The demo software assumes that if a User is active, then they will continue to be active for some time.  Hence, rather than continually poll the Canada Post API for the full set of credentials, these credentials are maintained in a local cache and purged from the cache in a LRU manner.  The npm component <b>lru-cache</br> provides this service.

### Fedex / UPS
The Canada Post API is the prime focus, however, in order to provide a measure of realism, two further Shippers are also 'supported'.  However, both the Fedex and UPS APIs are spoofs in that both are derived from the Canada Post class.

### Database
This demonstration software is not exploting the services of a database.

# Test
Test code has been provided and can be run as follows.  After cloning the project to a home directory, it can be tested as follows:
```bash
cd canadapost-api
npm install
cd app
mocha
```



# File Structure</h4>

```
ttc-website-ng2/
├── app/                                * Where our client-side application code is stored
│   ├── main.ts                         * From where Angular2 bootstraps the applicaton
│   └── app.component.ts                * The top-level application code (called from main.ts)
│     
│   ├── services/                       * Angular2 services
│   │   ├── document.service.ts         * Provides the http services to the server concerning all things Documents
│   │   ├── executive.service.ts        * Provides the http services providing details about the club executive
│   │   ├── member.service.ts           * Provides the http services to the server concerning all things Members
│   │   ├── newsitem.service.ts         * Provides the http services to the server concerning all things News Items
│   │   ├── observable.service.ts       * A base class that provides a common set of services that use the RxJS library
│   │   ├── platform.service.ts         * Provides services to capture the client software platform that a User is running
│   │   ├── normalization.service.ts    * Provides services to capture the client software platform that a User is running
│   │   ├── user.service.ts             * Provides services to capture the client software platform that a User is running
│   │   └── valdiation.service.ts       * Provides a number of common form validation services
|   | 
│   ├── models/                         * Various data models
│   │   ├── member.ts                   * A member structure
│   │   ├── newsitem.ts                 * A newsitem structure
│   │   └── renewal.ts                  * A renewal structure (members 'renew' each year)
|   | 
│   ├── about-us/                       * The About Us screen
│   ├── base-editor/                    * Base Editor from which other editors are derived
│   ├── calendar/                       * The Calendar screen
│   ├── change-password/                * The modal that allows a member to change their password
│   ├── communications-consent/         * A modal to display the comunications agreement that all members must agree to
│   ├── confirm-delete/                 * A general Confirm Delete modal
│   ├── contact-us/                     * The Contact Us screen
│   ├── document-manager/               * The Document Manager screen (allows to both add and view club documents)
│   ├── fee-configuration/              * The Fee Configuration screen (useful to the Treasurer and Admin personnel)
│   ├── fee-manager/                    * The Fee Manager screen (mostly for use by the Treasurer)
│   ├── home/                           * The Home screen
│   ├── join/                           * The Join modal which allows othersiders to apply to join the club
│   ├── login/                          * The Login modal
│   ├── liability-agreement/            * A modal to display the liability agreement that all members must agree to
│   ├── logout/                         * The Logout modal
│   ├── message/                        * A general modal for displaying messages
│   ├── mission-and-values/             * The Mission & Values modal
│   ├── newsitem/                       * The News Item screen (displays News Items)
│   ├── newsitem-manager/               * The News Item Manager modal (News Items are published here)
│   ├── online-help/                    * The Online Help screen
│   ├── personal-profile/               * The Personal Profile modal
│   ├── renew-membership/               * The Renew Membership modal
│   └── search-membership/              * The Search Membership screen
│   
├── Assets/                             * various project assets
│   └── images/                         * Project images
│
├── build/                              * Webpack distribution output files
│   ├── ttc-bundle.js                   * Application webpack
│   └── vendor.js                       * Vendors webpack
│     
├── favicon.ico                         * Project favicon
│
├── Server/                             * NodeJS source code
│   ├── BugTracker.ts                 	* Automatic issue tracking to FogBugz
│   ├── DB.ts                        	* CRUD operations to / from MongoDB (except for blobs - see GridFS.ts for that)
│   ├── Err.ts                        	* Some error classes
│   ├── Gmail.ts                     	* Retrieves historical eBlasts from gmail (ToDo: newsletter email address has changed)
│   ├── GridFS.ts                    	* Stores / retrieves files from MongoDB / GridFS
│   ├── MailChimp.ts                 	* Update MailChimp with email addresses
│   ├── Role.ts                 		* Role-based access control (RBAC) configuration
│   ├── Rankings.ts                 	* Supports a Web Service to get pro tennis rankings every few hours
│   ├── SendEmail.ts                 	* Uses MailGun to send emails for password resets, etc.
│   ├── Server.ts                       * The main server source file (contains the Express setup)
│   ├── SocketIo.ts                     * Implements the application usage of socketio (supports reset password)
│   │
│   └── test/                           * Server test folder
│       └── test-server.ts              * A test script to test NodeJS / Express (ToDo: about 200 Test Cases, but more are needed)
│   
├── index.html                          * HTML entry point
├── package.json                        * JavaScript dependencies
├── README.md                           * This file
├── tsconfig.json                       * Configures the TypeScript compiler
├── tslint.json                         * Configures our TypeScript linter 
├── typings/                            * Managed typings
└── webpack.config.js                   * webpack configuration file
```

<h4>ToDo List</h4>
<ul>
<li>Export to TennisBC</li>
<li>Resurrect Historical eBlasts (to work off the newsletter email address)</li>
<li>Improve presentation of news items</li>
<li>Restore a Coaching page</li>
<li>Provide user level documention</li>
<li>Provide technical documentation</li>
<li>Provide chat room features</li>
<li>Provide a new screen to display the club's league teams
</ul>
