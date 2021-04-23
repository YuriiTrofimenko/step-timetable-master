// import GroupModel from "./GroupModel";
// import HeaderCardModel from "./HeaderCardModel";
import LecturerModel from "./LecturerModel";
import LessonCardModel from "./LessonCardModel";
import TimeIntervalModel from "./TimeIntervalModel";

export default class FakeAPI {

  private static isInitialized = false
  private static currentDate = new Date()
  static initialize () {
    console.log('FakeAPI initialize() call')
    if (!FakeAPI.isInitialized) {
      // Initialization
      console.log('FakeAPI Init')
      FakeAPI.timeIntervalTemplates.forEach((template, index, templates) => {
        Object.assign(templates[index], FakeAPI.timeIntervalListDefault)
      })
      setInterval(
        () => {
          FakeAPI.currentDate = new Date()
          if (!FakeAPI.appliedTemplateIndex && FakeAPI.currentDate.getHours() >= 8) {
            FakeAPI.appliedTemplateIndex = FakeAPI.currentDate.getDay()
            FakeAPI.timeIntervalList =
              Object.assign([], FakeAPI.timeIntervalTemplates[FakeAPI.appliedTemplateIndex])
          } else if (FakeAPI.appliedTemplateIndex && FakeAPI.currentDate.getHours() >= 22) {
            FakeAPI.appliedTemplateIndex = null
            FakeAPI.timeIntervalList.length = 0
          }
          // console.log('FakeAPI.appliedTemplateIndex', FakeAPI.appliedTemplateIndex)
          // console.log('FakeAPI.timeIntervalList', FakeAPI.timeIntervalList)
          // console.log('indexOf', FakeAPI.timeIntervalTemplates.indexOf(FakeAPI.timeIntervalList))
        },
        1000
      )
    }
  }

  public static appliedTemplateIndex: number | null = null
  /* public static headerCardList: HeaderCardModel[] = [
    new HeaderCardModel('201'),
    new HeaderCardModel('202'),
    new HeaderCardModel('204'),
    new HeaderCardModel('205'),
    new HeaderCardModel('206'),
    new HeaderCardModel('207'),
    new HeaderCardModel('208'),
    new HeaderCardModel('210'),
    new HeaderCardModel('211'),
    new HeaderCardModel('212'),
    new HeaderCardModel('213'),
    new HeaderCardModel('214'),
    new HeaderCardModel('215'),
    new HeaderCardModel('217'),
    new HeaderCardModel('217a'),
    new HeaderCardModel('218'),
    new HeaderCardModel('218a')
  ] */
  /* public static groupList: GroupModel[] = [
    new GroupModel('ПД 911', 1),
    new GroupModel('1013', 2),
    new GroupModel('1012', 3),
    new GroupModel('МА 10-30', 4),
    new GroupModel('3022', 5),
    new GroupModel('АСВ 31-18', 6)
  ] */
  /* public static lecturerList: LecturerModel[] = [
    new LecturerModel('Юрий Валериевич', '1'),
    new LecturerModel('Елена Валерьевна', '2'),
    new LecturerModel('Оксана Владимировна', '3'),
    new LecturerModel('Максим Константинович', '4'),
    new LecturerModel('Татьяна Владимировна', '5'),
    new LecturerModel('Михаил Анатольевич', '6')
  ] */
  public static timeIntervalList: TimeIntervalModel[] = [
    /* new TimeIntervalModel(
      '9:00',
      '10:20',
      []
    ),
    new TimeIntervalModel(
      '10:30',
      '11:50',
      []
    ),
    new TimeIntervalModel(
      '12:00',
      '13:20',
      []
    ),
    new TimeIntervalModel(
      '13:30',
      '14:50',
      []
    ),
    new TimeIntervalModel(
      '15:00',
      '16:20',
      [
        new LessonCardModel('205', '1', '1'),
        new LessonCardModel('207', '2', '2'),
        new LessonCardModel('208', '3', '3')
      ]
    ),
    new TimeIntervalModel(
      '16:30',
      '17:50',
      [
        new LessonCardModel('201', '4', '4'),
        new LessonCardModel('211', '5', '5'),
        new LessonCardModel('212', '6', '6')
      ]
    ),
    new TimeIntervalModel(
      '18:00',
      '19:20',
      []
    ),
    new TimeIntervalModel(
      '19:30',
      '20:50',
      []
    ),
    new TimeIntervalModel(
      '21:00',
      '22:20',
      []
    ) */
  ]
  private static timeIntervalListDefault: TimeIntervalModel[] = [
    /* new TimeIntervalModel(
      '9:00',
      '10:20',
      []
    ),
    new TimeIntervalModel(
      '10:30',
      '11:50',
      []
    ),
    new TimeIntervalModel(
      '12:00',
      '13:20',
      []
    ),
    new TimeIntervalModel(
      '13:30',
      '14:50',
      []
    ),
    new TimeIntervalModel(
      '15:00',
      '16:20',
      []
    ),
    new TimeIntervalModel(
      '16:30',
      '17:50',
      []
    ),
    new TimeIntervalModel(
      '18:00',
      '19:20',
      []
    ),
    new TimeIntervalModel(
      '19:30',
      '20:50',
      []
    ),
    new TimeIntervalModel(
      '21:00',
      '22:20',
      []
    ) */
  ]
  // Time interval templates array
  public static timeIntervalTemplates: TimeIntervalModel[][] = [
    [], [], [], [], [], [], []
  ]
}

// FakeAPI.initialize()