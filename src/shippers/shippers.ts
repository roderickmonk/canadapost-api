import { CanadaPost } from './canadapost/canadapost';
import { Fedex } from './fedex/fedex';
import { UPS } from './ups/ups';

export const Shippers = {
	canadapost: CanadaPost,
	fedex: Fedex,
	ups: UPS
};
