/**
 * @module
 */
import React from "react";

/**
 * @class
 */
export default class Basic extends React.Component {

    /**
     * @instance
     * @returns {JSX}
     */
    render() {
        const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            formId: this.props.formId
        }));
        return (
            <div ref={(node) => {this.componentNode = node}}>
                {childrenWithProps}
            </div>
        );
    }
}
