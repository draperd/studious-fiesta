/**
 * @module
 */
import React from "react";
import { uniqueId } from "lodash";
import "./css/BaseField.css";

const baseClass = "components_forms_fields_BaseField";

/**
 * @static
 * @type {object}
 * @property {string} base The base CSS class (that all other classes append to)
 */
const css = {
    base: baseClass
};
export { css as baseFieldCssClasses};

/**
 * @class
 */
class BaseField extends React.Component {

    /**
     * @constructor
     * @param {object} props 
     * @param {string} [props.id]      An optional identifier for the field (to be used in the DOM) - one will be generated if not provided
     * @param {string} [props.fieldId] An optional identifier for the field (to be used in Redux) - one will be generated if not provided
     */
    constructor(props) {
        super(props);
        this.id = props.id || uniqueId("components_forms_fields_Field__");
        this.fieldId = props.fieldId || uniqueId(this.id + "__FIELD__");
    }

    /**
     * Registers the field.
     * 
     * @instance
     */
    componentDidMount() {
        this.props.registerField(this.fieldId);
    }
}

export default BaseField;