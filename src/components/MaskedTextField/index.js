import InputMask from 'react-input-mask';
import { TextField } from "@material-ui/core";

export default function MaskedTextField(props = {}) {
    // const onChange = ({ target: { value } }) => {
    //     let finalValue = value;

    //     if (props.unmaskValue) {
    //         finalValue = value.replace(/[^\d]/g, '');
    //     }

    //     props.onChange(finalValue);
    // }
        

    return (
        <InputMask
            mask={props.maskBuilder?.(props.value)}
            defaultValue={props.defaultValue}
            disabled={props.disabled}
            maskChar={props.maskChar}
            onChange={props.onChange}
            value={props.value}
        >
            {inputProps => (
                <TextField
                    {...inputProps}
                    //label={props.label}
                    variant={props.variant}
                    size={props.size}
                    onChange={props.onChange}
                />
            )}
        </InputMask>
    );
}

MaskedTextField.defaultProps = {
    disabled: false,
    maskChar: "",
    variant: "outlined",
    size: "small",
    unmaskValue: false,
};