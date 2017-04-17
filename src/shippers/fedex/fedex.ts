import { CanadaPost } from '../canadapost/canadapost';

export class Fedex extends CanadaPost {
	constructor(credentials) {
		super(credentials);
	}
}