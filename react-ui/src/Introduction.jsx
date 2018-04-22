import React from 'react';

class Introduction extends React.Component {
    render() {
      return (
        <div>
            <p>{'This is a lifestyle SPA that tracks and shares your development of new habits.'}</p>
            <br/>
            <p>{'Rules :'}</p>
            <br/>
            <p>{'1. Logged in or not, any user can browse shared habits'}</p>
            <br/>
            <p>{'2. After logging in, a user can cheer once for each habit'}</p>
            <br/>
            <p>{'3. After logging in, a user has all permissions on his/her own habits: browser/add/checkin/finish/delete'}</p>
            <br/>
            <p>{'4. Once per day, user can check in a habit to record one more day developing the habit'}</p>
            <br/>
            <p>{'5. Finishing a habit will render it \'finished\', restart a habit will reset the progress'}</p>
            <br/>
            <p>{'6. The percentage in the progress bar is based on studies that it took 66 days to develop a habit, or you can finish it to set the progress to 100%'}</p>
            <br/>
            <p>{'7. Deletion of a habit is unrecoverable'}</p>
            <br/>
        </div>
      );
    }
}

export default Introduction;

