/**
 * @module
 * 
 */

/**
 * @static
 * @type {object}
 * @property {string} REGISTER_FORM  Dispatched when a form is first created to register it with the Redux store.
 * @property {string} REGISTER_FIELD Dispatched when a field is first created to register itself in the Redux store.
 * @property {string} ONCHANGE       Dispatched when the value of a field in the form is changed.
 */
const actionNames = {
    REGISTER_FORM: "REGISTER_FORM",
    REGISTER_FIELD: "REGISTER_FORM_FIELD",
    UPDATE_FIELD_VALUE: "UPDATE_FORM_FIELD_VALUE"
}
export { actionNames }

/**
 * Use to register a new form in the Redux store.
 * 
 * @function
 * @param {object} props
 * @param {string} props.id The id of the form
 */
export const registerForm = ({ formId }) => ({
    type: actionNames.REGISTER_FORM,
    formId
})

/**
 * Use to register a new field in an existing form in the redux store.
 * 
 * @function
 * @param {object} props
 * @param {string} props.formId The id of the form
 */
export const registerField = ({ formId, field }) => ({
    type: actionNames.REGISTER_FIELD,
    formId,
    field
})

/**
 * @function
 * @param {object} fieldProps 
 */
export const updateFieldValue = ({ evt, formId, fieldId }) => ({
    type: actionNames.UPDATE_FIELD_VALUE,
    evt,
    formId,
    fieldId
})