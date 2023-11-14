import PropTypes from 'prop-types';

import { makeStyles } from "@material-ui/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    formLabel: {
        fontWeight: "bold",
    }
}));

export default function FieldLabel({ label, fieldValue }) {
    const styles = useStyles();

    return (
        <>
            <Typography variant="subtitle2" className={styles.formLabel}>
                {label}
            </Typography>
            <Typography fullWidth>
                {fieldValue}
            </Typography>
        </>
    );
};

FieldLabel.defaultProps = {
    fieldValue: "Não preenchido",
};

FieldLabel.propTypes = {
    label: PropTypes.string.isRequired,
    fieldValue: PropTypes.string,
};