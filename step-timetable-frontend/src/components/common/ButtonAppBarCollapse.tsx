import React, {Component} from "react"
import { withStyles } from "@material-ui/core/styles"
import {createStyles, Menu, Theme, WithStyles} from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from '@material-ui/icons/Menu'

interface IProps {
    children: any
}

interface IInjectedProps extends WithStyles<typeof styles>, IProps {}

interface IState {
    anchorEl: any
}

const styles = (theme: Theme) => createStyles({
    buttonCollapse: {
        /* [theme.breakpoints.up("sm")]: {
            display: "none"
        }, */
        margin: "10px",
        boxShadow: "none"
    }
})

class ButtonAppBarCollapse extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }
    get injected() {
      return this.props as IInjectedProps
    }
    handleMenu = (e: React.MouseEvent) => {
      this.setState({ anchorEl: e.currentTarget })
    }
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    render() {
        const { classes } = this.injected
        const { anchorEl } = this.state
        const open = Boolean(anchorEl)

        return (
            <div className={classes.buttonCollapse}>
                <IconButton onClick={this.handleMenu} edge='start' color='inherit' aria-label='menu'>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={open}
                    onClose={this.handleClose}
                    onClick={this.handleClose}
                >
                    {this.props.children}
                </Menu>
            </div>
        )
    }
}
export default withStyles(styles)(ButtonAppBarCollapse)