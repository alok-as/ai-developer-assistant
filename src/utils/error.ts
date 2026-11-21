export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ToolExecutionError extends AppError {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ToolExecutionError";
  }
}
