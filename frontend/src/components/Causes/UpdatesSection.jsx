import React from 'react';
import styles from './UpdatesSection.module.css';

const UpdatesSection = () => {
    const updates = [
        { id: 1, text: 'We successfully completed our beach cleanup event!', image: 'update1.png' },
        { id: 2, text: 'New partnership with Oceanic Society to protect coral reefs.', image: 'update2.png' },
        { id: 1, text: 'We successfully completed our beach cleanup event!', image: 'update1.png' },
        { id: 2, text: 'New partnership with Oceanic Society to protect coral reefs.', image: 'update2.png' }
    ];

    return (
        <div className={styles.updatesSection}>
            <div className={styles.updateFeed}>
                {updates.map(update => (
                    <div key={update.id} className={styles.update}>
                        <img src={update.image} alt={update.text} />
                        <p>{update.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdatesSection;
