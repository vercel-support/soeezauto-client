import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loading = () => {
    return (
        <div className="loading_indicator">
            <CircularProgress color="secondary" />
        </div>
    );
};

export default Loading;
