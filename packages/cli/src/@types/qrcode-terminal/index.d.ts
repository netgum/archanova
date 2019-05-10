declare module 'qrcode-terminal' {
  export function generate(url: string, options: IOptions, callback: TCallback);

  export function generate(url: string, callback: TCallback);

  export interface IOptions {
    small?: boolean;
  }

  export type TCallback = (data: string) => any;
}
