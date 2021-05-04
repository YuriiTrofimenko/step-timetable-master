import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import {ErrorBoundary} from 'react-error-boundary'
import routerStore from './stores/RouterStore'
import commonStore from './stores/CommonStore'
import userStore from './stores/UserStore'
import headerCardStore from './stores/HeaderCardStore'
import timeIntervalStore from './stores/TimeIntervalStore'
import groupStore from './stores/GroupStore'
import lecturerStore from './stores/LecturerStore'
import dayOfWeekStore from './stores/DayOfWeekStore'
import timeIntervalTemplateStore from './stores/TimeIntervalTemplateStore'
import './index.css'
import App from './components/App'
import reportWebVitals from './reportWebVitals'

// in-memory local storage module list for injections
const stores = {
  routerStore,
  commonStore,
  userStore,
  headerCardStore,
  timeIntervalStore,
  groupStore,
  lecturerStore,
  dayOfWeekStore,
  timeIntervalTemplateStore
}

ReactDOM.render(
  <React.StrictMode>
    {/* providing of in-memory local storage modules */}
    <Provider {...stores}>
      <ErrorBoundary
        FallbackComponent={() => <App/>}
        onError={(error: Error, info: {componentStack: string}) => {
          console.log(error, info.componentStack)
        }}
        >
        <App/>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
