/**
 * @module
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uniqueId } from "lodash";

import { registerForm } from "../../actions/formActions";

/**
 * @class
 */
class Form extends React.Component {

    /**
     * @constructor
     * @param {object} props 
     * @param {string} [props.id] An id for the form. This will identify the form in the Redux store. An id will be generated if not provided.
     *                            The id will also be passed down to all descendant components.
     */
    constructor(props) {
        super(props);
        this.id = props.id || uniqueId("components_forms_Form__");
    }

    /**
     * Registers the form.
     * 
     * @instance
     */
    componentDidMount() {
        this.props.registerForm({formId: this.id});
    }

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            formId: this.id
        }));
        return (
            <form ref={(node) => {this.componentNode = node}}>
                {childrenWithProps}
            </form>
        );
    }
}

Form.propTypes = {
    registerForm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        // todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        registerForm: ({formId}) => {
            dispatch(registerForm({formId}))
        }
    }
}

const FormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);

export default FormContainer
