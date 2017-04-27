import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { updateFieldValue, registerField } from "../../actions/formActions";

/**
 * @function
 * @param {component} FieldComponent The component to connect to Redux
 */
function connectField(FieldComponent) {

    FieldComponent.propTypes = {
        errorMessages: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isRequired: PropTypes.bool.isRequired,
        isValid: PropTypes.bool.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        registerField: PropTypes.func.isRequired
    }

    const getAttribute = ({ state, ownProps, attribute, defaultValue }) => {
        const location = `forms.${ownProps.formId}.fieldsById.${ownProps.fieldId}.${attribute}`;
        return get(state, location, get(ownProps, attribute, defaultValue));
    }

    const mapStateToProps = (state, ownProps) => {
        return {
            errorMessages: getAttribute({ state, ownProps, attribute: "errorMessages", defaultValue: "" }),
            isDisabled: getAttribute({ state, ownProps, attribute: "isDisabled", defaultValue: false }),
            isRequired: getAttribute({ state, ownProps, attribute: "isRequired", defaultValue: false }),
            isVisible: getAttribute({ state, ownProps, attribute: "isVisible", defaultValue: true }),
            isValid: getAttribute({ state, ownProps, attribute: "isValid", defaultValue: true }),
            value: getAttribute({ state, ownProps, attribute: "value" })
        }
    }

    const mapDispatchToProps = (dispatch, ownProps) => {
        return {
            registerField: () => {
                dispatch(registerField({ formId: ownProps.formId, field: ownProps }));
            },
            onChange: ({ evt }) => {
                dispatch(updateFieldValue({ evt, formId: ownProps.formId, fieldId: ownProps.fieldId }))
            }
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(FieldComponent);

}

export default connectField;