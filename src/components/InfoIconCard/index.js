import { Card, CardContent } from '@material-ui/core';
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/styles";
import { ReactSVG } from 'react-svg';

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        alignItems: "center",
        minHeight: 80
    },
    containerIcon: {
        width: "30%",
        minWidth: 80,
        display: "flex",
        justifyContent: "center"
    },
    iconBox: {
        padding: 10,
        borderRadius: 5,
        display: "flex",
        alignContent: "center",
        alignItems: "center",
    },
    descriptionBox: {
        textAlign: "start",
    },
    totalNumber: {
        fontWeight: "bold",
        fontSize: 21
    },
    description: {
        color: "#979ba9"
    }
}));

function InfoIconCard({ Icon, totalNumber, description, iconColor, iconBoxColor }) {
    const styles = useStyles();

    return (
        <Card>
            <CardContent>
                <div className={styles.container}>
                    <div className={styles.containerIcon}>
                        <div className={styles.iconBox} style={{ backgroundColor: iconBoxColor }}>
                            <ReactSVG src={Icon}/>
                        </div>
                    </div>
                    <div className={styles.descriptionBox}>
                        <div className={styles.totalNumber}>{totalNumber}</div>
                        <div className={styles.description}>{description}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

InfoIconCard.propTypes = {
    Icon: PropTypes.object.isRequired,
    totalNumber: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    description: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
    iconBoxColor: PropTypes.string,
};

export default InfoIconCard;