"use strict";
const express = require("express");
const jwt = require("jwt-simple");
const api_error_1 = require("../api-error");
const lru_cache_1 = require("../lru-cache");
const jwt_secret_1 = require("../jwt-secret");
const router = express.Router();
const cache = new lru_cache_1.UserShipperCache;
const errorHandler = (err, req, res, next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.code).send(err.message);
    }
    else if (err instanceof Error) {
        res.status(500).send(err.message);
    }
    else {
        res.status(500).send(err);
    }
};
router.get('/', (req, res) => {
    return res.status(200).json('Welcome home, Machoolian');
});
router.use((req, res, next) => {
    res.app.locals.usershipper = {
        shipper: req.path.split('/')[2],
        registrationToken: jwt.decode(req.headers['x-auth'], jwt_secret_1.JWT_SECRET).registrationToken
    };
    if (!cache.has(res.app.locals.usershipper)) {
        cache.set(res.app.locals.usershipper)
            .then(next)
            .catch(err => errorHandler(err, req, res, next));
    }
    else {
        next();
    }
});
router.post('/shipper/:shipperid/rates', (req, res, next) => {
    cache.get(res.app.locals.usershipper)
        .then((shipper) => shipper.getRates(req.body))
        .then(rates => res.status(200).json(rates))
        .catch(next);
});
router.post('/shipper/:shipperid/shipment', (req, res, next) => {
    cache.get(res.app.locals.usershipper)
        .then((shipper) => shipper.createShipment(req.body))
        .then(shipment => res.status(200).json(shipment))
        .catch(next);
});
router.get('/shipper/:shipperid/artifact', (req, res, next) => {
    cache.get(res.app.locals.usershipper)
        .then((shipper) => shipper.getArtifact(req.body.artifactLink))
        .then(artifact => res.status(200).send(artifact))
        .catch(next);
});
router.use(errorHandler);
module.exports = router;
