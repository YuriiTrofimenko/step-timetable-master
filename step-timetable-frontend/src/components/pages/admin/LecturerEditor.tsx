import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {LecturerStore} from "../../../stores/LecturerStore"
import {CommonStore} from "../../../stores/CommonStore"
import {Button, Drawer, Table, TextField, withStyles, WithStyles} from "@material-ui/core"
import { Add as AddIcon, Edit as EditIcon, Send as SendIcon, Delete as DeleteIcon } from "@material-ui/icons"
import { Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  commonStore: CommonStore,
  lecturerStore: LecturerStore
}

interface IState {
    sidePanelVisibility: boolean
}

const styles = (theme: Theme) => createStyles({
        title: {
            display: 'inline',
            marginRight: 15
        },
        lecturersTable: {
            tableLayout: 'auto',
            borderCollapse: 'collapse',
            '& td': {
                minWidth: 'max-content'
            }
        },
        lecturersTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
        lecturersTableAbsorbingColumn: {
            width: '100%'
        }
    })

@inject("commonStore", "lecturerStore")
@observer
class LecturerEditor extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            sidePanelVisibility: false
        }
    }

    get injected() {
      return this.props as IInjectedProps
    }

    toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        this.setState({sidePanelVisibility: open})
    }

    handleLecturerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.lecturerStore.setName(e.target.value)
    }

    handleLecturerAdd = (e: React.MouseEvent) => {
        this.setState({sidePanelVisibility: true})
    }

    handleLecturerEdit = (e: React.MouseEvent, lecturerId: string | null) => {
        this.injected.lecturerStore.setCurrentLecturerId(lecturerId)
        this.setState({sidePanelVisibility: true})
    }

    handleLecturerDelete = (e: React.MouseEvent, lecturerId: string | null) => {
        this.injected.lecturerStore.setCurrentLecturerId(lecturerId)
        this.injected.lecturerStore.deleteLecturer()
    }

    handleSubmitForm = (e: React.MouseEvent) => {
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        this.injected.lecturerStore.saveLecturer()
    }

    render () {
        const { loading } = this.injected.commonStore
        const { classes } = this.injected
        return <div>
            <h2 className={classes.title}>Преподаватели</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleLecturerAdd}
            >
                <AddIcon/>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <form>
                    <div>
                        <TextField
                            id="name"
                            label={'имя отчество'}
                            value={this.injected.lecturerStore.name}
                            onChange={this.handleLecturerNameChange}
                        />
                    </div>
                    <div>
                        <Button
                            disabled={loading}
                            onClick={this.handleSubmitForm}
                        >
                            <SendIcon/>
                        </Button>
                    </div>
                </form>
            </Drawer>
            <Table className={classes.lecturersTable}>
                <thead>
                <tr className={classes.lecturersTableColumnsHeader}>
                    <th data-field="name">имя</th>
                    <th className={classes.lecturersTableAbsorbingColumn}></th>
                </tr>
                </thead>
                <tbody>
                {this.injected.lecturerStore.lecturerList.map((lecturer, index) => {
                    return (
                        <tr key={index}>
                            <td>{lecturer.name}</td>
                            <td>
                                <div>
                                    <Button
                                        onClick={(e) => {
                                            this.handleLecturerEdit(e, lecturer.id ?? null)
                                        }}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            this.handleLecturerDelete(e, lecturer.id ?? null)
                                        }}>
                                        <DeleteIcon/>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    }
}

export default withStyles(styles)(LecturerEditor)