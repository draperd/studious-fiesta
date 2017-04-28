/**
 * @module
 */
import React from "react";
import BaseField from "./BaseField";
import connectField from "../connectField";

/**
 * @class
 */
class TextBox extends BaseField {

    /**
     * @instance
     * @return {JSX}
     */
    render() {
        return (
            <input type="text"
                   style={ { display: (this.props.isVisible ? "inline-block" : "none") } }
                   aria-describedby={this.props["aria-describedby"]}
                   onChange={(evt) => this.props.onChange({ evt, fieldId: this.fieldId })}
                   disabled={this.props.isDisabled}
                   defaultValue={this.props.value}></input>
        );
    }

}

export default connectField(TextBox);