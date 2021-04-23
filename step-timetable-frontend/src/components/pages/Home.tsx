import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
// import { /* withRouter,*/ RouteComponentProps } from "react-router-dom"
import {CommonStore} from "../../stores/CommonStore"
import {UserStore} from "../../stores/UserStore"

/* interface MatchParams {
    out: string
} */

interface IProps {}

interface IInjectedProps extends /* RouteComponentProps<MatchParams>, */ IProps {
  commonStore: CommonStore,
  userStore: UserStore
}

interface IState {
}

@inject("commonStore", "userStore")
@observer
class Home extends Component <IProps, IState> {
  get injected() {
    return this.props as IInjectedProps
  }
  /* componentDidMount() {
    console.log('match', this.injected.match.params)
      if (this.injected.match && this.injected.match.params.out) {
          this.injected.userStore.logout()
      }
  } */
  render () {
      return (
          <div>
              <h1>Home Page</h1>
              <div>Home Page Content: {this.injected.commonStore.loading ? this.injected.commonStore.error : 'no errors'}</div>
          </div>
      )
  }
}

export default Home