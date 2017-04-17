
export abstract class Shipper {

	abstract getRates = (params) => { };
	abstract createShipment = (params) => { };
	abstract getLabel = (uri) => { };

	protected authorization;
}