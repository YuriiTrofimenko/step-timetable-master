import {action, makeObservable, observable} from 'mobx'
import FakeAPI from '../models/FakeAPI'
import HeaderCardModel from '../models/HeaderCardModel'
import { StoreBase } from './StoreBase'
import commonStore from './CommonStore'

/* Timetable Header Cards In-Memory Local Storage */
class HeaderCardStore {

  @observable headerCardList: HeaderCardModel[] = []
  @observable currentHeaderCardId: string | null = null
  @observable audienceNumber: string = ''

  // for MobX version 6
  constructor() {
    makeObservable(this)
  }

  @action fetchHeaderCardList (): void {
    /* this.headerCardList.length = 0
    this.headerCardList.unshift(
      ...FakeAPI.headerCardList
    ) */
    StoreBase.httpRequest(
        `${commonStore.BASE_API_URL}/audiences`,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
        },
        () => commonStore.setError('Ошибка запроса данных об аудиториях')
    )
  }

  @action setHeaderCardList (headerCardList: HeaderCardModel[]): void {
    this.headerCardList.length = 0
    this.headerCardList.unshift(
        ...headerCardList
    )
  }

  @action setHeaderCardNumber (audienceNumber: string): void {
    this.audienceNumber = audienceNumber
  }

  @action setCurrentHeaderCardId (id: string | null): void {
    this.currentHeaderCardId = id
    if (id) {
      const currentHeaderCard =
        this.headerCardList.find(hCard => hCard.id === this.currentHeaderCardId) ?? null
      if (currentHeaderCard) {
        this.audienceNumber = currentHeaderCard.audienceNumber
      }
    } else {
      this.audienceNumber = ''
    }
  }

  @action saveHeaderCard (): void {
    // add a new item
    if (!this.currentHeaderCardId) {
      /* FakeAPI.headerCardList.push(
        new HeaderCardModel(this.audienceNumber)
      ) */
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/audiences`,
          StoreBase.HTTP_METHOD.POST,
          new HeaderCardModel(encodeURIComponent(this.audienceNumber)),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
    } else {
      // edit selected item
      /* const currentHeaderCard =
        FakeAPI.headerCardList.find(todo => todo.id === this.currentHeaderCardId) ?? null
      if (currentHeaderCard) {
        currentHeaderCard.audienceNumber = this.audienceNumber
      } */
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/audiences`,
          StoreBase.HTTP_METHOD.PUT,
          new HeaderCardModel(encodeURIComponent(this.audienceNumber), this.currentHeaderCardId),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentHeaderCardId(null)
      // this.fetchHeaderCardList()
    }
  }

  @action deleteHeaderCard (): void {
    if(this.currentHeaderCardId) {
      // delete selected item
      /* FakeAPI.headerCardList.splice(
        FakeAPI.headerCardList.findIndex(headerCard => headerCard.id === this.currentHeaderCardId),
        1
      ) */
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/audiences/${this.currentHeaderCardId}`,
          StoreBase.HTTP_METHOD.DELETE,
          null,
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentHeaderCardId(null)
      // this.fetchHeaderCardList()
    }
  }
}

export { HeaderCardStore }
export default new HeaderCardStore()