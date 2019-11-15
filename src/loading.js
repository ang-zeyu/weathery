import React from 'react';

const Loading = () => {
    return (
        <div className="loadingscreen">
            <p><i className="fas fa-spin fa-spinner"></i></p>
            <p className="fa-spinnertext">{"      Loading ... "}</p>
        </div>
        );
}

export default Loading;
