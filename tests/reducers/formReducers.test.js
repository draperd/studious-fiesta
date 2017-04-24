import deepFreeze from "deep-freeze";
import { actionNames,
         registerForm,
         registerField,
         updateFieldValue } from "../../src/actions/formActions";
import formReducers from "../../src/reducers/formReducers";


test("registering a form", () => {    
    const initialState = {};
    const expectedState = {
        forms: {
            form1: {
                fields: [],
                invalid: false
            }
        }
    }
    deepFreeze(initialState);

    const resultState = formReducers(initialState, registerForm({formId: "form1"}));
    expect(resultState).toEqual(expectedState);
})

test("registering a field with a form", () => {
    const initialState = {
        forms: {
            form1: {
                fields: [],
                invalid: false
            }
        }
    }
    const expectedState = {
        forms: {
            form1: {
                fields: [{
                    fieldId: "FIELD1"
                }],
                invalid: false
            }
        }
    }
    deepFreeze(initialState);

    let resultState = formReducers(initialState, registerField({formId: "form1", fieldId: "FIELD1"}));
    expect(resultState).toEqual(expectedState);
})

test("changing a field value", () => {
    const initialState = {
        forms: {
            form1: {
                fields: [{
                    fieldId: "FIELD1"
                }],
                invalid: false
            }
        }
    }
    const expectedState = {
        forms: {
            form1: {
                fields: [{
                    fieldId: "FIELD1",
                    value: "test"
                }],
                invalid: false
            }
        }
    }
    deepFreeze(initialState);

    let resultState = formReducers(initialState, updateFieldValue({evt: { target: { value: "test" } }, formId: "form1", fieldId: "FIELD1"}));
    expect(resultState).toEqual(expectedState);
})