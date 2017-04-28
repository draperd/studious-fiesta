/**
 * @module
 */
import React from "react";
import { uniqueId } from "lodash";
import connectForm from "./connectForm";
import { cascadeProperties, determineProperties } from "../../utilities/componentProcessing";

/**
 * @class
 */
class Form extends React.Component {

    /**
     * @constructor
     * @param {object} props 
     * @param {string} [props.formId] An id for the form. This will identify the form in the Redux store. An id will be generated if not provided.
     *                                The id will also be passed down to all descendant components.
     */
    constructor(props) {
        super(props);
        this.formId = props.formId || uniqueId("components_forms_Form__");
    }

    /**
     * Registers the form.
     * 
     * @instance
     */
    componentDidMount() {
        this.props.registerForm({formId: this.formId});
    }

    /**
     * Unregisters the form.
     * 
     * @instance
     */
    componentWillUnmount() {
        this.props.unregisterForm({formId: this.formId});
    }

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        let props = Object.assign({}, this.props, {
            formId: this.formId
        });
        props = determineProperties({ props, names: ["formId"] });
        const childrenWithProps = cascadeProperties(this.props.children, props);
        return (
            <form ref={(node) => {this.componentNode = node}}>
                {childrenWithProps}
            </form>
        );
    }
}
export default connectForm(Form);
