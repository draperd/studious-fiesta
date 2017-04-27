/**
 * @module
 */
import React from "react";
import connectForm from "./connectForm";
import "./css/DisplayFormValue.css";

const baseClass = "components_forms_DisplayFormValue";
const css = {
    base: baseClass
}
export { css as displayFormValueCssSelectors };

/**
 * @class
 */
class DisplayFormValue extends React.Component {

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        const rows = Object.keys(this.props.value).map(key => {
            return (
                <tr key={key}>
                    <td>{key}</td>
                    <td>{this.props.value[key]}</td>
                </tr>
            );
        });
        return (
            <table className={css.base}>
                <thead>
                    <tr><th>Name</th><th>Value</th></tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}
export default connectForm(DisplayFormValue);
