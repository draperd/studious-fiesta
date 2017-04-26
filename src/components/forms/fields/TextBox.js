/**
 * @module
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";

import { updateFieldValue, registerField } from "../../../actions/formActions";

class TextBox extends React.Component {

    /**
     * Registers the field.
     * 
     * @instance
     */
    componentDidMount() {
        this.props.registerField(this.props);
    }

    /**
     * @instance
     * @return {JSX}
     */
    render() {
        return (
            <input type="text"
                   style={ { display: (this.props.isVisible ? "block" : "none") } }
                   onChange={(evt) => this.props.onChange({ evt })}></input>
        );
    }

}

TextBox.propTypes = {
    fieldId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    registerField: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired
}

const getAttribute = ({ state, ownProps, attribute }) => {
    const location = `forms.${ownProps.formId}.fieldsById.${ownProps.fieldId}.${attribute}`;
    return get(state, location, true);
}

const mapStateToProps = (state, ownProps) => {
    return {
        isVisible: getAttribute({ state, ownProps, attribute: "isVisible" })
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

const TextBoxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TextBox);

export default TextBoxContainer;