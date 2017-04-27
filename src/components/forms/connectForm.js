import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { registerForm, unregisterForm } from "../../actions/formActions";

/**
 * @function
 * @param {component} FormComponent The component to connect to Redux
 */
function connectForm(FormComponent) {

    FormComponent.propTypes = {
        registerForm: PropTypes.func.isRequired,
        unregisterForm: PropTypes.func.isRequired
    }

    const getAttribute = ({ state, ownProps, attribute, defaultValue }) => {
        const location = `forms.${ownProps.formId}.${attribute}`;
        return get(state, location, defaultValue);
    }

    const mapStateToProps = (state, ownProps) => {
        return {
            isValid: getAttribute({ state, ownProps, attribute: "isValid", defaultValue: true }),
            value: getAttribute({ state, ownProps, attribute: "value", defaultValue: {} })
        }
    }

    const mapDispatchToProps = (dispatch) => {
        return {
            registerForm: ({formId}) => {
                dispatch(registerForm({formId}))
            },
            unregisterForm: ({formId}) => {
                dispatch(unregisterForm({formId}))
            }
        }
    }

   return connect(
        mapStateToProps,
        mapDispatchToProps
    )(FormComponent);
}

export default connectForm;