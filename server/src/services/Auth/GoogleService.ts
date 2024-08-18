export default class GoogleService {
  constructor(private verifiedData: any) {}

  signIn() {
    console.log(this.verifiedData);
  }
}
