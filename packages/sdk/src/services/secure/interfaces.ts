export interface ISecureService {
  createSecureCode(): Promise<string>;

  signSecureCode(creatorAddress: string, code: string): Promise<boolean>;

  verifySecureCode(code: string): boolean;

  destroySecureCode(): Promise<boolean>;
}
