import LessonCardModel from './LessonCardModel'

export default class TimeIntervalModel {
  // private static lastId = 0
  public id?: number
  public pairNumber: number
  public intervalStart: string
  public intervalEnd: string
  public lessonCards: LessonCardModel[]
  constructor (
      intervalStart: string,
      intervalEnd: string,
      lessonCards: LessonCardModel[] = [],
      pairNumber: number,
      id?: number
    ) {
    if (id) {
      this.id = id
    }/*  else {
      this.id = ++TimeIntervalModel.lastId
    } */
    this.pairNumber = pairNumber
    this.intervalStart = intervalStart
    this.intervalEnd = intervalEnd
    this.lessonCards = lessonCards
  }
}