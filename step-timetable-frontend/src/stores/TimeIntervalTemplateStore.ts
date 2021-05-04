import {action, makeObservable, observable} from 'mobx'
import headerCardStore from './HeaderCardStore'
import LessonCardModel from '../models/LessonCardModel'
import TimeIntervalModel from '../models/TimeIntervalModel'
import {StoreBase} from './StoreBase'
import commonStore from './CommonStore'
import dayOfWeekStore from './DayOfWeekStore'

class TimeIntervalTemplateStore {

  public BASE_API_TEMPLATES_URL: string = `${commonStore.BASE_API_URL}/templates`
  // top level properties
  @observable timeIntervalList: TimeIntervalModel[] = []
  @observable selectedTimeInterval: TimeIntervalModel | null = null
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

  @action fetchIntervalTemplateList (): void {
    StoreBase.httpRequest(
        this.BASE_API_TEMPLATES_URL,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
        },
        () => commonStore.setError('Ошибка запроса данных о временных полосах')
    )
  }

  @action fetchTemplateIntervalListByDay (dayOfWeekNumber: number): void {
    StoreBase.httpRequestForResult(
        `${this.BASE_API_TEMPLATES_URL}/byDayOfWeekNumber/${dayOfWeekStore.selectedDayOfWeekNumber}/intervals`,
        StoreBase.HTTP_METHOD.GET,
        null,
        (response) => {
          if (response.data) {
            this.setTimeIntervalList(
                response.data.map((body: any) => new TimeIntervalModel(
                    body.intervalStart,
                    body.intervalEnd,
                    body.lessons,
                    body.pairNumber,
                    body.id
                ))
            )
          }
        },
        (message) => commonStore.setError('Ошибка запроса данных о временных полосах')
    )
  }

  @action applyTemplates (): void {
    StoreBase.httpRequest(
        `${this.BASE_API_TEMPLATES_URL}/apply`,
        StoreBase.HTTP_METHOD.GET,
        null,
        StoreBase.HTTP_STATUS.HTTP_STATUS_ACCEPTED,
        () => {
          commonStore.setSnackbarSeverity('success')
          commonStore.setSnackbarText('Шаблоны применены')
        },
        () => commonStore.setError('Ошибка применения шаблонов')
    )
  }

  @action setTimeIntervalList (timeIntervalList: TimeIntervalModel[]): void {
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
      timeInterval.lessonCards =
          timeInterval.lessonCards.sort(
              (a, b) => (a.audienceNumber ?? '').localeCompare(b.audienceNumber ?? '')
          )
    })
    this.timeIntervalList.unshift(...timeIntervalList)
  }

  @action setTimeIntervalStart (start: string): void {
    this.intervalStart = start
  }

  @action setTimeIntervalEnd (end: string): void {
    this.intervalEnd = end
  }

  @action setSelectedLessonCard (timeIntervalId: number | null, selectedLessonId: number | null): void {
    if (timeIntervalId && selectedLessonId) {
      this.selectedTimeIntervalId = timeIntervalId
      this.selectedLessonCard =
        this.timeIntervalList.find(timeInterval => timeInterval.id === timeIntervalId)
          ?.lessonCards.find(lessonCard => lessonCard.id === selectedLessonId) ?? new LessonCardModel(null, null, null)
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
    if (dayOfWeekStore.selectedDayOfWeekNumber && this.selectedLessonCard?.id && this.selectedTimeIntervalId) {
      StoreBase.httpRequest(
          `${this.BASE_API_TEMPLATES_URL}/byDayOfWeekNumber/${dayOfWeekStore.selectedDayOfWeekNumber}/intervals/${this.selectedTimeIntervalId}/lessons/${this.selectedLessonCard?.id}`,
          StoreBase.HTTP_METHOD.DELETE,
          null,
          StoreBase.HTTP_STATUS.HTTP_STATUS_NO_CONTENT,
          () => this.fetchTemplateIntervalListByDay(dayOfWeekStore.selectedDayOfWeekNumber ?? 0),
          () => commonStore.setError('Ошибка удаления урока')
      )
    }
  }

  @action saveLessonCard (): void {
    if (dayOfWeekStore.selectedDayOfWeekNumber && this.selectedLessonCard?.id && this.selectedTimeIntervalId) {
      StoreBase.httpRequest(
          `${this.BASE_API_TEMPLATES_URL}/byDayOfWeekNumber/${dayOfWeekStore.selectedDayOfWeekNumber}/intervals/${this.selectedTimeIntervalId}/lessons/${this.selectedLessonCard?.id}`,
          StoreBase.HTTP_METHOD.PUT,
          {
            groupId: encodeURIComponent(this.selectedLessonCard.groupId ?? ''),
            lecturerId: encodeURIComponent(this.selectedLessonCard.lecturerId ?? '')
          },
          StoreBase.HTTP_STATUS.HTTP_STATUS_OK,
          () => this.fetchTemplateIntervalListByDay(dayOfWeekStore.selectedDayOfWeekNumber ?? 0),
          () => commonStore.setError('Ошибка сохранения изменений')
      )
    }
    this.unsetSelectedLessonCard()
  }
}

export { TimeIntervalTemplateStore }
export default new TimeIntervalTemplateStore()