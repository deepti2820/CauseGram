import React from 'react';
import styles from './ImpactSection.module.css';

const ImpactSection = ({participatent,donation}) => {
    return (
        <div className={styles.impactSection}>
            <h2>Impact</h2>
            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <p>Total Donations</p>
                    <h3>${donation}</h3>
                </div>
                <div className={styles.metric}>
                    <p>Participants</p>
                    <h3>{participatent}</h3>
                </div>
            </div>
        </div>
    );
};

export default ImpactSection;
