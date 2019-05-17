export interface IGetResponse {
  version: string;
}

export interface IPostBody {
  player?: 'Creator' | 'Opponent' | null;
  nextData: string;
  nextTime: number;
  previousData?: string | null;
  previousTime?: number | null;
  now?: number | null;
}

export interface IPostResponse {
  whoseTurn: 'Creator' | 'Opponent' | null;
  winner: 'Creator' | 'Opponent' | null;
}

export declare function get(): IGetResponse;

export declare function post(body: IPostBody): Promise<IPostResponse>;
