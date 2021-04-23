import { FC } from 'react'

export default class RouteModel {
  public uri: string
  public name: string
  public Component: FC | React.ComponentType<Readonly<any>> | any
  constructor (uri: string, name: string, Component: FC | React.ComponentType<Readonly<any>> | any) {
    this.name = name
    this.uri = uri
    this.Component = Component
  }
}