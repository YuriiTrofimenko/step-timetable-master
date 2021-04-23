export default class UserModel {
  public name: string
  public roleName?: string
  constructor (name: string, roleName?: string) {
      this.name = name
      if (roleName) {
          this.roleName = roleName
      }
  }
}