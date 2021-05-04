import {action, makeObservable} from 'mobx'
import commonStore from './CommonStore'

enum HTTP_METHOD {
    GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE'
}

enum HTTP_STATUS {
    HTTP_STATUS_OK = 200,
    HTTP_STATUS_CREATED = 201,
    HTTP_STATUS_ACCEPTED = 202,
    HTTP_STATUS_NO_CONTENT = 204
}

abstract class StoreBase {

    static readonly HTTP_METHOD = HTTP_METHOD
    static readonly HTTP_STATUS = HTTP_STATUS

    // for MobX version 6
    constructor() {
        makeObservable(this)
    }
    static httpRequest (
        url: string,
        method: HTTP_METHOD,
        data: any,
        successHttpStatus: HTTP_STATUS,
        successHandler: () => void,
        errorHandler: () => void
    ): void {
        commonStore.clearError()
        commonStore.setLoading(true)
        const requestInit: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        if (data) {
            requestInit.body = JSON.stringify(data)
        }
        fetch(url, requestInit).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === successHttpStatus) {
                    successHandler()
                } else {
                    errorHandler()
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    static httpRequestForResult (
        url: string,
        method: HTTP_METHOD,
        data: any,
        successHandler: (data?: any) => void,
        errorHandler: (message: string) => void
    ): void {
        commonStore.clearError()
        commonStore.setLoading(true)
        const requestInit: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        }
        if (data) {
            requestInit.body = JSON.stringify(data)
        }
        fetch(url, requestInit).then((response) => {
            return response.text()
        }).then(responseBodyText => {
            const responseBody = JSON.parse(
                    decodeURIComponent(
                        responseBodyText.replace(/(%2E)/ig, "%20")
                            .replace(/\+/g, " ")
                    )
                )
            if (responseBody?.status === 'success') {
                successHandler(responseBody)
            } else {
                errorHandler(responseBody?.message || 'Неизвестная ошибка')
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }
}

export { StoreBase }