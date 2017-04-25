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
 * @return {boolean}                            Whether or not the rules evaluated successfully.
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
 * 
 * @function
 * @param  {object} field The field to be validated 
 * @return {object}       The validated field
 */
function validateField(field) {
    let isValid = true;
    if (field.isRequired)
    {
        const value = field.value;
        const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
        isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
    }
    field = Object.assign({}, field, {
        isValid
    });
    return field;
}

/**
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
            visible: evaluateRules({ rules: field.visibleWhen, fieldsById, defaultResult: true }),
            isRequired: evaluateRules({ rules: field.requiredWhen, fieldsById, defaultResult: !!field.isRequired })
        });
    })
    return updatedFields;
}

/**
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

    let fields = [...form.fields, Object.assign({}, action.field)];
    let fieldsById = mapFieldsById({ fields });
    fields = processFields({fields, fieldsById});
    
    fields = validateFields(fields);
    const isValid = fields.every(field => field.isValid);

    fieldsById = mapFieldsById({fields}); // NOTE: Need to remap fields because processFields is non-mutating

    return Object.assign({}, state, {
        [action.formId]: Object.assign({}, form, {
            fields,
            fieldsById,
            isValid
        })
    });
}

/**
 * @function
 * @param {object}  state  The current state to derive the new state from
 * @param {object}  action The action to apply to the state
 * @return {object}        The new state
 */
function updateFieldValue(state, action) {
    const form = state[action.formId];
    let { fields, fieldsById } = form;
    const index = fields.findIndex( (field => { return field.fieldId === action.fieldId } ));
    const field = Object.assign({}, fieldsById[action.fieldId], { value: action.evt.target.value });
    fields = [...fields.slice(0, index), field, ...fields.slice(index + 1)];

    fieldsById = mapFieldsById({fields});
    fields = processFields({fields, fieldsById});
    fieldsById = mapFieldsById({fields});
    
    return Object.assign({}, state, {
        [action.formId]: Object.assign({}, form, { fields, fieldsById })
    });
}

export { 
    evaluateRule,
    evaluateRules,
    mapFieldsById, 
    processFields, 
    validateField,
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

    default:
      return state
  }
}

export default formFields