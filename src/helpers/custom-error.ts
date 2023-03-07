export class CustomError extends Error {
  get name(): string {
    return this.constructor.name;
  }
}

export class ExitCodeError extends CustomError {
  readonly code: number;

  constructor(code: number, message?: string, command?: string) {
    if (command) {
      super(
        `Command '${command}' exited with code ${code} and message "${message}"`,
      );
    } else {
      super(`Child exited with code ${code} and message "${message}"`);
    }
    this.code = code;
  }
}
