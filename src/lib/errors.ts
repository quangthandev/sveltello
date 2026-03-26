export class AppError extends Error {
	constructor(
		message: string,
		public code: string,
		public status: number = 500
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class AuthError extends AppError {
	constructor(message: string, code: string, status = 400) {
		super(message, code, status);
	}
}

export class EmailAlreadyExistsError extends AuthError {
	constructor() {
		super('An account with this email already exists.', 'EMAIL_ALREADY_EXISTS', 400);
	}
}

export class InvalidCredentialsError extends AuthError {
	constructor() {
		super('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
	}
}
