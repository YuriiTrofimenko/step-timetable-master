import React, { Component } from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import {inject, observer} from 'mobx-react'
import { HeaderCardStore } from '../../../stores/HeaderCardStore'
import { GroupStore } from '../../../stores/GroupStore'
import { LecturerStore } from '../../../stores/LecturerStore'
import { DayOfWeekStore } from '../../../stores/DayOfWeekStore'
import { TimeIntervalTemplateStore } from '../../../stores/TimeIntervalTemplateStore'
import { Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select/*, TextField */ } from '@material-ui/core'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  dayOfWeekStore: DayOfWeekStore,
  timeIntervalTemplateStore: TimeIntervalTemplateStore,
  headerCardStore: HeaderCardStore,
  groupStore: GroupStore,
  lecturerStore: LecturerStore
}

interface IState {
  lessonDialogOpen: boolean
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
  buttonsBlock: {
    margin: 10
  },
  dayOfWeekButton: {
    width: '100%'
  },
  dayOfWeekButtonActive: {
    width: '100%',
    fontWeight: 'bold'
  },
  cardsCell: {
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    '& span': {
      overflowWrap: 'break-word'
      // hyphens: 'auto'
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
  lessonCard: {
    textAlign: 'center',
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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 11,
  }
})

@inject('dayOfWeekStore', 'timeIntervalTemplateStore', 'headerCardStore', 'groupStore', 'lecturerStore')
@observer
class Templates extends Component<IProps, IState> {
  public intervalID: number
  constructor(props: IProps) {
    super(props)
    this.intervalID = 0
    this.state = {
      lessonDialogOpen: false
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }
  dayOfWeekSelectedHandler = (dayOfWeekNumber: number) => {
    this.injected.dayOfWeekStore.setDayOfWeekNumber(dayOfWeekNumber)
    this.injected.timeIntervalTemplateStore.fetchTemplateIntervalListByDay(dayOfWeekNumber)
  }
  applyTodayHandler = () => {
    this.injected.timeIntervalTemplateStore.applyTemplates()
  }
  lessonCardClickHandler = (intervalRowId: number | null, lessonCardId: number | null) => {
    this.injected.timeIntervalTemplateStore.setSelectedLessonCard(intervalRowId, lessonCardId)
    this.setState({lessonDialogOpen: true})
  }
  lessonDialogClosedHandler = () => {
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalTemplateStore.unsetSelectedLessonCard()
  }
  lessonDialogCancelHandler = () => {
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalTemplateStore.unsetSelectedLessonCard()
  }
  lessonDialogDeleteHandler = () => {
    // this.injected.timeIntervalTemplateStore.deleteLessonCard()
    // this.setState({lessonDialogOpen: false})
    // this.injected.timeIntervalTemplateStore.unsetSelectedLessonCard()
    this.injected.timeIntervalTemplateStore.setLessonCardGroupId('')
    this.injected.timeIntervalTemplateStore.setLessonCardLecturerId('')
    this.injected.timeIntervalTemplateStore.saveLessonCard()
    this.setState({lessonDialogOpen: false})
  }
  lessonDialogOkHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.injected.timeIntervalTemplateStore.saveLessonCard()
    this.setState({lessonDialogOpen: false})
    // this.injected.timeIntervalTemplateStore.unsetSelectedLessonCard()
  }
  groupSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardGroupId = e.target.value
    if (typeof lessonCardGroupId === 'string') {
      this.injected.timeIntervalTemplateStore.setLessonCardGroupId(lessonCardGroupId)
      document?.getElementById('groupValidator')
        ?.setAttribute('value', lessonCardGroupId)
    }
  }
  lecturerSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardLecturerId = e.target.value
    if (typeof lessonCardLecturerId === 'string') {
      this.injected.timeIntervalTemplateStore.setLessonCardLecturerId(lessonCardLecturerId)
      document?.getElementById('lecturerValidator')
        ?.setAttribute('value', lessonCardLecturerId)
    }
  }
  render () {
    const { classes } = this.injected
    const { headerCardList } = this.injected.headerCardStore
    const cardWith =
      ((document.body.clientWidth - 143) / (headerCardList.length + 1)).toFixed(0)
    const cardStyle = {'width': cardWith + 'px'}
    const {
      timeIntervalList,
      selectedLessonCard,
      lessonCardGroupId,
      lessonCardLecturerId
    } = this.injected.timeIntervalTemplateStore
    const { groupList } = this.injected.groupStore
    const { lecturerList } = this.injected.lecturerStore
    const { dayOfWeekModels, selectedDayOfWeekNumber } = this.injected.dayOfWeekStore
    return (
      <>
        <Grid container spacing={3} className={classes.buttonsBlock}>
          {
            dayOfWeekModels.map((day, dayIdx) => (
                <Grid item xs={1} key={dayIdx}>
                  <Button
                      variant='outlined'
                      className={selectedDayOfWeekNumber === day.dayNumber ? classes.dayOfWeekButtonActive : classes.dayOfWeekButton}
                      onClick={() => this.dayOfWeekSelectedHandler(day.dayNumber)}>
                    {day.dayName}
                  </Button>
                </Grid>
            ))
          }
          <Grid item xs={2} key={'applyTodayGridItem'}>
            <Button
                variant='outlined'
                color='primary'
                onClick={this.applyTodayHandler}>
              Применить сегодня
            </Button>
          </Grid>
        </Grid>
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
                  <Card className={classes.card && classes.headerCard} style={cardStyle}>
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
                    className={classes.card}
                    style={cardStyle}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {timeIntervalModel.intervalStart}
                      </Typography>
                      <Typography variant="subtitle1">
                        {timeIntervalModel.intervalEnd}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                {
                  timeIntervalModel.lessonCards.map((lessonCardModel, lessonIdx) => (
                    <Box component='span' key={lessonIdx}>
                      <Card
                        className={classes.lessonCard}
                        style={cardStyle}
                        onClick={() => {
                          this.lessonCardClickHandler(
                              timeIntervalModel.id || null,
                              lessonCardModel.id || null
                          )
                        }}>
                        <CardContent>
                          {/*<Typography variant="caption" display="block">
                            {
                              (lessonCardModel.groupId && lessonCardModel.lecturerId)
                                ? lessonCardModel.audienceNumber
                                : ''
                            }
                          </Typography>*/}
                          <Typography variant="body2" component="p">
                            {groupList.find(group => group.id === lessonCardModel.groupId)?.name}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {
                              lecturerList.find(
                                lecturer => lecturer.id === lessonCardModel.lecturerId
                              )?.name
                            }
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
          <form onSubmit={this.lessonDialogOkHandler}>
            <DialogTitle id="form-dialog-title">
              {selectedLessonCard?.lecturerId ? 'Изменить занятие' : 'Создать занятие'}
            </DialogTitle>
            <DialogContent>
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
                    value={lessonCardGroupId?.toString()}
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
                    value={lessonCardLecturerId?.toString()}
                    onChange={()=>{}}
                    required={true}
                  />
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.lessonDialogCancelHandler}>
                Отмена
              </Button>
              <Button onClick={this.lessonDialogDeleteHandler}>
                Удалить
              </Button>
              <Button type='submit' color="primary">
                {selectedLessonCard?.id ? 'Обновить' : 'Добавить'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    )
  }
}

export default withStyles(styles)(Templates)