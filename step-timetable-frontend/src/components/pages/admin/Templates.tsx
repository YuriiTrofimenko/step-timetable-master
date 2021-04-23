import React, { Component } from 'react'
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import {inject, observer} from 'mobx-react'
import { HeaderCardStore } from '../../../stores/HeaderCardStore'
import { TimeIntervalStore } from '../../../stores/TimeIntervalStore'
import { GroupStore } from '../../../stores/GroupStore'
import { LecturerStore } from '../../../stores/LecturerStore'
import { Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select/*, TextField */ } from '@material-ui/core'
// import dateTimeFormatter from 'date-and-time'
// import LessonCardModel from '../../../models/LessonCardModel'

// type for the explicitly provided props only
interface IProps {}

// type for the injected and explicitly provided props
interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  headerCardStore: HeaderCardStore,
  timeIntervalStore: TimeIntervalStore,
  groupStore: GroupStore,
  lecturerStore: LecturerStore
}

interface IState {
  lessonDialogOpen: boolean,
  currentTemplateId: number | null
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
      margin: 0,
      flexGrow: 1,
      display: 'flex'
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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 11,
  }
})

@inject('headerCardStore', 'timeIntervalStore', 'groupStore', 'lecturerStore')
@observer
class Templates extends Component<IProps, IState> {
  public intervalID: number
  constructor(props: IProps) {
    super(props)
    this.intervalID = 0
    this.state = {
      lessonDialogOpen: false,
      currentTemplateId: null
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }
  componentDidMount () {
    // this.injected.headerCardStore.fetchHeaderCardList()
    // this.injected.timeIntervalStore.fetchTimeIntervalList()
    // this.injected.groupStore.fetchGroupList()
    // this.injected.lecturerStore.fetchLecturerList()
  }
  lessonCardClickHandler = (intervalRowId: number | null, lessonCardId: number | null) => {
    this.injected.timeIntervalStore.setSelectedLessonCard(intervalRowId, lessonCardId)
    this.setState({lessonDialogOpen: true})
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
  lessonDialogOkHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.injected.timeIntervalStore.saveLessonCard()
    this.setState({lessonDialogOpen: false})
    this.injected.timeIntervalStore.unsetSelectedLessonCard()
  }
  groupSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardGroupId = e.target.value
    if (typeof lessonCardGroupId === 'string') {
      this.injected.timeIntervalStore.setLessonCardGroupId(lessonCardGroupId)
      document?.getElementById('groupValidator')
        ?.setAttribute('value', lessonCardGroupId)
    }
  }
  lecturerSelectedHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    const lessonCardLecturerId = e.target.value
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
                    className={(this.injected.timeIntervalStore.currentTimeIntervalId === timeIntervalModel.id) ? classes.currentTimeIntervalCard : classes.card}
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
                          this.lessonCardClickHandler(timeIntervalModel.id || null, lessonCardModel.id || null)
                        }}>
                        <CardContent>
                          <Typography variant="caption" display="block">
                            {(lessonCardModel.groupId && lessonCardModel.lecturerId) ? lessonCardModel.audienceNumber : ''}
                          </Typography>
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
          <form onSubmit={this.lessonDialogOkHandler}>
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
              {/* </ValidatorForm> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.lessonDialogCancelHandler}>
                Отмена
              </Button>
              <Button onClick={this.lessonDialogDeleteHandler}>
                Удалить
              </Button>
              <Button type='submit' color="primary">
                {selectedLessonCard?.lecturerId ? 'Обновить' : 'Добавить'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    )
  }
}

export default withStyles(styles)(Templates)