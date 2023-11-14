import PropTypes from "prop-types";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import ArrowBack from '@material-ui/icons/ArrowBack';

import { makeStyles } from "@material-ui/styles";
import { isMobile } from "react-device-detect";

import toast from "utils/toast";

const useStyles = makeStyles(theme => ({
    buttonLinkDescription: {
        cursor: "pointer",
        alignContent: "center",
        alignItems: "center",
        display: "flex",
        color: "black",

        "&:hover": {
            color: "#536DFE"
        }
    },
    buttonTitle: {
        paddingLeft: 15,
    },
}));

export default function BackButton({ onClick, label, simpleOnMobile }) {
    const styles = useStyles();

    const showButtonLabel = (simpleOnMobile && !isMobile) || !simpleOnMobile;
    

    return (
        <Link onClick={onClick} style={{ textDecoration: "none" }}>
            <div className={styles.buttonLinkDescription}>
                <ArrowBack fontSize="large" paddingRight="10" />
                {showButtonLabel && <Typography variant="h2" className={styles.buttonTitle}>
                    {label}
                </Typography>}
            </div>
        </Link>
    );
}

BackButton.defaultProps = {
    onClick: () => toast.warning("You need to pass 'onClick' property"),
    label: "Voltar",
    simpleOnMobile: false,
};

BackButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    simpleOnMobile: PropTypes.bool,
};