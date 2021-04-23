import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {Button, Card, CardContent, Grid, TextField, WithStyles, withStyles} from "@material-ui/core"
import { Send as SendIcon } from "@material-ui/icons"
import { createStyles, Theme } from '@material-ui/core/styles'
import {CommonStore} from '../../stores/CommonStore'
import {UserStore} from '../../stores/UserStore'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
    commonStore: CommonStore,
    userStore: UserStore
}

interface IState {
}

const styles = (theme: Theme) => createStyles({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  signInGrid: {
    minHeight: '100vh'
  },
  card: {
    width: 275
  },
})

@inject("commonStore", "userStore")
// @withRouter
@observer
class AuthForm extends Component<IProps, IState> {

  get injected() {
    return this.props as IInjectedProps
  }

  componentWillUnmount() {
      this.injected.userStore.reset()
  }

  handleUserNameChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const userName = e.target.value
    if (typeof userName === 'string') {
      this.injected.userStore.setUserName(userName)
    }
  }

  handlePasswordChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const password = e.target.value
    if (typeof password === 'string') {
      this.injected.userStore.setPassword(password)
    }
  }

  handleSubmitForm = (e: React.MouseEvent) => {
    e.preventDefault()
    this.injected.userStore.login()
  }

  render () {
    const { loading } = this.injected.commonStore
    const { userName, password } = this.injected.userStore
    const { classes } = this.injected
    return (
        <Grid container
              spacing={0}
              direction='column'
              alignContent='center'
              justify='center'
              className={classes.signInGrid}
        >
            <Grid item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
            >
                <Card className={classes.card}>
                    <CardContent>
                        <form className={classes.root}
                              noValidate
                              autoComplete="off"
                              title="Sign In"
                        >
                            <div>
                                <TextField
                                    id='username'
                                    label='Login'
                                    value={userName}
                                    onChange={this.handleUserNameChange}
                                />
                            </div>
                            <div>
                                <TextField
                                    id='password'
                                    label='Password'
                                    value={password}
                                    type="password"
                                    onChange={this.handlePasswordChange}
                                />
                            </div>
                            <div>
                                <Button
                                    id='signInButton'
                                    variant='outlined'
                                    disabled={loading}
                                    onClick={this.handleSubmitForm}
                                >
                                    Войти
                                    <SendIcon/>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
  }
}

export default withStyles(styles)(AuthForm)