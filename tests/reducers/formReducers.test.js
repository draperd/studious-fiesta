import deepFreeze from "deep-freeze";
import { actionNames,
         registerForm,
         registerField,
         updateFieldValue } from "../../src/actions/formActions";
import formReducers, {
    evaluateRules,
    evaluateRule,
    mapFieldsById,
    validateField,
    valuesMatch
} from "../../src/reducers/formReducers";


test("registering a form", () => {
    const initialState = {};
    const expectedState = {
        form1: {
            fields: [],
            isValid: false
        }
    };
    deepFreeze(initialState);

    const resultState = formReducers(initialState, registerForm({formId: "form1"}));
    expect(resultState).toEqual(expectedState);
})

test("registering a field with a form", () => {
    const initialState = {
        form1: {
            fields: [],
            isValid: false
        }
    };
    const expectedState = {
        form1: {
            fields: [{
                fieldId: "FIELD1",
                visible: true,
                isRequired: false,
                isValid: true
            }],
            fieldsById: {
                "FIELD1": {
                    fieldId: "FIELD1",
                    visible: true,
                    isRequired: false,
                    isValid: true
                }
            },
            isValid: true
        }
    };
    deepFreeze(initialState);

    let resultState = formReducers(initialState, registerField({formId: "form1", field: { fieldId: "FIELD1" }}));
    expect(resultState).toEqual(expectedState);
})

test("mapping fields by id", () => {
    expect(mapFieldsById({ fields: [
        { fieldId: "one" },
        { fieldId: "two" },
        { fieldId: "three" }
    ]})).toEqual({
        one: { fieldId: "one" },
        two: { fieldId: "two" },
        three: { fieldId: "three" }
    });
})

test("value matcher", () => {
    expect(valuesMatch("a","a")).toEqual(true);
    expect(valuesMatch("a","b")).toEqual(false);
    expect(valuesMatch("1",1)).toEqual(true);
    expect(valuesMatch("1",2)).toEqual(false);
    expect(valuesMatch(0,1)).toEqual(false);
    expect(valuesMatch(0,false)).toEqual(false);
    expect(valuesMatch(0,0)).toEqual(true);
})

test("evaluting a rule with no arguments", () => {
    expect(evaluateRule()).toEqual(true);
})

test("successful 'is' rule", () => {
    expect(evaluateRule({
        rule: { is: [ true ] },
        targetValue: true
    })).toEqual(true);
})

test("failing 'is' rule", () => {
    expect(evaluateRule({
        rule: { is: [ false ] },
        targetValue: true
    })).toEqual(false);
})

test("successful 'isNot' rule", () => {
    expect(evaluateRule({
        rule: { isNot: [ true ] },
        targetValue: true
    })).toEqual(false);
})

test("failing 'isNot' rule", () => {
    expect(evaluateRule({
        rule: { isNot: [ false ] },
        targetValue: true
    })).toEqual(true);
})

test("successful combined 'is' and isNot' rule", () => {
    expect(evaluateRule({
        rule: { is: [ true ], isNot: [ false ] },
        targetValue: true
    })).toEqual(true);
})

test("failing combined 'is' and isNot' rule", () => {
    expect(evaluateRule({
        rule: { is: [ true ], isNot: [ false ] },
        targetValue: false
    })).toEqual(false);
})

test("evaluating no rules returns the default default", () => {
    expect(evaluateRules()).toEqual(true);
})

test("changing a field value", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({formId: "form1", field: { fieldId: "FIELD1"}}));
    deepFreeze(initialState);

    let resultState = formReducers(initialState, updateFieldValue({evt: { target: { value: "test" } }, formId: "form1", fieldId: "FIELD1"}));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        value: "test",
        visible: true
    }));
})

test("visibility changes on registered field", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            visibleWhen: [
                {
                    fieldId: "FIELD2",
                    is: [true]
                }
            ]
        }
    }));
    deepFreeze(initialState);

    let resultState = formReducers(initialState, registerField({
        formId: "form1", 
        field: {
            fieldId: "FIELD2", 
            value: false
        }
    }));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD2");
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        visible: false
    }));
})

test("visibility changes on field value change", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            visibleWhen: [
                {
                    fieldId: "FIELD2",
                    is: [true]
                }
            ]
        }
    }));
    initialState = formReducers(initialState, registerField({
        formId: "form1", 
        field: {
            fieldId: "FIELD2", 
            value: true
        }
    }));
    expect(initialState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        visible: true
    }));
    deepFreeze(initialState);

    let resultState = formReducers(initialState, updateFieldValue({evt: { target: { value: false } }, formId: "form1", fieldId: "FIELD2"}));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        visible: false
    }));
    resultState = formReducers(resultState, updateFieldValue({evt: { target: { value: true } }, formId: "form1", fieldId: "FIELD2"}));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        visible: true
    }));
})

test("validating a field", () => {
    expect(validateField({ isRequired: false})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isRequired: true})).toEqual(expect.objectContaining({isValid: false}));
    expect(validateField({ isRequired: true, value: 0})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isRequired: true, value: false})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isRequired: true, value: "test"})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isRequired: true, value: []})).toEqual(expect.objectContaining({isValid: false}));
    expect(validateField({ isRequired: true, value: [1]})).toEqual(expect.objectContaining({isValid: true}));
})

test("required field with no value results in invalid form", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            isRequired: true
        }
    }));
    expect(initialState).toHaveProperty("form1.isValid", false);
})

test("optional field with no value results in valid form", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            isRequired: false
        }
    }));
    expect(initialState).toHaveProperty("form1.isValid", true);
})

