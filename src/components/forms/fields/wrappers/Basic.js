/**
 * @module
 */
import React from "react";
import { uniqueId } from "lodash";
import connectField from "../../connectField";
import { cascadeProperties, determineProperties } from "../../../../utilities/componentProcessing";
import "./css/Basic.css";

const baseClass = "components_forms_fields_wrappers_Basic";

/**
 * @static
 * @type {object}
 * @property {string} control     The field control (the part that the user actually interacts with)
 * @property {string} base        The base CSS class (that all other classes append to)
 * @property {string} description The description text for the field
 * @property {string} disabled    Applied to the root element when the field is disabled
 * @property {string} errors      Validation errors
 * @property {string} invalid     Applied to the root element when the field is in an invalid state
 * @property {string} label       The label text for the field 
 * @property {string} required    Applied to the root element when the field must be provided with a value to be valid
 */
const css = {
    base: baseClass,
    control: `${baseClass}__control`,
    description: `${baseClass}__description`,
    disabled: `${baseClass}--disabled`,
    errors: `${baseClass}__errors`,
    invalid: `${baseClass}--invalid`,
    label: `${baseClass}__label`,
    required: `${baseClass}--required`,
};
export { css as basicWrapperCssClasses};

/**
 * @class
 */
class Basic extends React.Component {

    /**
     * @constructor
     * @param {object} props 
     */
    constructor(props) {
        super(props);

        this.id = props.id || uniqueId("components_forms_fields_wrappers__");
        this.labelId = this.id + "__label";
        this.controlId = this.id + "__field";
    }

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        const names = ["disabledWhen", "fieldId", "id", "isDisabled", "isRequired", "isVisible", "name", "requiredWhen", "validWhen", "visibleWhen", "aria-describedby"];
        let props = Object.assign({}, this.props, {
            id: this.controlId,
            "aria-describedby": this.labelId
        });
        props = determineProperties({ props, names });
        const childrenWithProps = cascadeProperties(this.props.children, props);

        const className = `${css.base} 
                           ${this.props.isValid ? "": css.invalid}
                           ${this.props.isRequired ? css.required : ""}
                           ${this.props.isDisabled ? css.disabled : ""}`;

        const description = this.props.description ? (<div className={css.description}>{this.props.description}</div>) : null;
        const validationErrors = this.props.errorMessages ? (<div className={css.errors}>{this.props.errorMessages}</div>) : null;
        return (
            <div className={className}
                 id={this.id}
                 ref={(node) => {this.componentNode = node}}
                 style={ { display: (this.props.isVisible ? "block" : "none") } }>
                <label className={css.label}
                       id={this.labelId}
                       htmlFor={this.controlId}>{this.props.label}</label>
                {childrenWithProps}
                {validationErrors}
                {description}
            </div>
        );
    }
}

export default connectField(Basic);
