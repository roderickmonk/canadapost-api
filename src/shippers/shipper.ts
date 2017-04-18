
export abstract class Shipper {

	abstract getRates = (params) => { };
	abstract createShipment = (params) => { };
	abstract getArtifact = (uri) => { };

	protected authorization;
}