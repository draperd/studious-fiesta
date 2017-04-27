/**
 * @module
 */
import React from "react"; 
import { get, clone } from "lodash";

const PROPERTIES_TO_CASCADE = "___properties_to_cascade";

/**
 * @function
 * @param {object}   input
 * @param {object}   input.props      
 * @param {string[]} input.names  
 * @returns {object}                        
 */
function determineProperties({ props = {}, names = [] } = {}) {
    const builtProps = {};
    const seedProps = get(props, PROPERTIES_TO_CASCADE);
    if (seedProps)
    {
        seedProps.forEach(function(propName) {
            builtProps[propName] = get(props, propName);
        });
    }
    
    if (names)
    {
        names.forEach(function(propName) {
            builtProps[propName] = get(props, propName);
        });

        if (seedProps)
        {
            builtProps[PROPERTIES_TO_CASCADE] = [...seedProps, ...names];
        }
        else
        {
            builtProps[PROPERTIES_TO_CASCADE] = names;
        }
    }
    return builtProps;
}

/**
 * @function
 * @param  {object[]} children 
 * @param  {object}   props    
 * @return {object[]}          
 */
function cascadeProperties(children, props) {
    let updatedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type === "function")
        {
            let incomingProps = clone(props);
            Object.keys(props).forEach(function(propName) {
                if (child.props.hasOwnProperty(propName))
                {
                    delete incomingProps[propName];
                }
            })
            return React.cloneElement(child, incomingProps);
        }
        else if (child.props && child.props.children)
        {
            let recursedChildren = cascadeProperties(child.props.children, props);
            return React.cloneElement(child, {
                children: recursedChildren
            });
        }
        else 
        {
            return child;
        }
    });
    return updatedChildren;
};

export { cascadeProperties, determineProperties, PROPERTIES_TO_CASCADE };
