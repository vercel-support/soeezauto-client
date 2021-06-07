import React from 'react';
import { Box } from '@material-ui/core/';
import { Close } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    notifier: {
        margin: '20px auto',
        maxWidth: '500px',
        minHeight: '100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '95% 5%',
        padding: '10px',
        textAlign: 'center',
        '& div': {
            alignSelf: 'center',
            fontWeight: 700,
        },
        '& .notifierAction': {
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,180px))',
            justifyContent: 'space-around',
            borderRadius: '5px',
            margin: '10px 0',
            [theme.breakpoints.down('xs')]: {
                justifyContent: 'center',
            },
            '& >button': {
                margin: '10px 0',
            },
        },
        '& svg': {
            cursor: 'pointer',
        },
        '& p': {
            lineHeight: '1.5rem',
        },
    },
});

class NotifierInline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
            isNotClosable: false,
        };
    }

    componentDidMount() {
        this.updateState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateState();
        }
    }

    updateState = () => {
        if (this.props.isNotClosable) {
            this.setState({ isNotClosable: true });
        }
    };

    handleClose = () => {
        this.setState({ isActive: false });
    };

    render() {
        const { message, classes, severity = 'info' } = this.props;
        const { isActive, isNotClosable } = this.state;
        if (isActive) {
            return (
                <Box
                    className={classes.notifier}
                    color={`${severity}.contrastText`}
                    bgcolor={`${severity}.A200`}
                >
                    <div>{message}</div>
                    {!isNotClosable ? (
                        <Close
                            color="inherit"
                            onClick={this.handleClose}
                            aria-label="Close"
                        />
                    ) : null}
                </Box>
            );
        }
        return null;
    }
}

NotifierInline.propTypes = {
    message: PropTypes.any.isRequired,
    isNotClosable: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    severity: PropTypes.string,
};

export default withStyles(styles)(NotifierInline);
