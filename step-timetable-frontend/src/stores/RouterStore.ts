import { action, makeObservable, observable, reaction } from "mobx"
import history from "../history"
import About from "../components/pages/About"
import AudienceEditor from "../components/pages/admin/AudienceEditor"
import Home from "../components/pages/Home"
import Schedule from "../components/pages/Schedule"
import SignIn from "../components/pages/SignIn"
import RouteModel from "../models/RouteModel"
import UserModel from "../models/UserModel"
import userStore from "./UserStore"
import GroupEditor from '../components/pages/admin/GroupEditor'
import LecturerEditor from '../components/pages/admin/LecturerEditor'

class RouterStore {

  // routes for anonymous users
  private anonymousRoutes: Array<RouteModel> = [
    { uri: '/', name: 'Главная', Component: Home },
    { uri: '/schedule', name: 'Расписание', Component: Schedule },
    { uri: '/about', name: 'О программе', Component: About },
    { uri: '/signin', name: 'Вход', Component: SignIn }
  ]

  // routes for logged users
  private loggedRoutes: Array<RouteModel> = [
    { uri: '/', name: 'Главная', Component: Home },
    { uri: '/schedule', name: 'Расписание', Component: Schedule },
    { uri: '/audiences', name: 'Аудитории', Component: AudienceEditor },
    { uri: '/groups', name: 'Группы', Component: GroupEditor },
    { uri: '/lecturers', name: 'Преподаватели', Component: LecturerEditor },
    { uri: '/about', name: 'О программе', Component: About },
    { uri: '/auth:out', name: 'Выйти', Component: Home }
  ]

    // routes for logged users with role 'ROLE_ADMIN'
  private adminRoutes: Array<RouteModel> = [
      { uri: '/', name: 'Главная', Component: Home },
      { uri: '/schedule', name: 'Расписание', Component: Schedule },
      { uri: '/audiences', name: 'Аудитории', Component: AudienceEditor },
      { uri: '/groups', name: 'Группы', Component: GroupEditor },
      { uri: '/lecturers', name: 'Преподаватели', Component: LecturerEditor },
      { uri: '/about', name: 'О программе', Component: About },
      { uri: '/auth:out', name: 'Выйти', Component: Home }
  ]

  @observable routes: Array<RouteModel> = this.anonymousRoutes

  constructor() {
      makeObservable(this)
  }

  // установить в качестве текущего список роутов для гостя
  @action setAnonymousRoutes() {
      this.routes = this.anonymousRoutes
  }

  // установить в качестве текущего список роутов для аунтентифицированного пользователя
  @action setLoggedRoutes() {
      this.routes = this.loggedRoutes
  }

  @action setAdminRoutes() {
      this.routes = this.adminRoutes
  }

  userReaction = reaction(
      () => userStore.user,
      (user: UserModel | null) => {
          if (user) {
              // let signOutRoute
              /* if (user.roleName === 'ROLE_ADMIN') {
                  signOutRoute =
                      this.adminRoutes
                          .find(route => route['name'].includes('Sign out'))
              } else {
                  signOutRoute =
                      this.loggedRoutes
                          .find(route => route['name'].includes('Sign out'))
              } */
              /* signOutRoute =
                this.loggedRoutes
                  .find(route => route['name'].includes('Sign out'))
              if (signOutRoute) {
                signOutRoute['name'] = `Sign out (${user.name})`
              } */
              if (user) {
                  let signOutRoute
                  if (user.roleName?.includes("ADMIN")) {
                      signOutRoute = this.adminRoutes
                          .find(route => route.uri.includes('/auth:out'))
                  } else {
                      signOutRoute = this.loggedRoutes
                          .find(route => route.uri.includes('/auth:out'))
                  }
                  if (signOutRoute) {
                      signOutRoute['name'] = `Log Out (${user.name})`
                  }
                  if (user.roleName?.includes("ADMIN")) {
                      this.setAdminRoutes()
                  } else {
                      this.setLoggedRoutes()
                  }
                  history.replace('/')
              } else {
                  this.setAnonymousRoutes()
                  history.replace('/signin')
              }
          }
      }
  )
}

export {RouterStore}
export default new RouterStore()