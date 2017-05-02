/**
 * @module
 */
import React from "react";
import BaseField from "./BaseField";
import connectField from "../connectField";

const baseClass = "components_forms_fields_CheckBoxes";

/**
 * @static
 * @type {object}
 * @property {string} base        The base CSS class (that all other classes append to)
 */
const css = {
    base: baseClass,
    checkbox: `${baseClass}__checkbox`
};
export { css as checkBoxesCssClasses};

/**
 * @class
 */
class CheckBoxes extends BaseField {

    /**
     * 
     * @instance
     * @param {object} input
     * @param {object} input.evt 
     * @param {any}    input.value 
     */
    onCheck({evt, value}) {
        let updatedValue = this.props.value;
        if (evt.target.checked)
        {
            !this.props.value.includes(value) && (updatedValue = [...this.props.value, value]);
        }
        else
        {
            updatedValue = this.props.value.filter(option => option !== value);
        }
        this.props.onChange({ evt, fieldId: this.fieldId, value: updatedValue});
    }

    /**
     * @instance
     * @return {JSX}
     */
    render() {
        const radiobuttons = this.props.options && this.props.options.map((option, index) => {
            return (
                <div className={css.checkbox}
                     key={option.value || index} >
                    <input type="checkbox" 
                           name={this.props.name} 
                           value={option.value}
                           checked={this.props.value && this.props.value.includes(option.value)}
                           aria-describedby={this.props["aria-describedby"]}
                           onChange={(evt) => this.onCheck({ evt, value: option.value })}
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

export default connectField(CheckBoxes);