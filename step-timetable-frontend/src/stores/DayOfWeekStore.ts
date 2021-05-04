import { action, makeObservable, observable } from 'mobx'
import DayOfWeekModel from '../models/DayOfWeekModel'

class DayOfWeekStore {

    @observable selectedDayOfWeekNumber: number | null = null
    @observable dayOfWeekModels: DayOfWeekModel[] = [
        new DayOfWeekModel(1, 'Понедельник'),
        new DayOfWeekModel(2, 'Вторник'),
        new DayOfWeekModel(3, 'Среда'),
        new DayOfWeekModel(4, 'Четверг'),
        new DayOfWeekModel(5, 'Пятница'),
        new DayOfWeekModel(6, 'Суббота'),
        new DayOfWeekModel(7, 'Воскресенье')
    ]

    // for MobX version 6
    constructor() {
        makeObservable(this)
    }

    @action setDayOfWeekNumber (dayOfWeekNumber: number): void {
        this.selectedDayOfWeekNumber = dayOfWeekNumber
    }
}
export { DayOfWeekStore }
export default new DayOfWeekStore()