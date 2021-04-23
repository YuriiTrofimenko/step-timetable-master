import {action, makeObservable, observable} from 'mobx'
import User from '../models/UserModel'
import {StoreBase} from './StoreBase'
import commonStore from './CommonStore'

class UserStore {

    // current user
    @observable user: User | null = null
    // username input
    @observable userName: string = ''
    // password input
    @observable password: string = ''

    // for MobX version 6
    constructor() {
        makeObservable(this)
    }

    @action setUser(user: User | null) {
        this.user = user
    }

    @action setUserName(userName: string) {
        this.userName = userName
    }

    @action setPassword(password: string) {
        this.password = password
    }

    @action reset() {
        this.userName = ''
        this.password = ''
    }

    @action check () {
        // this.setUser(new User('Fake User'))
        StoreBase.httpRequestForResult(
            `${commonStore.BASE_API_URL}/auth/users/check`,
            StoreBase.HTTP_METHOD.GET,
            null,
            (response) => {
                if (response.data) {
                    this.user = new User(response.data.name, response.data.roleName)
                }/*  else {
                    commonStore.setError('Ошибка получения данных о пользователе')
                } */
                commonStore.webSocketConnect()
            },
            (message) => commonStore.webSocketConnect()
        )
    }

    @action login () {
        // this.check()
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${this.userName}&password=${this.password}`,
            credentials: 'include'
        }).then((response) => {
            return response.status
        }).then((statusCode) => {
            if (statusCode == StoreBase.HTTP_STATUS.HTTP_STATUS_OK) {
                this.check()
            } else {
                commonStore.setError('Неверное имя или пароль')
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action logout () {
        // this.setUser(null)
        StoreBase.httpRequest(
            `${commonStore.BASE_URL}/logout`,
            StoreBase.HTTP_METHOD.GET,
            null,
            StoreBase.HTTP_STATUS.HTTP_STATUS_OK,
            () => this.setUser(null),
            () => commonStore.setError('Ошибка выхода из учетной записи')
        )
    }

    @action register () {
        StoreBase.httpRequestForResult(
            `${commonStore.BASE_API_URL}/auth/users`,
            StoreBase.HTTP_METHOD.POST,
            {'name': this.userName, 'password': this.password},
            (response) => this.login(),
            (message) => commonStore.setError(message)
        )
    }
}
export {UserStore}
export default new UserStore()