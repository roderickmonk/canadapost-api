export class ApiError extends Error {

	public message: string;
	public code: number;

	constructor (message, code=503) {
		super();
		this.message = message;
		this.code = code;
	}
}
