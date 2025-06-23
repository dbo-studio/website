export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

class Logger {
	private level: LogLevel;

	constructor() {
		this.level =
			process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;
	}

	private formatMessage(
		level: string,
		message: string,
		data?: unknown,
	): string {
		const timestamp = new Date().toISOString();
		const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
		return `[${timestamp}] ${level}: ${message}${dataStr}`;
	}

	debug(message: string, data?: unknown): void {
		if (this.level <= LogLevel.DEBUG) {
			console.debug(this.formatMessage("DEBUG", message, data));
		}
	}

	info(message: string, data?: unknown): void {
		if (this.level <= LogLevel.INFO) {
			console.info(this.formatMessage("INFO", message, data));
		}
	}

	warn(message: string, data?: unknown): void {
		if (this.level <= LogLevel.WARN) {
			console.warn(this.formatMessage("WARN", message, data));
		}
	}

	error(message: string, error?: unknown): void {
		if (this.level <= LogLevel.ERROR) {
			console.error(this.formatMessage("ERROR", message, error));
		}
	}
}

export const logger = new Logger();
