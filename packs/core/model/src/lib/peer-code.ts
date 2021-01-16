export class PeerCode {
  constructor(
    public timeLow: string,
    public timeMid: string,
    public timeHiAndVersion: string,
    public clockSecHiAndRes: string
  ) {}
}
