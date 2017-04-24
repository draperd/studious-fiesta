import { actionNames } from "../actions/formActions";

const formFields = (state = {}, action) => {
  switch (action.type) {

    case actionNames.REGISTER_FORM: 
        return Object.assign({}, state, {
            forms: Object.assign({}, state.forms, {
                [action.formId]: {
                    fields: [],
                    invalid: false
                }
            })
        })

    case actionNames.REGISTER_FIELD: 
        return Object.assign({}, state, {
            forms: Object.assign({}, state.forms, {
                [action.formId]: Object.assign({}, state.forms[action.formId], {
                    fields: [...state.forms[action.formId].fields, {
                        fieldId: action.fieldId
                    }]
                })
            })
        })

    case actionNames.UPDATE_FIELD_VALUE: 
        const targetForm = state.forms[action.formId];
        const targetFields = targetForm.fields;
        const targetFieldIndex = targetFields.findIndex( (field => { return field.fieldId === action.fieldId } ));
        const fields = [...targetFields.slice(0, targetFieldIndex),
                        Object.assign({}, targetFields[targetFieldIndex], { value: action.evt.target.value }),
                        ...targetFields.slice(targetFieldIndex + 1)]

        return Object.assign({}, state, {
            forms: Object.assign({}, state.forms, {
                [action.formId]: Object.assign({}, targetForm, {
                    fields: fields
                })
            })
        })


    default:
      return state
  }
}

export default formFields