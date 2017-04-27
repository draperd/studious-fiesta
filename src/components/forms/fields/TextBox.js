/**
 * @module
 */
import React from "react";
import connectField from "../connectField";

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
                   style={ { display: (this.props.isVisible ? "inline-block" : "none") } }
                   aria-describedby={this.props["aria-describedby"]}
                   onChange={(evt) => this.props.onChange({ evt })}
                   disabled={this.props.isDisabled}
                   defaultValue={this.props.value}></input>
        );
    }

}

export default connectField(TextBox);