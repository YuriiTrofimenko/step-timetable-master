import React, { Component } from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import {inject, observer} from 'mobx-react'
import { HeaderCardStore } from '../../stores/HeaderCardStore'
import { TimeIntervalStore } from '../../stores/TimeIntervalStore'
import { GroupStore } from '../../stores/GroupStore'
import { LecturerStore } from '../../stores/LecturerStore'
import { Grid, Card, CardContent, Typography, /* IconButton, CardActions, */ Button, Box, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select/*, TextField */ } from '@material-ui/core'
import dateTimeFormatter from 'date-and-time'
import DigitalWatch from './timetable_parts/DigitalWatch'
// import TimeIntervalModel from '../../models/TimeIntervalModel'
import TimeIntervalProgress from './timetable_parts/TimeIntervalProgress'
import LessonCardModel from '../../models/LessonCardModel'
import userStore, {UserStore} from '../../stores/UserStore'
import {reaction} from 'mobx'
import UserModel from '../../models/UserModel'
import history from '../../history'
// import { ValidatorForm } from 'react-material-ui-form-validator'

// type for the explicitly provided props only
interface IProps {}

// type for the injected and explicitly provided props
interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  headerCardStore: HeaderCardStore,
  timeIntervalStore: TimeIntervalStore,
  groupStore: GroupStore,
  lecturerStore: LecturerStore,
  userStore: UserStore
}

interface IState {
  lessonDialogOpen: boolean,
  currentDate: Date,
  acquiredAudiences: string []
}

const styles = (theme: Theme) => createStyles({
  root: {
    '& .MuiCard-root': {
      height: 90
    },
    '& .MuiGrid-item': {
      paddingBottom: 1,
      paddingTop: 1
    }
  },
  cardsCell: {
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    '& span': {
      overflowWrap: 'break-word'
      /* margin: 0,
      flexGrow: 1,
      display: 'flex' */
    }
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-evenly'
  },
  currentTimeIntervalCard: {
    backgroundColor: '#0a95dd',
    color: '#fff',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-evenly'
  },
  lessonCard: {
    textAlign: 'center',
    '& > div': {
      padding: '5px',
      '& > span': {
        margin: 0
      }
    }
  },
  currentTimeIntervalEmptyLessonCards: {
    backgroundColor: 'lightblue',
    opacity: 0.5,
    textAlign: 'left',
    '& > div': {
      padding: '5px',
      '& > span': {
        margin: 0
      }
    }
  },
  currentTimeIntervalNonEmptyLessonCards: {
    backgroundColor: '#0a95dd',
    color: '#fff',
    textAlign: 'left',
    '& > div': {
      padding: '5px',
      '& > span': {
        margin: 0
      }
    }
  },
  headerCard: {
    height: '50px !important',
    textAlign: 'center'
  },
  acquridHeaderCard: {
    height: '50px !important',
    textAlign: 'center',
    backgroundColor: '#0a95dd',
    color: '#fff'
  },
  freeHeaderCard: {
    height: '50px !important',
    textAlign: 'center',
    color: 'lightgray'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 11,
  }
})

@inject('headerCardStore', 'timeIntervalStore', 'groupStore', 'lecturerStore', 'userStore')
@observer
class Timetable extends Component<IProps, IState> {
  // public intervalID: number
  private isComponentMounted: boolean
  constructor(props: IProps) {
    super(props)
    // this.intervalID = 0
    this.isComponentMounted = false
    this.state = {
      lessonDialogOpen: false,
      currentDate: new Date(),
      acquiredAudiences: []
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }
  timeStampReaction = reaction(
      () => this.injected.timeIntervalStore.timeStamp,
      (timeStamp: number) => {
        if (this.isComponentMounted) {
          const currentDate = new Date(timeStamp)
          this.setState({currentDate})
          this.injected.timeIntervalStore.setCurrentTimeIntervalId(
              this.injected.timeIntervalStore.timeIntervalList.find(
                  (timeInterval) => {
                    const currentIntervalStartDate: Date =
                        dateTimeFormatter.parse(timeInterval.intervalStart, 'H:mm')
                    const currentIntervalEndDate: Date =
                        dateTimeFormatter.parse(timeInterval.intervalEnd, 'H:mm')
                    const currentTimeDate: Date =
                        dateTimeFormatter.parse(
                            `${dateTimeFormatter.format(currentDate, 'H')}:${dateTimeFormatter.format(currentDate, 'mm')}`,
                            'H:mm'
                        )
                    return (currentTimeDate >= currentIntervalStartDate) && (currentTimeDate <= currentIntervalEndDate)
                  }
              )?.id || null)
          const currentTimeIntervalId = this.injected.timeIntervalStore.currentTimeIntervalId
          if (currentTimeIntervalId) {
            const currentTimeInterval =
                this.injected.timeIntervalStore.timeIntervalList.find(timeInterval => timeInterval.id === currentTimeIntervalId)
            if (currentTimeInterval) {
              const acquiredAudiences: string[] = []
              currentTimeInterval.lessonCards.forEach(lessonCard => {
                if (lessonCard.audienceNumber && lessonCard.groupId && lessonCard.lecturerId) {
                  acquiredAudiences.push(lessonCard.audienceNumber)
                }
              })
              this.setState({'acquiredAudiences': acquiredAudiences})
            }
          }
        }
      }
  )
  componentDidMount () {
    this.isComponentMounted = true
    // this.injected.headerCardStore.fetchHeaderCardList()
    // this.injected.timeIntervalStore.fetchTimeIntervalList()
    // this.injected.groupStore.fetchGroupList()
    // this.injected.lecturerStore.fetchLecturerList()
    /* this.intervalID = window.setInterval(
      () => {
        const currentDate = new Date()
        this.setState({currentDate})
        this.injected.timeIntervalStore.setCurrentTimeIntervalId(
          this.injected.timeIntervalStore.timeIntervalList.find(
            (timeInterval) => {
              const currentIntervalStartDate: Date =
                dateTimeFormatter.parse(timeInterval.intervalStart, 'H:mm')
              const currentIntervalEndDate: Date =
                dateTimeFormatter.parse(timeInterval.intervalEnd, 'H:mm')
              const currentTimeDate: Date =
                dateTimeFormatter.parse(
                  `${dateTimeFormatter.format(currentDate, 'H')}:${dateTimeFormatter.format(currentDate, 'mm')}`,
                  'H:mm'
                )
                return (currentTimeDate >= currentIntervalStartDate) && (currentTimeDate <= currentIntervalEndDate)
            }
          )?.id || null)
        const currentTimeIntervalId = this.injected.timeIntervalStore.currentTimeIntervalId
        if (currentTimeIntervalId) {
          const currentTimeInterval =
            this.injected.timeIntervalStore.timeIntervalList.find(timeInterval => timeInterval.id === currentTimeIntervalId)
          if (currentTimeInterval) {
            const acquiredAudiences: string[] = []
            currentTimeInterval.lessonCards.forEach(lessonCard => {
              if (lessonCard.audienceNumber && lessonCard.groupId && lessonCard.lecturerId) {
                acquiredAudiences.push(lessonCard.audienceNumber)
              }
            })
            this.setState({'acquiredAudiences': acquiredAudiences})
          }
        }
      },
      1000
    ) */
  }
  componentWillUnmount() {
    // window.clearInterval(this.intervalID)
    this.isComponentMounted = false
  }
  lessonCardClickHandler = (intervalRowId: number | null, lessonCardId: number | null) => {
    if (this.injected.userStore.user) {
      this.injected.timeIntervalStore.setSelectedLessonCard(intervalRowId, lessonCardId)
      this.setState({lessonDialogOpen: true})
    }
  }
  lessonDialogClosedHandler = () => {
    // console.log('selectedLessonCard', this.injected.timeIntervalStore.selectedLessonCard)
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalStore.unsetSelectedLessonCard()
  }
  lessonDialogCancelHandler = () => {
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalStore.unsetSelectedLessonCard()
  }
  lessonDialogDeleteHandler = () => {
    this.injected.timeIntervalStore.deleteLessonCard()
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalStore.unsetSelectedLessonCard()
  }
  // lessonDialogOkHandler = (e: React.FormEvent<HTMLFormElement>) => {
  lessonDialogOkHandler = () => {
    console.log('lessonDialogOkHandler', 1)
    // e.preventDefault()
    console.log('lessonDialogOkHandler', 2)
    this.injected.timeIntervalStore.saveLessonCard()
    this.setState({lessonDialogOpen: false})
    // this.injected.timeIntervalStore.unsetSelectedLessonCard()
  }
  groupSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardGroupId = e.target.value
    console.log('typeof lessonCardGroupId', typeof lessonCardGroupId)
    if (typeof lessonCardGroupId === 'string') {
      this.injected.timeIntervalStore.setLessonCardGroupId(lessonCardGroupId)
      document?.getElementById('groupValidator')
        ?.setAttribute('value', lessonCardGroupId)
    }
  }
  lecturerSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardLecturerId = e.target.value
    console.log('typeof lessonCardLecturerId', typeof lessonCardLecturerId)
    if (typeof lessonCardLecturerId === 'string') {
      this.injected.timeIntervalStore.setLessonCardLecturerId(lessonCardLecturerId)
      document?.getElementById('lecturerValidator')
        ?.setAttribute('value', lessonCardLecturerId)
    }
  }
  render () {
    const { classes } = this.injected
    const { headerCardList } = this.injected.headerCardStore
    // calculation of width for all the cards by the width of the screen 
    const cardWith =
      ((document.body.clientWidth - 143) / (headerCardList.length + 1)).toFixed(0)
    const cardStyle = {'width': cardWith + 'px'}
    const {
      timeIntervalList,
      selectedLessonCard,
      lessonCardGroupId,
      lessonCardLecturerId
    } = this.injected.timeIntervalStore
    const { groupList } = this.injected.groupStore
    const { lecturerList } = this.injected.lecturerStore
    const timeIntervalProgressView =
      this.injected.timeIntervalStore.currentTimeIntervalId ? <TimeIntervalProgress/> : ''
    const freeAudiences: Set<string> = new Set()
    headerCardList.forEach(headerCard => freeAudiences.add(headerCard.audienceNumber))
    this.injected.timeIntervalStore.timeIntervalList.forEach(
      timeInterval => {
        timeInterval.lessonCards.forEach(
          lessonCard => {
            if (lessonCard.audienceNumber && lessonCard.groupId && lessonCard.lecturerId) {
              freeAudiences.delete(lessonCard.audienceNumber)
            }
          }
        )
      }
    )
    return (
      <>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12} className={classes.cardsCell}>
            <Box component='span'>
              <Card className={classes.card && classes.headerCard} style={cardStyle}>
                <CardContent>
                  <Typography variant="h6" component="h3">
                    &nbsp;&nbsp;&nbsp;
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            {
              headerCardList.map((headerCardModel, headerCardIdx) => (
                <Box component='span' key={headerCardIdx}>
                  <Card className={classes.card && (this.state.acquiredAudiences.includes(headerCardModel.audienceNumber)) ? classes.acquridHeaderCard : (freeAudiences.has(headerCardModel.audienceNumber)) ? classes.freeHeaderCard : classes.headerCard} style={cardStyle}>
                    <CardContent>
                      <Typography variant="h6" component="h3">
                        {headerCardModel.audienceNumber}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            }
          </Grid>
          {
            timeIntervalList.map((timeIntervalModel, intervalIdx) => (
              <Grid item xs={12} className={classes.cardsCell} key={intervalIdx}>
                <Box component='span'>
                  <Card
                    className={(this.injected.timeIntervalStore.currentTimeIntervalId === timeIntervalModel.id) ? classes.currentTimeIntervalCard : classes.card}
                    style={cardStyle}>
                    <CardContent>
                        <Typography variant="caption" display="block">
                          пара {timeIntervalModel.pairNumber}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {timeIntervalModel.intervalStart}-{timeIntervalModel.intervalEnd}
                        </Typography>
                    </CardContent>
                  </Card>
                </Box>
                {
                  timeIntervalModel.lessonCards.map((lessonCardModel, lessonIdx) => (
                    <Box component='span' key={lessonIdx}>
                      <Card
                        className={(this.injected.timeIntervalStore.currentTimeIntervalId === timeIntervalModel.id) ? (lessonCardModel.groupId && lessonCardModel.lecturerId) ? classes.currentTimeIntervalNonEmptyLessonCards : classes.currentTimeIntervalEmptyLessonCards : classes.lessonCard}
                        style={cardStyle}
                        onClick={() => {
                          this.lessonCardClickHandler(timeIntervalModel.id || null, lessonCardModel.id || null)
                        }}>
                        <CardContent>
                          {/*<Typography variant="caption" display="block">
                            {(lessonCardModel.groupId && lessonCardModel.lecturerId) ? lessonCardModel.audienceNumber : ''}
                          </Typography>*/}
                          <Typography variant="body2" component="p">
                            {groupList.find(group => group.id === lessonCardModel.groupId)?.name}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {lecturerList.find(lecturer => lecturer.id === lessonCardModel.lecturerId)?.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))
                }
              </Grid>
            ))
          }
        </Grid>
        <Dialog
          open={this.state.lessonDialogOpen}
          onClose={this.lessonDialogClosedHandler}
          aria-labelledby="form-dialog-title">
          <form /* onSubmit={this.lessonDialogOkHandler} */>
            <DialogTitle id="form-dialog-title">
              {selectedLessonCard?.lecturerId ? 'Изменить занятие' : 'Создать занятие'}
            </DialogTitle>
            <DialogContent>
              {/* <ValidatorForm
                onError={(errors: any) => console.log(errors)}> */}
                <FormControl fullWidth>
                  <InputLabel id="group-select-label">Группа</InputLabel>
                  <Select
                    labelId="group-select-label"
                    id="group-select"
                    value={lessonCardGroupId}
                    onChange={this.groupSelectedHandler}
                  >
                    {groupList.map(group => {
                      return (
                        <MenuItem
                          key={group.id}
                          value={group.id}>
                          {group.name}
                        </MenuItem>
                    )})}
                  </Select>
                  <input
                    id='groupValidator'
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, height: 0 }}
                    value={lessonCardGroupId ?? ''}
                    onChange={()=>{}}
                    required={true}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="lecturer-select-label">Преподаватель</InputLabel>
                  <Select
                    labelId="lecturer-select-label"
                    id="lecturer-select"
                    value={lessonCardLecturerId}
                    onChange={this.lecturerSelectedHandler}
                  >
                    {lecturerList.map(lecturer => {
                      return (
                        <MenuItem
                          key={lecturer.id}
                          value={lecturer.id}>
                          {lecturer.name}
                        </MenuItem>
                    )})}
                  </Select>
                  <input
                    id='lecturerValidator'
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, height: 0 }}
                    value={lessonCardLecturerId ?? ''}
                    onChange={()=>{}}
                    required={true}
                  />
                </FormControl>
              {/* </ValidatorForm> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.lessonDialogCancelHandler}>
                Отмена
              </Button>
              <Button onClick={this.lessonDialogDeleteHandler}>
                Удалить
              </Button>
              <Button color="primary" onClick={this.lessonDialogOkHandler}>
                {selectedLessonCard?.lecturerId ? 'Обновить' : 'Добавить'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <DigitalWatch/>
        {timeIntervalProgressView}
      </>
    )
  }
}

export default withStyles(styles)(Timetable)