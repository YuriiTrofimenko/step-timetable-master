import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {/* Button, Card, CardContent, Grid, Icon, TextField, */ Typography, WithStyles, withStyles} from "@material-ui/core"
import { createStyles, Theme } from '@material-ui/core/styles'
import dateTimeFormatter from 'date-and-time'
import {CommonStore} from '../../../stores/CommonStore'
import {UserStore} from '../../../stores/UserStore'
import {TimeIntervalStore} from '../../../stores/TimeIntervalStore'
import {reaction} from 'mobx'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
    commonStore: CommonStore,
    timeIntervalStore: TimeIntervalStore,
    userStore: UserStore
}

interface IState {
  currentDate: Date
}

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 390,
    height: 120,
    backgroundColor: '#0a95dd',
    color: '#fff',
    opacity: '50%',
    textAlign: 'center',
    padding: 15
    /* '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    }, */
  },
  dateInfo: {
    fontSize: '1rem',
    lineHeight: 1,
    margin: 5
  },
  timeInfo: {
    fontSize: '2.5rem'
  }
})

@inject("commonStore", "userStore", 'timeIntervalStore')
@observer
class DigitalWatch extends Component<IProps, IState> {
  // public intervalID: number
  private isComponentMounted: boolean
  constructor(props: IProps) {
    super(props)
    // this.intervalID = 0
    this.isComponentMounted = false
    this.state = {
      currentDate: new Date()
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
          this.setState({currentDate: currentDate})
        }
      }
  )
  componentDidMount() {
    this.isComponentMounted = true
  }
  /* componentWillUnmount() {
    window.clearInterval(this.intervalID)
  } */
  componentWillUnmount() {
    this.isComponentMounted = false
  }
  render () {
    // const { loading } = this.injected.commonStore
    const { classes } = this.injected
    const currentDate = this.state.currentDate
    const daysOfWeek = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ]
    const currentDayOfWeekName = daysOfWeek[currentDate.getDay()]
    /* const currentYearNumeric =
      new Intl.DateTimeFormat('default', { year: 'numeric' }).format(currentDate)
    const currentMonthNumeric =
      new Intl.DateTimeFormat('default', { month: '2-digit' }).format(currentDate)
    const currentDayOfMonthNumeric =
      new Intl.DateTimeFormat('default', { day: '2-digit' }).format(currentDate) */
    const currentDateFormatted = dateTimeFormatter.format(currentDate, 'DD/MM/YYYY')
      // `${currentDayOfMonthNumeric}/${currentMonthNumeric}/${currentYearNumeric}`
    /* const currentHourNumeric =
      new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false }).format(currentDate)
    const currentMinuteNumeric =
      new Intl.DateTimeFormat('en-GB', { minute: '2-digit', hour12: false }).format(currentDate)
    const currentSecondNumeric =
      new Intl.DateTimeFormat('en-GB', { second: '2-digit', hour12: false }).format(currentDate) */
    const currentTimeFormatted = dateTimeFormatter.format(currentDate, 'H:mm:ss')
      // `${currentHourNumeric}:${currentMinuteNumeric}:${currentSecondNumeric}`
    return (
        <div className={classes.root}>
          <Typography
            variant="overline"
            display="block"
            className={classes.dateInfo}>
            {currentDayOfWeekName}
          </Typography>
          <Typography
            variant="overline"
            display="block"
            gutterBottom
            className={classes.dateInfo}>
            {currentDateFormatted}
          </Typography>
          <Typography
            variant="h4"
            className={classes.timeInfo}
            >
            {currentTimeFormatted}
          </Typography>
        </div>
    )
  }
}

export default withStyles(styles)(DigitalWatch)