import * as _ from 'lodash';
import * as express from 'express';
import { Shipper } from '../shippers/shipper';
import * as jwt from 'jwt-simple';
import { ApiError } from '../api-error';
import { UserShipperCache } from '../lru-cache';
import { JWT_SECRET } from '../jwt-secret';
import * as co from 'co';

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
    co(function* () {
        const shipper = yield cache.get(res.app.locals.usershipper);
        res.status(200).json(yield shipper.getRates(req.body));
    })
        .catch(next);
});

router.post('/shipper/:shipperid/shipment', (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then create the new shipment
    co(function* () {
        const shipper = yield cache.get(res.app.locals.usershipper);
        res.status(200).json(yield shipper.createShipment(req.body));
    })
        .catch(next);
});

router.get('/shipper/:shipperid/artifact', (req, res, next) => {

    // Retrieve the User's Shipper from the LRU cache and then get the artifact
    co(function* () {
        const shipper = yield cache.get(res.app.locals.usershipper);
        res.status(200).send(yield shipper.getArtifact(req.body.artifactLink))
    })
        .catch(next);
});

router.use(errorHandler);

module.exports = router;