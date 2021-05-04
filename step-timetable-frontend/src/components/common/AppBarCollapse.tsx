import React, {Component} from "react"
import {createStyles, MenuItem} from "@material-ui/core"
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles"
import ButtonAppBarCollapse from "./ButtonAppBarCollapse"
import {
    NavLink
} from 'react-router-dom'
import {inject, observer} from "mobx-react"
import {UserStore} from '../../stores/UserStore'
import RouteModel from "../../models/RouteModel"

interface IProps {
    routes: Array<RouteModel>,
    userStore: UserStore
}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {}

interface IState {
  
}

const styles = (theme: Theme) => createStyles({
    root: {
        position: "absolute",
        right: 0,
    },
    buttonBar: {
        /* [theme.breakpoints.down("xs")]: {
            display: "none"
        }, */
        margin: "10px",
        paddingLeft: "16px",
        right: "10px",
        position: "relative",
        width: "100%",
        background: "transparent",
        display: "inline"
    },
    buttonBarItem: {
        webkitTransition: 'background-color .3s',
        transition: 'background-color .3s',
        fontSize: '1rem',
        color: '#fff',
        padding: '15px',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    buttonBarCollapseItem: {
      webkitTransition: 'background-color .3s',
      transition: 'background-color .3s',
      fontSize: '1rem',
      color: '#fff',
      padding: '15px',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    buttonBarItemActive: {
        backgroundColor: '#ea454b',
    },
    mobileButtonBarItem: {
      webkitTransition: 'background-color .3s',
      transition: 'background-color .3s',
      fontSize: '1rem',
      color: '#000',
      padding: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    mobileButtonBarItemActive: {
        /*backgroundColor: '#ccc',*/
        fontWeight: 'bold'
    }
})

@inject('userStore')
@observer
class AppBarCollapse extends Component<IProps, IState> {
    get injected() {
      return this.props as IInjectedProps
    }
    render() {
        const { classes } = this.injected
        const { routes } = this.props
        return (
          <>
            <div className={classes.root}>
                <ButtonAppBarCollapse>
                {routes.map(route => {
                  return <MenuItem key={route.uri}>
                      <NavLink
                          /* as={NavLink} */
                          to={route.uri}
                          className={classes.mobileButtonBarItem}
                          activeClassName={classes.mobileButtonBarItemActive}
                          exact
                      >
                          {route.name}
                      </NavLink>
                  </MenuItem>
                })}
                </ButtonAppBarCollapse>
                {/* <div className={classes.buttonBar} id="appbar-collapse">
                    {routes.map(route => {
                        if(!/^Dashboard[A-z]+$/.test(route.name)) {
                            return <NavLink
                                    key={route.path}
                                    as={NavLink}
                                    to={route.path}
                                    // можно указать в двойных кавычках имя
                                    // класса стиля, описанного в css
                                    className={classes.buttonBarItem}
                                    // , а в данном случае создается экранирование
                                    // фигурными скобками, и внутри него
                                    // указывается имя класса стиля,
                                    // определенного в константе styles
                                    activeClassName={classes.buttonBarItemActive}
                                    exact>
                                    {route.name}
                                </NavLink>
                        } else {
                            return ''
                        }
                    })}
                </div> */}
            </div>
          </>
        )
    }
}

export default withStyles(styles)(AppBarCollapse)