export default class GroupModel {
  public id?: string
  public name: string
  constructor(name: string, id?: string) {
    this.id = id
    this.name = name
  }
}