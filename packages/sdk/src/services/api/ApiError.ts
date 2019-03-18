class ApiError extends Error {
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

namespace ApiError {
  export enum Types {
    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    NotFound = 'NotFound',
    Failed = 'Failed',
  }
}

export {
  ApiError,
};
