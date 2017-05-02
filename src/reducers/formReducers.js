import { get } from "lodash";
import { actionNames } from "../actions/formActions";

/**
 * Compares the supplied values to see if they match. This attempts to match against string values
 * where possible.
 * 
 * @function
 * @param {any} a
 * @param {any} b 
 * @return {boolean} Whether or not the supplied values match
 */
function valuesMatch(a, b) {
    if (a && b)
    {
        return a.toString() === b.toString();
    }
    else
    {
        return a === b;
    }
}

/**
 * @function
 * @param {object} input
 * @param {object} input.rule        The rule to evaluate against the targetValue
 * @param {any}    input.targetValue The value to compare against
 * @return {boolean}                 Whether or not the rule evaluated successfully
 */
function evaluateRule({ rule = { is: [], isNot: []}, targetValue } = {}) {
    let hasValidValue = !rule.is || rule.is.length === 0;
    let hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

    if (hasInvalidValue)
    {
        hasInvalidValue = rule.isNot.some(invalidValue => valuesMatch(invalidValue, targetValue));
    }

    if (!hasInvalidValue && !hasValidValue)
    {
        if (rule.is && rule.is.length)
        {
            hasValidValue = rule.is.some(validValue => valuesMatch(validValue, targetValue));
        }
    }
    return hasValidValue && !hasInvalidValue;
}

/**
 * Evaluates the rules provided and returns whether or not they evaluated to true or false
 * 
 * @function
 * @param  {object}   input
 * @param  {object[]} [input.rules=[]]           The rules to evaluate
 * @param  {object}   [input.fieldsById={}]      A map of the fields
 * @param  {boolean}  [input.defaultResult=true] The default result to apply when evaluation cannot take place
 * @return {boolean}                             Whether or not the rules evaluated successfully.
 */
function evaluateRules({ rules = [], fieldsById = {}, defaultResult = true } = {}) {
    let rulesPass = defaultResult;
    if (rules.length)
    {
        rulesPass = rules.some(rule => {
            if (rule.fieldId && fieldsById.hasOwnProperty(rule.fieldId))
            {
                return evaluateRule({
                    rule, 
                    targetValue: fieldsById[rule.fieldId].value
                });
            }
            else
            {
                return defaultResult;
            }
        });
    }
    return rulesPass;
}

/**
 * @static
 * @type {object}
 * @property {function} lengthIsGreaterThan 
 */
const validators = {

    /**
     * @function
     * @param {object} input
     * @param {string} input.value       The string to check the length of
     * @param {number} input.length      The number of characters that the string should have more than
     * @param {string} [input.message]   An optional message to return when validation fails
     * @return {string}                  An error message (indicating that validation failed) or undefined when validation passes
     */
    lengthIsGreaterThan: function({ value, length, message }) {
        if (isNaN(length) || (value || "").length > length)
        {
            return;
        }
        else
        {

            return message || `Should have more than ${length} characters`;
        }
    }
}

/**
 * Validates the supplied field. This function is non-mutating - a new object representing the field
 * is created.
 * 
 * @function
 * @param  {object}   input                 The field to be validated 
 * @param  {boolean}  input.isRequired      Whether or not the field requires a value
 * @param  {boolean}  input.isVisible       Whether or not the field is currently visible (hidden fields will not be validation by default)
 * @param  {any}      input.value           The value of the field to be validated
 * @param  {object[]} [input.validWhen={}   An array of the rules to use to determine the validity of the field
 * @return {object}                         The validated field
 */
function validateField({ fieldId, isRequired = false, isVisible = true, value, validWhen = {} }) {
    let isValid = true;
    let errorMessages = [];
    if (isVisible)
    {
        if (isRequired)
        {
            const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
            isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
        }
        
        isValid = Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
            if (typeof validators[validator] === "function")
            {
                let validationConfig = validWhen[validator];
                validationConfig.value = value;
                let message = validators[validator](validationConfig);
                if (message)
                {
                    allValidatorsPass = false;
                    errorMessages.push(message);
                }
            }
            else
            {
                console.warn("The requested validator does not exist", validator);
            }
            return allValidatorsPass;
        }, isValid) && isValid;
    }
    return Object.assign({}, arguments[0], {
        isValid,
        errorMessages: errorMessages.join(", ")
    });
}

/**
 * Validates the fields provided.
 * 
 * @function
 * @param {object}    input
 * @param {object[]}  input.fields The fields to validate
 * @return {object[]}              The validated fields
 */
function validateFields(fields) {
    const validatedFields = fields.map(field => validateField(field))
    return validatedFields;
}

/**
 * 
 * @function
 * @param  {object}    input
 * @param  {object[]}  input.fields     The fields to be processed
 * @param  {object}    input.fieldsById The fields mapped to their id
 * @return {object[]}                   The processed fields
 */
function processFields({ fields, fieldsById }) {
    const updatedFields = fields.map(field => {
        return Object.assign({}, field, {
            isVisible: evaluateRules({ rules: field.visibleWhen, fieldsById, defaultResult: field.isVisible !== false }),
            isRequired: evaluateRules({ rules: field.requiredWhen, fieldsById, defaultResult: !!field.isRequired }),
            isDisabled: evaluateRules({ rules: field.disabledWhen, fieldsById, defaultResult: !!field.isDisabled })
        });
    })
    return updatedFields;
}

/**
 * Builds a map of the supplied fields using the id of each field as the key in the map.
 * 
 * @function
 * @param {object[]} fields The fields to map
 */
function mapFieldsById({ fields = [] } = {}) {
    return fields.reduce((map, field) => {
        map[field.fieldId] = field;
        return map;
    }, {});
}

/**
 * Creates a new state with a new form registered (if a form with the requested id has not already previously
 * been registered).
 * 
 * @function
 * @param {object}  state  The current state to derive the new state from
 * @param {object}  action The action to apply to the state
 * @return {object}        The new state 
 */
function registerForm(state, action) {
    const form = get(state, `${action.formId}`, { 
        fields: [],
        isValid: false
    });
    return Object.assign({}, state, {
        [action.formId]: form
    });
}

/**
 * Creates a new state with the requested form removed.
 * 
 * @function
 * @param {object}  state  The current state to derive the new state from
 * @param {object}  action The action to apply to the state
 * @return {object}        The new state 
 */
function unregisterForm(state, action) {
    state = Object.assign({}, state);
    delete state[action.formId];
    return state;
}

/**
 * Attempts to convert a string into an array using a delimiter. If no delimiter is provided then the original string is provided.
 * If a string is not provided but a delimiter is, then an empty array will be returned.
 * 
 * @function
 * @param {object}    input
 * @param {any}       input.value            The string to be split
 * @param {string}    [input.valueDelimiter] An optional delimitter for converting string values into arrays of strings
 * @return {string[]} An array of strings
 */
function splitDelimitedValue({ value, valueDelimiter } = {}) {
    if (valueDelimiter)
    {
        if (typeof value === "string")
        {
            value = value.split(valueDelimiter);
        }
        else
        {
            value = [];
        }
    }
    return value;
}

/**
 * Attempts to convert an array into a string using a delimiter. If no delimiter is provided then the original array 
 * value is returned.
 * 
 * @function
 * @param {object}   input
 * @param {string[]} input.value            The array to be joined
 * @param {string}   [input.valueDelimiter] An optional delimitter for converting string arrays into a string
 * @return {string}                        A string created by joining the array using the supplied delimitted value
 */
function joinDelimitedValue({ value, valueDelimiter }) {
    if (Array.isArray(value) && valueDelimiter)
    {
        value = value.join(valueDelimiter);
    }
    return value;
}

/**
 * Builds an array of all the items that are not in the missingFrom array but are found in the foundIn array.
 * 
 * @function
 * @param {object}   input
 * @param {object[]} input.missingFrom The array to find missing items in
 * @param {object[]} input.foundIn     The array to get the items from that aren't in the source
 * @return {object[]}                  An array of all the items that are in target that aren't in source
 */
function getMissingItems({ missingFrom, foundIn }) {
    return foundIn.reduce((missingItems, item) => {
        !missingFrom.includes(item) && missingItems.push(item);
        return missingItems;
    }, []);
} 

/**
 * Determines the values that have been added and removed from the initial value of the supplied field. Works with array data or
 * string data (where a delimiter is provided to convert the string into an array)
 * 
 * @function
 * @param {object}     input
 * @param {string}     input.name                       The name of value represented by the field
 * @param {any}        input.value                      The current value of the field
 * @param {any}        input.initialValue               The initial value of the field (to be compared against the current value)
 * @param {string}     [input.valueDelimiter]           An optional delimiter for converting string values into arrays and back again
 * @param {string}     [input.addedSuffix="_added"]     A suffix to apply to the name to define a new attribute representing the additive changes
 * @param {string}     [input.removedSuffix="_removed"] A suffix to apply to the name to define a new attribute representing the reductive changes
 * @returns {object[]}                                  An array of the output values (the added and removed changes)
 */
function determineChangedValues({ name, initialValue, value, valueDelimiter, addedSuffix = "_added", removedSuffix = "_removed" }) {
    const outputValues = [];
    initialValue = splitDelimitedValue({ value: initialValue, valueDelimiter });
    
    let added = getMissingItems({ foundIn: value, missingFrom: initialValue })
    let removed = getMissingItems({ foundIn: initialValue, missingFrom: value})
    
    added = joinDelimitedValue({value: added, valueDelimiter});
    removed = joinDelimitedValue({value: removed, valueDelimiter});

    outputValues.push({
        name: name + addedSuffix,
        value: added
    },{
        name: name + removedSuffix,
        value: removed
    });
    return outputValues; 
}

/**
 * Generates the value of a form based on the data in the supplied fields. Not all fields will necessarily
 * provide a value, some fields may in fact provide more than one value. 
 * 
 * @function
 * @param {object}   input
 * @param {object[]} input.fields The fields to generate the value from
 */
function generateFormValue({ fields = [] } = {}) {
    return fields.reduce((formValue, field) => {
        if ((field.omitWhenHidden && !field.isVisible) || 
            (field.omitWhenValueIs && field.omitWhenValueIs.some(value => field.value === value)))
        {
            return formValue;
        }
        else if (field.name)
        {
            if (field.useChangesAsValues)
            {
                determineChangedValues(field).forEach(({name, value}) => formValue[name] = value)
            }
            else
            {
                formValue[field.name] = field.value;
            }
        }
        else
        {
            console.warn("Cannot set a value because no 'name' attribute is present on the field", field);
        }
        return formValue;
    }, {});
}

/**
 * @function
 * @param {object}            input
 * @param {object[]|string[]} input.options
 * @return {object[]}
 */
function processOptions({ options } = {}) {
    if (options)
    {
        options = options.map(option => {
            if (typeof option === "string")
            {
                return {
                    label: option,
                    value: option
                }
            }
            else
            {
                return {
                    label: option.label || option.value,
                    value: option.value || option.label
                }
            }
        })
    }
    return options;
}


/**
 * Creates a new state containing the new field to be registered in the requested form.
 * 
 * @function
 * @param {object}  state  The current state to derive the new state from
 * @param {object}  action The action to apply to the state
 * @return {object}        The new state
 */
function registerField(state, action) {
    let form = get(state, `${action.formId}`);
    if (!form)
    {
        state = registerForm(state, action);
        form = get(state, `${action.formId}`);
    }

    const fieldToRegister = Object.assign({}, action.field, {
        initialValue: action.field.value,
        value: splitDelimitedValue(action.field),
        options: processOptions(action.field)
    });
    let fields = [...form.fields, fieldToRegister];
    let fieldsById = mapFieldsById({ fields });
    fields = processFields({fields, fieldsById});
    
    fields = validateFields(fields);
    const isValid = fields.every(field => field.isValid);

    const value = generateFormValue({fields});

    fieldsById = mapFieldsById({fields}); // NOTE: Need to remap fields because processFields is non-mutating

    return Object.assign({}, state, {
        [action.formId]: Object.assign({}, form, {
            fields,
            fieldsById,
            isValid,
            value
        })
    });
}

/**
 * Creates a new state containing the new value of the field that has been updated. Any resulting effects of
 * changing the value (such as changes in visibility, requirement, disablement and validity) will also be
 * reflected in the new state.
 * 
 * @function
 * @param {object}  state  The current state to derive the new state from
 * @param {object}  action The action to apply to the state
 * @return {object}        The new state
 */
function updateFieldValue(state, action) {
    const form = state[action.formId];
    let { fields, fieldsById } = form;
    const index = fields.findIndex( (field => { return field.fieldId === action.fieldId } ));
    
    const updateValue = (typeof action.value !== "undefined" && action.value) || action.evt.target.value;
    const field = Object.assign({}, fieldsById[action.fieldId], { value: updateValue });
    fields = [...fields.slice(0, index), field, ...fields.slice(index + 1)];

    fieldsById = mapFieldsById({fields});
    fields = processFields({fields, fieldsById});

    fields = validateFields(fields);
    const isValid = fields.every(field => field.isValid);
    const value = generateFormValue({fields});

    fieldsById = mapFieldsById({fields});
    
    return Object.assign({}, state, {
        [action.formId]: Object.assign({}, form, { 
            fields, 
            fieldsById,
            isValid,
            value
        })
    });
}

export { 
    determineChangedValues,
    evaluateRule,
    evaluateRules,
    getMissingItems,
    mapFieldsById, 
    processFields, 
    validateField,
    validators,
    valuesMatch 
};


const formFields = (state = {}, action) => {
  switch (action.type) {

    case actionNames.REGISTER_FORM: 
        return registerForm(state, action);

    case actionNames.REGISTER_FIELD: 
        return registerField(state, action);

    case actionNames.UPDATE_FIELD_VALUE: 
        return updateFieldValue(state, action);

    case actionNames.UNREGISTER_FORM: 
        return unregisterForm(state, action);

    default:
      return state
  }
}

export default formFields