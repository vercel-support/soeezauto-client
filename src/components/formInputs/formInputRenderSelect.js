/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, InputLabel, FormHelperText, FormControl } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    formControl: {
        textAlign: 'left',
        // margin: theme.spacing(1),
        '& .MuiSelect-root optgroup': {
            textTransform: 'uppercase',
        },
        '& .MuiSelect-root option': {
            marginLeft: '20px',
        },
    },
    selectEmpty: {
        marginTop: theme.spacing(1) * 2,
    },
});

class RenderSelect extends React.Component {
    render() {
        const {
            classes,
            id,
            input,
            label,
            disabled,
            native,
            helperText,
            meta: { touched, error },
            children,
            placeholder,
            ...custom
        } = this.props;
        const isNative = native || false;
        return (
            <>
                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        native={isNative}
                        id={id}
                        label={label}
                        disabled={disabled}
                        placeholder={placeholder}
                        {...input}
                        onChange={(value) => input.onChange(value)}
                        {...custom}
                    >
                        {children}
                    </Select>

                    <FormHelperText>{helperText}</FormHelperText>
                    <span className="form_error">{touched ? error : ''}</span>
                </FormControl>
            </>
        );
    }
}

RenderSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.any,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
    placeholder: PropTypes.any,
    native: PropTypes.bool,
};

export default withStyles(styles)(RenderSelect);
