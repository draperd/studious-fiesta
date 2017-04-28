/**
 * @module
 */
import React from "react";
import BaseField from "./BaseField";
import connectField from "../connectField";
import "./css/RadioButtons.css";

const baseClass = "components_forms_fields_RadioButtons";

/**
 * @static
 * @type {object}
 * @property {string} base        The base CSS class (that all other classes append to)
 */
const css = {
    base: baseClass,
    radioButton: `${baseClass}__radio-button`
};
export { css as radioButtonsCssClasses};

/**
 * @class
 */
class RadioButtons extends BaseField {

    /**
     * @instance
     * @return {JSX}
     */
    render() {
        const radiobuttons = this.props.options && this.props.options.map((option, index) => {
            return (
                <div className={css.radioButton}
                     key={option.value || index} >
                    <input type="radio" 
                           name={this.props.name} 
                           value={option.value}
                           checked={option.value === this.props.value}
                           aria-describedby={this.props["aria-describedby"]}
                           onChange={(evt) => this.props.onChange({ evt, fieldId: this.fieldId, value: option.value })}
                           disabled={this.props.isDisabled}
                           style={ { display: (this.props.isVisible ? "inline-block" : "none") } }></input>
                    <label htmlFor={option.value}>{option.label}</label>
                </div>
            );
        })

        return (
            <div className={css.base}>{radiobuttons}</div>
        );
    }

}

export default connectField(RadioButtons);