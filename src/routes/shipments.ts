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

    return res.status(200).json('Welcome home, Machoolian')

});

router.use((req, res, next) => {

    // Take note of the Shipper & Registration Token
    res.app.locals.usershipper = {
        shipper: req.path.split('/')[2],
        registrationToken: jwt.decode(req.headers['x-auth'], JWT_SECRET).registrationToken
    };

    // If the User's Shipper already exists in the cache, then there is nothing more to do
    if (!cache.has(res.app.locals.usershipper)) {

        // Ensure that the User's Shipper is available in the LRU cache
        cache.set(res.app.locals.usershipper)
            .then(next)
            .catch(err => errorHandler(err, req, res, next));
    } else {
        next();
    }
});

router.post('/shipper/:shipperid/rates', (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then use it to getRates
    cache.get(res.app.locals.usershipper)
        .then((shipper: Shipper) => shipper.getRates(req.body))
        .then(rates => res.status(200).json(rates))
        .catch(next);
});

router.post('/shipper/:shipperid/shipment', (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then create the new shipment
    cache.get(res.app.locals.usershipper)
        .then((shipper: Shipper) => shipper.createShipment(req.body))
        .then(shipment => res.status(200).json(shipment))
        .catch(next);
});

router.get('/shipper/:shipperid/artifact', (req, res, next) => {

    // Retrieve the label artifact from the shipper
    cache.get(res.app.locals.usershipper)
        .then((shipper: Shipper) => shipper.getArtifact(req.body.artifactLink))
        .then(artifact => res.status(200).send(artifact))
        .catch(next);
});

router.use(errorHandler);

module.exports = router;