import * as _ from 'lodash';
import * as express from 'express';
import { Shipper } from '../shippers/shipper';
import * as jwt from 'jwt-simple';
import { ApiError } from '../api-error';
import { UserShipperCache } from '../lru-cache';
import { JWT_SECRET } from '../jwt-secret';

const router = express.Router();

const cache = new UserShipperCache;

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.code).send(err.message);
    } else if (err instanceof Error) {
        res.status(500).send(err.message);
    } else {
        res.status(500).send(err);
    }
}

router.get('/', (req, res) => {

    return res.status(200).json('Welcome home!');
});

router.use(async (req, res, next) => {

    try {
        // Take note of the Shipper & Registration Token
        res.app.locals.usershipper = {
            shipper: req.path.split('/')[2],
            registrationToken: jwt.decode(req.headers['x-auth'], JWT_SECRET).registrationToken
        };

        // If the User's Shipper already exists in the cache, then there is nothing more to do
        if (!cache.has(res.app.locals.usershipper)) {

            // Ensure that the User's Shipper is available in the LRU cache
            await cache.set(res.app.locals.usershipper);

        }

        next();

    } catch (e) {
        errorHandler(e, req, res, next);
    }
});

router.post('/shipper/:shipperid/rates', async (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then use it to getRates
    try {
        const shipper = await cache.get(res.app.locals.usershipper);
        res.status(200).json(await shipper.getRates(req.body));
    } catch (e) {
        next(e);
    }
});

router.post('/shipper/:shipperid/shipment', async (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then create the new shipment
    try {
        const shipper = await cache.get(res.app.locals.usershipper);
        return res.status(200).json(await shipper.createShipment(req.body));
    } catch (e) {
        next(e);
    }
});

router.get('/shipper/:shipperid/artifact', async (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then get the artifact
    try {
        const shipper = await cache.get(res.app.locals.usershipper);
        res.status(200).send(await shipper.getArtifact(req.body.artifactLink));
    } catch (e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;