import { Card, CardContent } from '@material-ui/core';
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        alignItems: "center",
        minHeight: 100
    },
    descriptionBox: {
        paddingLeft: 20,
        textAlign: "start",
    },
    totalNumber: {
        fontWeight: "bold",
        fontSize: 32
    },
    description: {
        color: "#979ba9",
        fontSize: 28
    }
}));

function InfoCard({ totalNumber, description }) {
    const styles = useStyles();

    return (
        <Card>
            <CardContent>
                <div className={styles.container}>
                    <div className={styles.descriptionBox}>
                        <div className={styles.description}>{description}</div>
                        <div className={styles.totalNumber}>{totalNumber}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

InfoCard.propTypes = {
    totalNumber: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    description: PropTypes.string.isRequired,
};

export default InfoCard;