/**
 * @module
 */
import React from "react";
import connectForm from "./connectForm";


/**
 * @class
 */
class SubmitFormButton extends React.Component {

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        return (
            <button ref={(node) => {this.componentNode = node}}
                    disabled={!this.props.isValid}>{this.props.label}</button>
        );
    }
}
export default connectForm(SubmitFormButton);
