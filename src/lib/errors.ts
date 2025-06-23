export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(message: string, statusCode = 500, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string, statusCode = 500) {
		super(message, statusCode);
	}
}

export class ApiError extends AppError {
	constructor(message: string, statusCode = 400) {
		super(message, statusCode);
	}
}

export class GitHubApiError extends AppError {
	constructor(message: string, statusCode = 500) {
		super(message, statusCode);
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class AuthenticationError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}
