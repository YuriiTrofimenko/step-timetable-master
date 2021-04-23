export default class HeaderCardModel {
  // private static lastId = 0
  public id?: string
  public audienceNumber: string
  constructor (audienceNumber: string, id?: string) {
    if (id) {
      this.id = id
    }/*  else {
      this.id = ++HeaderCardModel.lastId
    } */
    this.audienceNumber = audienceNumber
  }
}