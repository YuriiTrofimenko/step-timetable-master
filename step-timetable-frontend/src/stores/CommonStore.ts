import {action, makeObservable, observable} from 'mobx'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import headerCardStore from './HeaderCardStore'
import groupStore from './GroupStore'
import lecturerStore from './LecturerStore'
import timeIntervalStore from './TimeIntervalStore'
import TimeIntervalModel from '../models/TimeIntervalModel'
import {Color} from '@material-ui/lab'

class CommonStore {

    @observable loading: boolean = false
    @observable error: string | null = null
    @observable snackbarText: string = ''
    @observable snackbarSeverity: Color = 'success'
    private IP_ADDRESS: string = process.env.REACT_APP_CUSTOM_EXTERNAL_IP ?? 'localhost'
    public BASE_URL: string = `http://${this.IP_ADDRESS}:8080/timetable`
    public BASE_API_URL: string = `${this.BASE_URL}/api`
    public BASE_WEBSOCKET_URL: string = `${this.BASE_URL}/websocket`

    // for MobX version 6
    constructor() {
        console.log('process.env = ', process.env)
        console.log('IP_ADDRESS = ', process.env.CUSTOM_EXTERNAL_IP)
        console.log('IP_ADDRESS = ', this.IP_ADDRESS)
        makeObservable(this)
    }

    private parseHttpResponseBody (body: string): any {
        return JSON.parse(
            decodeURIComponent(
                body.replace(/(%2E)/ig, "%20")
                    .replace(/\+/g, " ")
            )
        )
    }

    @action webSocketConnect () {
        const socket = new SockJS(this.BASE_WEBSOCKET_URL)
        const stompClient = Stomp.over(socket)
        stompClient.connect({},  (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/audiences', (data) => {
                headerCardStore.setHeaderCardList(this.parseHttpResponseBody(data.body))
            })
            stompClient.subscribe('/topic/groups', (data) => {
                groupStore.setGroupList(this.parseHttpResponseBody(data.body))
            })
            stompClient.subscribe('/topic/lecturers', (data) => {
                lecturerStore.setLecturerList(this.parseHttpResponseBody(data.body))
            })
            stompClient.subscribe('/topic/intervals', (data) => {
                timeIntervalStore.setTimeIntervalList(
                    this.parseHttpResponseBody(data.body)
                        .map((body: any) => new TimeIntervalModel(
                            body.intervalStart,
                            body.intervalEnd,
                            body.lessons,
                            body.pairNumber,
                            body.id
                        ))
                )
            })
            headerCardStore.fetchHeaderCardList()
            groupStore.fetchGroupList()
            lecturerStore.fetchLecturerList()
            timeIntervalStore.fetchTimeIntervalList()
        })
    }

    @action setLoading(loading: boolean): void {
        this.loading = loading
    }

    @action setError(error: string | null): void {
        this.error = error
    }

    @action setSnackbarText(text: string): void {
        this.snackbarText = text
    }

    @action setSnackbarSeverity(severityString: Color): void {
        this.snackbarSeverity = severityString
    }

    @action clearError(): void {
        this.error = null
    }
}
export {CommonStore}
export default new CommonStore()