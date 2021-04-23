import {action, makeObservable, observable} from 'mobx'
// import FakeAPI from '../models/FakeAPI'
import GroupModel from '../models/GroupModel'
import {StoreBase} from './StoreBase'
import commonStore from './CommonStore'

class GroupStore {
  
  @observable groupList: GroupModel[] = []
  @observable currentGroupId: string | null = null
  @observable name: string = ''

  // for MobX version 6
  constructor() {
      makeObservable(this)
  }

  @action fetchGroupList (): void {
    StoreBase.httpRequest(
        `${commonStore.BASE_API_URL}/groups`,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
        },
        () => commonStore.setError('Ошибка запроса данных о группах')
    )
  }

  @action setGroupList (groupList: GroupModel[]): void {
    // console.log('groupList', groupList)
    this.groupList.length = 0
    this.groupList.unshift(
        ...groupList
    )
  }

  @action setName (name: string): void {
    this.name = name
  }

  @action setCurrentGroupId (id: string | null): void {
    this.currentGroupId = id
    if (id) {
      const currentGroup =
          this.groupList.find(hCard => hCard.id === this.currentGroupId)
      if (currentGroup) {
        this.name = currentGroup.name
      }
    } else {
      this.name = ''
    }
  }

  @action saveGroup (): void {
    if (!this.currentGroupId) {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/groups`,
          StoreBase.HTTP_METHOD.POST,
          new GroupModel(encodeURIComponent(this.name)),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
    } else {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/groups`,
          StoreBase.HTTP_METHOD.PUT,
          new GroupModel(encodeURIComponent(this.name), this.currentGroupId),
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentGroupId(null)
    }
  }

  @action deleteGroup (): void {
    if(this.currentGroupId) {
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/groups/${this.currentGroupId}`,
          StoreBase.HTTP_METHOD.DELETE,
          null,
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
      this.setCurrentGroupId(null)
    }
  }

  /* @action fetchGroupList (): void {
    this.groupList.length = 0
    this.groupList.unshift(...FakeAPI.groupList)
  }
  
  @action setName (name: string): void {
    this.name = name
  }
  
  @action addGroup (): void {
    this.groupList.unshift(
      new GroupModel(this.name)
    )
  } */
}

export { GroupStore }
export default new GroupStore()