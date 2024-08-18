import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = ({desc}) => {
    return (
        <div className={styles.aboutSection}>
            <h2>About</h2>
            <p>
              {desc}
            </p>
        </div>
    );
};

export default AboutSection;
