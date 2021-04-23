import {action, makeObservable, observable} from 'mobx'
import LecturerModel from '../models/LecturerModel'
import {StoreBase} from './StoreBase'
import commonStore from './CommonStore'

class LecturerStore {

  @observable lecturerList: LecturerModel[] = []
  @observable currentLecturerId: string | null = null
  @observable name: string = ''

  // for MobX version 6
  constructor() {
    makeObservable(this)
  }

  @action fetchLecturerList (): void {
    StoreBase.httpRequest(
        `${commonStore.BASE_API_URL}/lecturers`,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
        },
        () => commonStore.setError('Ошибка запроса данных о преподавателях')
    )
  }

  @action setLecturerList (lecturerList: LecturerModel[]): void {
    this.lecturerList.length = 0
    this.lecturerList.unshift(
        ...lecturerList
    )
  }

  @action setName (name: string): void {
    this.name = name
  }

  @action setCurrentLecturerId (id: string | null): void {
    this.currentLecturerId = id
    if (id) {
      const currentLecturer =
          this.lecturerList.find(hCard => hCard.id === this.currentLecturerId)
      if (currentLecturer) {
        this.name = currentLecturer.name
      }
    } else {
      this.name = ''
    }
  }

  @action saveLecturer (): void {
    if (!this.currentLecturerId) {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/lecturers`,
          StoreBase.HTTP_METHOD.POST,
          new LecturerModel(encodeURIComponent(this.name)),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
    } else {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/lecturers`,
          StoreBase.HTTP_METHOD.PUT,
          new LecturerModel(encodeURIComponent(this.name), this.currentLecturerId),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentLecturerId(null)
    }
  }

  @action deleteLecturer (): void {
    if(this.currentLecturerId) {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/lecturers/${this.currentLecturerId}`,
          StoreBase.HTTP_METHOD.DELETE,
          null,
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentLecturerId(null)
    }
  }
}

export { LecturerStore }
export default new LecturerStore()