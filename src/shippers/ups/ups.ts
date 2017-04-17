import { CanadaPost } from '../canadapost/canadapost';

export class UPS extends CanadaPost {
	constructor(credentials) {
		super(credentials);
	}
}
