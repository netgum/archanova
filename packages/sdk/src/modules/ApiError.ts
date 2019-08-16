export class ApiError extends Error {
  public static isApiError(err: any, type: ApiError.Types = null): boolean {
    let result = (
      typeof err === 'object' &&
      err &&
      err instanceof this
    );

    if (result && type) {
      result = err.type === type;
    }

    return result;
  }

  public error: string = null;

  public errors: { [key: string]: string } = {};

  constructor(
    public type: ApiError.Types,
    response: {
      error?: string;
      errors?: {
        type: string;
        path: string;
      }[];
    } = null,
  ) {
    super(type);

    if (response) {
      if (response.error) {
        this.error = response.error;
      } else if (response.errors) {
        this.errors = response.errors.reduce(
          (result, error) => {
            return {
              ...result,
              [error.path]: error.type,
            };
          },
          {},
        );
      }
    }
  }
}

export namespace ApiError {
  export enum Types {
    BadRequest = 'bad request',
    Unauthorized = 'unauthorized',
    Forbidden = 'forbidden',
    NotFound = 'not found',
    Failed = 'failed',
  }
}
