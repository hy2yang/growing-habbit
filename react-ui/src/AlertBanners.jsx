import React from 'react';
import { Alert } from 'antd';
import 'antd/lib/alert/style/css';

function AlertBanners (alert, error, onCloseAlert, onCloseError){

  let errorBanner = error? 'errorBanner':'errorBanner hidden';
  let alertBanner = alert? 'alertBanner':'alertBanner hidden';

  return (
    <div className='banner'>
      <div className={errorBanner} onClick={onCloseError}>
        <Alert message={error} type='error' banner />
      </div>
      <div className={alertBanner} onClick={onCloseAlert}>
        <Alert message={alert} type='warning' banner />
      </div>
    </div>
  );

}

export default AlertBanners;