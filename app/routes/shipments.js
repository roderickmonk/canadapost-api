"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return res.status(200).json('Welcome home!');
});
router.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.app.locals.usershipper = {
            shipper: req.path.split('/')[2],
            registrationToken: jwt.decode(req.headers['x-auth'], jwt_secret_1.JWT_SECRET).registrationToken
        };
        if (!cache.has(res.app.locals.usershipper)) {
            yield cache.set(res.app.locals.usershipper);
        }
        next();
    }
    catch (e) {
        errorHandler(e, req, res, next);
    }
}));
router.post('/shipper/:shipperid/rates', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const shipper = yield cache.get(res.app.locals.usershipper);
        res.status(200).json(yield shipper.getRates(req.body));
    }
    catch (e) {
        next(e);
    }
}));
router.post('/shipper/:shipperid/shipment', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const shipper = yield cache.get(res.app.locals.usershipper);
        return res.status(200).json(yield shipper.createShipment(req.body));
    }
    catch (e) {
        next(e);
    }
}));
router.get('/shipper/:shipperid/artifact', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const shipper = yield cache.get(res.app.locals.usershipper);
        res.status(200).send(yield shipper.getArtifact(req.body.artifactLink));
    }
    catch (e) {
        next(e);
    }
}));
router.use(errorHandler);
module.exports = router;
