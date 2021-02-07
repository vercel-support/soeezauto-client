import React from 'react';
import { Fab, Chip } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { AttachFileOutlined, AddPhotoAlternateOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { UPLOAD_MAX_SIZE } from '../../parameters';

const useStyles = makeStyles(() => ({
    fileInput: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        placeItems: 'center',
        width: '300px',
    },
    chips: {
        display: 'grid',
        gridGap: '10px',
    },
}));

const FormInputFile = (props) => {
    const {
        handleFileSelected,
        name,
        inputId,
        maxFiles,
        isImageOnly,
        isDisabled,
        accept,
        formInputId,
    } = props;
    const classes = useStyles();
    return (
        <div id={formInputId} className={`form_input ${classes.fileInput}`}>
            <label htmlFor={inputId}>
                <Fab
                    id="attach_button"
                    variant="round"
                    component="span"
                    color="primary"
                    disabled={isDisabled}
                >
                    {isImageOnly ? <AddPhotoAlternateOutlined /> : <AttachFileOutlined />}
                </Fab>
            </label>
            <input
                name={name}
                type="file"
                accept={accept.toString()}
                id={inputId}
                style={{ display: 'none' }}
                onChange={handleFileSelected}
                multiple={maxFiles > 1}
            />
            <div className={classes.chips}>
                {maxFiles !== 1 ? <Chip label={`max ${maxFiles}`} /> : null}
                <Chip label={accept.toString()} />
                <Chip
                    label={
                        maxFiles === 1
                            ? `max ${UPLOAD_MAX_SIZE / 1000000} Mb`
                            : `max ${UPLOAD_MAX_SIZE / 1000000} Mb cada`
                    }
                />
            </div>
        </div>
    );
};

FormInputFile.propTypes = {
    handleFileSelected: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    maxFiles: PropTypes.number.isRequired,
    formInputId: PropTypes.string,
    isImageOnly: PropTypes.bool,
    isDisabled: PropTypes.bool.isRequired,
    accept: PropTypes.array.isRequired,
};

export default FormInputFile;
