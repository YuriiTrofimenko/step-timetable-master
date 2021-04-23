import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {GroupStore} from "../../../stores/GroupStore"
import {CommonStore} from "../../../stores/CommonStore"
import {Button, Drawer, Table, TextField, withStyles, WithStyles} from "@material-ui/core"
import { Add as AddIcon, Edit as EditIcon, Send as SendIcon, Delete as DeleteIcon } from "@material-ui/icons"
import { Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {
  commonStore: CommonStore,
  groupStore: GroupStore
}

interface IState {
    sidePanelVisibility: boolean
}

const styles = (theme: Theme) => createStyles({
        title: {
            display: 'inline',
            marginRight: 15
        },
        groupsTable: {
            tableLayout: 'auto',
            borderCollapse: 'collapse',
            '& td': {
                minWidth: 'max-content'
            }
        },
        groupsTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
        groupsTableAbsorbingColumn: {
            width: '100%'
        }
    })

@inject("commonStore", "groupStore")
@observer
class GroupEditor extends Component<IProps, IState> {

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

    handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.groupStore.setName(e.target.value)
    }

    handleGroupAdd = (e: React.MouseEvent) => {
        this.setState({sidePanelVisibility: true})
    }

    handleGroupEdit = (e: React.MouseEvent, groupId: string | null) => {
        this.injected.groupStore.setCurrentGroupId(groupId)
        this.setState({sidePanelVisibility: true})
    }

    handleGroupDelete = (e: React.MouseEvent, groupId: string | null) => {
        this.injected.groupStore.setCurrentGroupId(groupId)
        this.injected.groupStore.deleteGroup()
    }

    handleSubmitForm = (e: React.MouseEvent) => {
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        this.injected.groupStore.saveGroup()
    }

    render () {
        const { loading } = this.injected.commonStore
        const { classes } = this.injected
        return <div>
            <h2 className={classes.title}>Группы</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleGroupAdd}
            >
                <AddIcon/>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <form>
                    <div>
                        <TextField
                            id="name"
                            label={'group name'}
                            value={this.injected.groupStore.name}
                            onChange={this.handleGroupNameChange}
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
            <Table className={classes.groupsTable}>
                <thead>
                <tr className={classes.groupsTableColumnsHeader}>
                    <th data-field="name">название</th>
                    <th className={classes.groupsTableAbsorbingColumn}></th>
                </tr>
                </thead>
                <tbody>
                {this.injected.groupStore.groupList.map((group, index) => {
                    return (
                        <tr key={index}>
                            <td>{group.name}</td>
                            <td>
                                <div>
                                    <Button
                                        onClick={(e) => {
                                            this.handleGroupEdit(e, group.id ?? null)
                                        }}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            this.handleGroupDelete(e, group.id ?? null)
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

export default withStyles(styles)(GroupEditor)