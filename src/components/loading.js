import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loading = () => {
    return (
        <div className="loading_indicator">
            <CircularProgress color="primary" />
        </div>
    );
};

export default Loading;
