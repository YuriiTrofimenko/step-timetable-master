import {action, makeObservable, observable} from 'mobx'
import headerCardStore from './HeaderCardStore'
import LessonCardModel from '../models/LessonCardModel'
import TimeIntervalModel from '../models/TimeIntervalModel'
import FakeAPI from '../models/FakeAPI'
import {StoreBase} from './StoreBase'
import commonStore from './CommonStore'
import GroupModel from '../models/GroupModel'

/* Timetable Header Cards In-Memory Local Storage */
class TimeIntervalStore {
  @observable timeStamp: number = 0
  // top level properties
  @observable timeIntervalList: TimeIntervalModel[] = []
  @observable selectedTimeInterval: TimeIntervalModel | null = null
  @observable currentTimeIntervalId: number | null = null
  @observable currentTimeIntervalNumber: number | null = null
  @observable lastTimeIntervalId: number = 0
  @observable intervalStart: string | null = null
  @observable intervalEnd: string | null = null
  // lesson card properties
  @observable selectedLessonCard: LessonCardModel = new LessonCardModel(null, null, null)
  @observable selectedTimeIntervalId: number | null = null
  @observable lessonCardGroupId: string | null = null
  @observable lessonCardLecturerId: string | null = null

  // for MobX version 6
  constructor() {
      makeObservable(this)
  }

  @action setTimeStamp (timeStamp: number): void {
    this.timeStamp = timeStamp
  }

  @action fetchTimeIntervalList (): void {
    StoreBase.httpRequest(
        `${commonStore.BASE_API_URL}/intervals`,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
        },
        () => commonStore.setError('Ошибка запроса данных о временных полосах')
    )
  }

  @action setTimeIntervalList (timeIntervalList: TimeIntervalModel[]): void {
    /* const timeIntervalListStub: TimeIntervalModel[] =
        Object.assign([], FakeAPI.timeIntervalList) */
    this.timeIntervalList.length = 0
    timeIntervalList.forEach((timeInterval) => {
      headerCardStore.headerCardList.forEach((headerCardModel) => {
        const lessonCard = timeInterval.lessonCards.find(
            lesson => lesson.audienceNumber === headerCardModel.audienceNumber
        )
        if (!lessonCard) {
          timeInterval.lessonCards.unshift(
              new LessonCardModel(headerCardModel.audienceNumber, null, null)
          )
        }
      })
      console.log('timeInterval', timeInterval)
      timeInterval.lessonCards =
          timeInterval.lessonCards.sort(
              (a, b) => (a.audienceNumber ?? '').localeCompare(b.audienceNumber ?? '')
          )
    })
    this.timeIntervalList.unshift(...timeIntervalList)
  }

  @action setCurrentTimeIntervalId (id: number | null): void {
    this.currentTimeIntervalId = id
    /* console.log('***')
    console.log('id', id)
    console.log('timeInterval', this.timeIntervalList.find(
        timeInterval => timeInterval.id === id
    ))
    console.log('***') */
    if (id) {
      this.lastTimeIntervalId = id
      this.currentTimeIntervalNumber =
          this.timeIntervalList.find(
              timeInterval => timeInterval.id === id
          )?.pairNumber ?? null
    } else {
      this.currentTimeIntervalNumber = null
    }
  }

  @action setTimeIntervalStart (start: string): void {
    this.intervalStart = start
  }

  @action setTimeIntervalEnd (end: string): void {
    this.intervalEnd = end
  }

  /* @action addTimeInterval (): void {
    if (this.intervalStart && this.intervalEnd) {
      this.timeIntervalList.unshift(
        new TimeIntervalModel(this.intervalStart, this.intervalEnd)
      )
    }
  } */

  @action setSelectedLessonCard (timeIntervalId: number | null, selectedLessonId: number | null): void {
    if (timeIntervalId && selectedLessonId) {
      this.selectedTimeIntervalId = timeIntervalId
      this.selectedLessonCard =
        this.timeIntervalList.find(timeInterval => timeInterval.id === timeIntervalId)
          ?.lessonCards.find(lessonCard => lessonCard.id === selectedLessonId) ?? new LessonCardModel(null, null, null)
        console.log('selectedLessonCard', this.selectedLessonCard)
      this.lessonCardGroupId = this.selectedLessonCard.groupId
      this.lessonCardLecturerId = this.selectedLessonCard.lecturerId
    }
  }

  @action unsetSelectedLessonCard (): void {
    this.selectedLessonCard = new LessonCardModel(null, null, null)
    this.lessonCardGroupId = null
    this.lessonCardLecturerId = null
    this.selectedTimeIntervalId = null
  }

  @action setLessonCardGroupId (lessonCardGroupId: string | null): void {
    this.lessonCardGroupId = lessonCardGroupId
    this.selectedLessonCard.groupId = lessonCardGroupId
  }

  @action setLessonCardLecturerId (lessonCardLecturerId: string | null): void {
    this.lessonCardLecturerId = lessonCardLecturerId
    this.selectedLessonCard.lecturerId = lessonCardLecturerId
  }

  @action deleteLessonCard (): void {
    if (this.selectedLessonCard?.id && this.selectedTimeIntervalId) {
      /* const fakeLesson =
        FakeAPI.timeIntervalList.find(t => t.id === this.selectedTimeIntervalId)
          ?.lessonCards.find(l => l.id === this.selectedLessonCard?.id)
      if (fakeLesson) {
        fakeLesson.groupId = null
        fakeLesson.lecturerId = null
        // this.fetchTimeIntervalList()
      } */
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/intervals/${this.selectedTimeIntervalId}/lessons/${this.selectedLessonCard?.id}`,
          StoreBase.HTTP_METHOD.DELETE,
          null,
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка удаления урока')
      )
    }
  }

  @action saveLessonCard (): void {
    if (this.selectedLessonCard?.id && this.selectedTimeIntervalId) {
      /* const fakeLesson =
        FakeAPI.timeIntervalList.find(t => t.id === this.selectedTimeIntervalId)
          ?.lessonCards.find(l => l.id === this.selectedLessonCard?.id)
      if (fakeLesson) {
        fakeLesson.groupId = this.selectedLessonCard.groupId
        fakeLesson.lecturerId = this.selectedLessonCard.lecturerId
        // this.fetchTimeIntervalList()
      } */
      StoreBase.httpRequest(
          `${commonStore.BASE_API_URL}/intervals/${this.selectedTimeIntervalId}/lessons/${this.selectedLessonCard?.id}`,
          StoreBase.HTTP_METHOD.PUT,
          {
            groupId: encodeURIComponent(this.selectedLessonCard.groupId ?? ''),
            lecturerId: encodeURIComponent(this.selectedLessonCard.lecturerId ?? '')
          },
          StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
          () => {
          },
          () => commonStore.setError('Ошибка сохранения изменений')
      )
    }
    this.unsetSelectedLessonCard()
  }
}

export { TimeIntervalStore }
export default new TimeIntervalStore()