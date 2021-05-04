import React, {Component} from 'react'
import {
  Router,
  Route
} from 'react-router-dom'
import {Theme, withStyles, WithStyles, createStyles} from '@material-ui/core/styles'
import history from '../history'
import {CommonStore} from '../stores/CommonStore'
import { RouterStore } from '../stores/RouterStore'
import { UserStore } from '../stores/UserStore'
import {AppBar, Toolbar, Typography, Container, Modal, Collapse, Snackbar} from '@material-ui/core'
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { inject, observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import AppBarCollapse from './common/AppBarCollapse'
import { reaction } from 'mobx'
import {Alert} from '@material-ui/lab'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  commonStore: CommonStore,
  routerStore: RouterStore,
  userStore: UserStore
}

interface IState {
  visibility: boolean
}

const styles = (theme: Theme) => createStyles({
        root: {
            flexGrow: 1,
        },
        container: {
            maxWidth: '40000px',
            '& .page' : {
                position: 'static'
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        navBar: {
            color: '#fff',
            backgroundColor: '#0a95dd',
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalContent: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        closeButton: {
            cursor:'pointer',
            float:'right',
            marginTop: '-80px',
            marginRight: '-25px',
        },
        toggleButton: {
          position: 'sticky',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)'
        }
    })

@inject('routerStore', 'commonStore', 'userStore')
@observer
class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      visibility: false
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }
  componentDidMount () {
      this.injected.userStore.check()
  }
  userReaction = reaction(
    () => this.injected.userStore.user,
    (user) => {
      if (user) {
          history.replace('/')
          this.injected.routerStore.setLoggedRoutes()
      } else {
          history.replace('/signin')
          this.injected.routerStore.setAnonymousRoutes()
      }
    }
  )
    /* routeReaction = reaction(
        () => this.injected.routerStore.routes,
        (route) => {
            this.toggleVisibilityHandler()
        }
    ) */
  handleErrorModalClose = () => {
    this.injected.commonStore.setError(null)
  }
  toggleVisibilityHandler = () => {
    this.setState({ visibility: !this.state.visibility });
  }
    handleSnackBarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.injected.commonStore.setSnackbarText('')
        this.injected.commonStore.setSnackbarSeverity('success')
    }
  render () {
    const { routes } = this.injected.routerStore
    const { classes } = this.injected
    history.listen(location => {
      if (location.pathname === '/auth:out') {
        this.injected.userStore.logout()
      }
    })
    let toggleButton
    if (!this.state.visibility) {
      toggleButton = <ExpandMore
        className={classes.toggleButton}
        onClick={this.toggleVisibilityHandler}
        />
    } else {
      toggleButton = <ExpandLess
        className={classes.toggleButton}
        onClick={this.toggleVisibilityHandler}
        />
    }
    return (
      <Router history={history}>
        <div className={classes.root}>
          <Collapse in={this.state.visibility}>
            <AppBar position='sticky' className={classes.navBar}>
                <Toolbar>
                    <Typography variant='h6' className={classes.title}>
                        ШАГ - Расписание
                    </Typography>
                    <AppBarCollapse
                        routes={routes}
                        userStore={this.injected.userStore}
                    />
                </Toolbar>
            </AppBar>
          </Collapse>
          { toggleButton }
          <Container maxWidth="sm" className={classes.container}>
              {routes.map(({ uri, Component }) => (
                  <Route key={uri} exact path={uri}>
                      {({ match }) => (
                          <CSSTransition
                              in={match != null}
                              timeout={300}
                              classNames='page'
                              unmountOnExit
                          >
                              <div className='page'>
                                  <Component />
                              </div>
                          </CSSTransition>
                      )}
                  </Route>
              ))}
          </Container>
          <Modal
              open={ !!this.injected.commonStore.error }
              onClose={ this.handleErrorModalClose }
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className={classes.modal}
          >
              <div id='errorBlock' className={classes.modalContent}>
                  {this.injected.commonStore.error}
              </div>
          </Modal>
            <Snackbar
                open={Boolean(this.injected.commonStore.snackbarText)}
                autoHideDuration={6000} onClose={this.handleSnackBarClose}>
                <Alert onClose={this.handleSnackBarClose} severity={this.injected.commonStore.snackbarSeverity}>
                    {this.injected.commonStore.snackbarText}
                </Alert>
            </Snackbar>
        </div>
      </Router>
    )
  }
}

export default withStyles(styles)(App)
