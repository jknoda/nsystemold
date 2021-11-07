export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public empidf?: number,
    public usuidf?: number,
    public perfil?: string
  ) {}

  get token() {
    //if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
       //return null;
    //}
    return this._token;
  }
}
