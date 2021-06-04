import React from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
} from '@material-ui/core/';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Countdown from 'react-countdown';
import PropTypes from 'prop-types';
import styles from 'styles/notifierDialog';
import { REDIRECT_TIMER } from 'parameters';

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.title}>
            <Typography variant="h6" className={classes.h6}>
                {children}
            </Typography>
        </MuiDialogTitle>
    );
});

const renderer = ({ seconds, completed }) => {
    if (completed) {
        return null;
    }
    return <Typography variant="h4">{seconds}</Typography>;
};

class NotifierDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    errors = () => {
        const errors = this.props.notification.errors;
        if (errors.length > 0) {
            const output = errors.map((error) => {
                const key = Object.keys(error)[0];
                return <li key={`${key} - ${error[key]}`}>{error[key]}</li>;
            });
            return <ul>{output}</ul>;
        }
        return null;
    };

    actions = () => {
        const { classes } = this.props;
        switch (this.props.notification.status) {
            case 'ok_and_dismiss':
                return (
                    <Button
                        id="dismiss_notification"
                        onClick={this.props.handleNotificationDismiss}
                        color="primary"
                        autoFocus
                    >
                        Fermer
                    </Button>
                );
            case 'error':
                return (
                    <Button
                        id="dismiss_notification"
                        onClick={this.props.handleNotificationDismiss}
                        color="primary"
                        autoFocus
                    >
                        Fermer
                    </Button>
                );
            case 'show_session_expire_warning':
                return (
                    <>
                        <Button
                            id="session_expire"
                            onClick={this.props.handleSessionWarning}
                            color="primary"
                        >
                            Terminer session
                        </Button>
                        <Button
                            id="session_extend"
                            className={classes.buttonLeft}
                            onClick={this.props.handleSessionWarning}
                            color="primary"
                            autoFocus
                        >
                            Continuer session
                        </Button>
                    </>
                );
            case 'show_logout_idle_message':
                return (
                    <Button
                        id="session_logout"
                        onClick={this.props.handleSessionWarning}
                        color="primary"
                        autoFocus
                    >
                        Fermer
                    </Button>
                );
            case 'confirm':
                return (
                    <>
                        <Button
                            id="cancelled"
                            className={classes.buttonLeft}
                            variant="outlined"
                            color="primary"
                            onClick={this.props.handleNotificationDismiss}
                        >
                            Annuler
                        </Button>
                        <Button
                            id="confirmed"
                            variant="outlined"
                            color="primary"
                            onClick={this.props.handleNotificationDismiss}
                        >
                            Confirmer
                        </Button>
                    </>
                );
            case 'redirect':
                return (
                    <Countdown date={Date.now() + REDIRECT_TIMER} renderer={renderer} />
                );
            default:
                return null;
        }
    };

    render() {
        const { classes } = this.props;
        if (this.props.notification.status !== '') {
            return (
                <Dialog
                    className={classes.paperFullWidth}
                    open={this.state.open}
                    fullWidth
                >
                    <DialogTitle>{this.props.notification.title}</DialogTitle>
                    <DialogContent className={classes.content}>
                        <div>{this.props.notification.message}</div>
                        {this.errors()}
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        {this.actions()}
                    </DialogActions>
                </Dialog>
            );
        }
        return null;
    }
}

NotifierDialog.propTypes = {
    notification: PropTypes.object.isRequired,
    handleNotificationDismiss: PropTypes.func,
    handleSessionWarning: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotifierDialog);
