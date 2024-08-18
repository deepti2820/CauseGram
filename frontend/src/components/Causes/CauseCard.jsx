import React from 'react';
import styles from './CauseCard.module.css';

const CauseCard = ({ name, description, image }) => {
    return (
        <div className={styles.card}>
            <img src={image} alt={name} className={styles.image} />
            <div className={styles.content}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};

export default CauseCard;
