import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {Box, LinearProgress, Typography, WithStyles, withStyles} from "@material-ui/core"
import { createStyles, Theme } from '@material-ui/core/styles'
import dateTimeFormatter from 'date-and-time'
import {CommonStore} from '../../../stores/CommonStore'
import { TimeIntervalStore } from '../../../stores/TimeIntervalStore'
import {reaction} from 'mobx'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
    commonStore: CommonStore,
    timeIntervalStore: TimeIntervalStore
}

interface IState {
  currentDate: Date,
  progress: number,
  timeLeft: string
}

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 15,
    width: '30%',
    height: 120,
    backgroundColor: 'transparent',
    color: '#000',
    /*opacity: 0,*/
    textAlign: 'left',
    padding: 15
  },
  boxContent: {
    width: '100%'
  },
  currentTimeIntervalInfo: {
    fontSize: '1rem',
    lineHeight: 1,
    marginBottom: 10
  },
  currentTimeProgress: {
    height: 10,
    backgroundColor: 'lightgray',
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#0a95dd'
    }
  }
})

@inject("commonStore", "timeIntervalStore")
@observer
class TimeIntervalProgress extends Component<IProps, IState> {
  // public intervalID: number
  private isComponentMounted: boolean
  constructor(props: IProps) {
    super(props)
    // this.intervalID = 0
    this.isComponentMounted = false
    this.state = {
      currentDate: new Date(),
      progress: 0,
      timeLeft: ''
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }
  toHHMMSS (secs: string) {
    const sec_num = parseInt(secs, 10)
    const hours   = Math.floor(sec_num / 3600)
    const minutes = Math.floor(sec_num / 60) % 60
    const seconds = Math.floor(sec_num % 60)
    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        // .filter((v,i) => v !== "00" || i > 0)
        // .join(":")
  }

  timeStampReaction = reaction(
      () => this.injected.timeIntervalStore.timeStamp,
      (timeStamp: number) => {
        if (this.isComponentMounted) {
          const currentDate = new Date(timeStamp)
          this.setState({currentDate: currentDate})
          const currentTimeInterval =
              this.injected.timeIntervalStore.timeIntervalList.find(timeInterval => timeInterval.id === this.injected.timeIntervalStore.currentTimeIntervalId)
          if (currentTimeInterval) {
            const timePassed =
                dateTimeFormatter.subtract(
                    dateTimeFormatter.parse(`${dateTimeFormatter.format(this.state.currentDate, 'H')}:${dateTimeFormatter.format(this.state.currentDate, 'mm')}`, 'H:mm'),
                    new Date(dateTimeFormatter.parse(currentTimeInterval.intervalStart, 'H:mm'))
                )
            const progress = timePassed.toMinutes() * 100 / 80
            this.setState({'progress': progress})
            const timeLeft =
                dateTimeFormatter.subtract(
                    new Date(dateTimeFormatter.parse(currentTimeInterval.intervalEnd, 'H:mm')),
                    dateTimeFormatter.parse(`${dateTimeFormatter.format(this.state.currentDate, 'H')}:${dateTimeFormatter.format(this.state.currentDate, 'mm')}`, 'H:mm')
                )
            const timeLeftSeconds = timeLeft.toSeconds()
            const timeLeftHHMMSSArray = this.toHHMMSS(timeLeftSeconds.toString())
            this.setState({'timeLeft': `${timeLeftHHMMSSArray[0]} ч ${timeLeftHHMMSSArray[1]} мин`})
          } else {
            this.setState({'progress': 0})
          }
        }
      }
  )

  /* componentDidMount() {
    this.intervalID = window.setInterval(
      () => {
        this.setState({currentDate: new Date()})
        // this.setState({progress: this.injected.timeIntervalStore.lastTimeIntervalId * 100 / this.injected.timeIntervalStore.timeIntervalList.length})
        const currentTimeInterval =
          this.injected.timeIntervalStore.timeIntervalList.find(timeInterval => timeInterval.id === this.injected.timeIntervalStore.currentTimeIntervalId)
        if (currentTimeInterval) {
          const timePassed =
            dateTimeFormatter.subtract(
              dateTimeFormatter.parse(`${dateTimeFormatter.format(this.state.currentDate, 'H')}:${dateTimeFormatter.format(this.state.currentDate, 'mm')}`, 'H:mm'),
              new Date(dateTimeFormatter.parse(currentTimeInterval.intervalStart, 'H:mm'))
            )
          const progress = timePassed.toMinutes() * 100 / 80
          this.setState({'progress': progress})
          const timeLeft =
            dateTimeFormatter.subtract(
              new Date(dateTimeFormatter.parse(currentTimeInterval.intervalEnd, 'H:mm')),
              dateTimeFormatter.parse(`${dateTimeFormatter.format(this.state.currentDate, 'H')}:${dateTimeFormatter.format(this.state.currentDate, 'mm')}`, 'H:mm')
            )
          const timeLeftSeconds = timeLeft.toSeconds()
          const timeLeftHHMMSSArray = this.toHHMMSS(timeLeftSeconds.toString())
          this.setState({'timeLeft': `${timeLeftHHMMSSArray[0]} ч ${timeLeftHHMMSSArray[1]} мин`})
        } else {
          this.setState({'progress': 0})
        }
      },
      1000
    )
  } */
  componentDidMount() {
    this.isComponentMounted = true
  }
  componentWillUnmount() {
    this.isComponentMounted = false
  }
  render () {
    const { classes } = this.injected
    return (
        <div className={classes.root}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%">
            <div className={classes.boxContent}>
              <Typography
                variant="overline"
                display="block"
                className={classes.currentTimeIntervalInfo}>
                {`идет ${this.injected.timeIntervalStore.currentTimeIntervalNumber} пара / до окончания осталось: ${this.state.timeLeft}`}
              </Typography>
              <LinearProgress variant="determinate" value={this.state.progress} className={classes.currentTimeProgress}/>
            </div>
          </Box>
        </div>
    )
  }
}

export default withStyles(styles)(TimeIntervalProgress)