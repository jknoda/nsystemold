export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public empidf?: number,
    public usuidf?: number,
    public perfil?: string,
    public nome?: string
  ) {}

  get userid(){
    let id = this.usuidf;
    if (id == null) {
      id = 0;
    }
    return id;
  }
  get token() {
    //if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
       //return null;
    //}
    return this._token;
  }
}
