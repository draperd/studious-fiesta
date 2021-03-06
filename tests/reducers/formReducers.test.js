import deepFreeze from "deep-freeze";
import { actionNames,
         registerForm,
         registerField,
         updateFieldValue,
         unregisterForm } from "../../src/actions/formActions";
import formReducers, {
    determineChangedValues,
    evaluateRules,
    evaluateRule,
    getMissingItems,
    mapFieldsById,
    validateField,
    validators,
    valuesMatch
} from "../../src/reducers/formReducers";

let mockWarn;
beforeEach(() => {
    mockWarn = console.warn = jest.fn(() => {});
});

afterEach(() => {
    mockWarn.mockClear();
});

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

test("unregistering a form", () => {
    let state = {};
    state = formReducers(state, registerForm({formId: "form1"}));
    deepFreeze(state);
    const resultState = formReducers(state, unregisterForm({formId: "form1"}));
    expect(resultState).toEqual({});
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
                isDisabled: false,
                isVisible: true,
                isRequired: false,
                isValid: true,
                value: "test",
                initialValue: "test",
                errorMessages: "" 
            }],
            fieldsById: {
                "FIELD1": {
                    fieldId: "FIELD1",
                    isDisabled: false,
                    isVisible: true,
                    isRequired: false,
                    isValid: true,
                    value: "test",
                    initialValue: "test",
                    errorMessages: ""
                }
            },
            isValid: true,
            value: {}
        }
    };
    deepFreeze(initialState);

    let resultState = formReducers(initialState, registerField({formId: "form1", field: { value: "test", fieldId: "FIELD1" }}));
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
        isVisible: true
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
        isVisible: false
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
        isVisible: true
    }));
    deepFreeze(initialState);

    let resultState = formReducers(initialState, updateFieldValue({evt: { target: { value: false } }, formId: "form1", fieldId: "FIELD2"}));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        isVisible: false
    }));
    resultState = formReducers(resultState, updateFieldValue({evt: { target: { value: true } }, formId: "form1", fieldId: "FIELD2"}));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        isVisible: true
    }));
})

test("requirement can be set when registering a field", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            isRequired: true
        }
    }));
    expect(initialState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        isRequired: true
    }));
})

test("requirement changes on registered field", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            requiredWhen: [
                {
                    fieldId: "FIELD2",
                    is: ["required"]
                }
            ]
        }
    }));
    expect(initialState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        isRequired: false
    }));
    deepFreeze(initialState);

    let resultState = formReducers(initialState, registerField({
        formId: "form1", 
        field: {
            fieldId: "FIELD2", 
            value: "required"
        }
    }));
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD2");
    expect(resultState).toHaveProperty("form1.fieldsById.FIELD1", expect.objectContaining({
        fieldId: "FIELD1",
        isRequired: true
    }));
})

test("validating a field", () => {
    expect(validateField({ isVisible: true, isRequired: false})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isVisible: true, isRequired: true})).toEqual(expect.objectContaining({isValid: false}));
    expect(validateField({ isVisible: true, isRequired: true, value: 0})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isVisible: true, isRequired: true, value: false})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isVisible: true, isRequired: true, value: "test"})).toEqual(expect.objectContaining({isValid: true}));
    expect(validateField({ isVisible: true, isRequired: true, value: []})).toEqual(expect.objectContaining({isValid: false}));
    expect(validateField({ isVisible: true, isRequired: true, value: [1]})).toEqual(expect.objectContaining({isValid: true}));
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

test("required field with no initial value becomes valid when value is set", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            isRequired: true
        }
    }));
    expect(state).toHaveProperty("form1.isValid", false);
    state = formReducers(state, updateFieldValue({evt: { target: { value: 3 } }, formId: "form1", fieldId: "FIELD1"}));
    expect(state).toHaveProperty("form1.isValid", true);
})

test("hidden fields are not validated by default", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1",
            isVisible: false, 
            isRequired: true
        }
    }));
    expect(state).toHaveProperty("form1.isValid", true);
})

test("validation rules are passed for validation", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1",
            value: "",
            validWhen: {
                lengthIsGreaterThan: {
                    length: 1
                }
            }
        }
    }));
    expect(state).toHaveProperty("form1.isValid", false);
})

test("warn when a validator does not exist", () => {
    validateField({ validWhen: { fakeValidator: {} }});
    expect(mockWarn).toHaveBeenCalledTimes(1);
})

test("lengthIsGreaterThan validator", () => {
    expect(validators.lengthIsGreaterThan({ value: "test" })).toEqual(undefined);
    expect(validators.lengthIsGreaterThan({ value: "test", length: 3 })).toEqual(undefined);
    expect(validators.lengthIsGreaterThan({ value: "test", length: 5 })).toEqual("Should have more than 5 characters");
    expect(validators.lengthIsGreaterThan({ value: "test", length: 5, message: "Too short" })).toEqual("Too short");
})

test("form value is set", () => {
    let initialState = formReducers({}, registerForm({formId: "form1"}));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "one",
            value: 1
        }
    }));
    initialState = formReducers(initialState, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD2", 
            name: "two",
            value: 2
        }
    }));
    expect(initialState).toHaveProperty("form1.value", { one: 1, two: 2});
})

test("form value is updated", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "one",
            value: 1
        }
    }));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD2", 
            name: "two",
            value: 2
        }
    }));
    state = formReducers(state, updateFieldValue({evt: { target: { value: 3 } }, formId: "form1", fieldId: "FIELD2"}));
    expect(state).toHaveProperty("form1.value", { one: 1, two: 3});
})

test("finding missing items", () => {
    expect(getMissingItems({ missingFrom: [1,2,4,6,8], foundIn: [1,2,3,4,5,6,7,8,9]})).toEqual([3,5,7,9]);
})

test("form value has added an removed values (arrays)", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "numbers",
            value: [1,2,5],
            useChangesAsValues: true
        }
    }));
    state = formReducers(state, updateFieldValue({evt: { target: { value: [2,3,4] } }, formId: "form1", fieldId: "FIELD1"}));
    expect(state).toHaveProperty("form1.value", { numbers_added: [3,4], numbers_removed: [1,5]});
})

test("form value has added an removed values (strings)", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "numbers",
            value: "1,2,3",
            useChangesAsValues: true,
            valueDelimiter: ","
        }
    }));
    state = formReducers(state, updateFieldValue({evt: { target: { value: ["2","4","5"] } }, formId: "form1", fieldId: "FIELD1"}));
    expect(state).toHaveProperty("form1.value", { numbers_added: "4,5", numbers_removed: "1,3"});
})

test("string options are converted to objects", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "OPTIONS_FIELD", 
            name: "hasOptions",
            options: ["one","two","three"]
        }
    }));

    expect(state).toHaveProperty("form1.fieldsById.OPTIONS_FIELD", expect.objectContaining({
        options: [{ label: "one", value: "one"},
                  { label: "two", value: "two"},
                  { label: "three", value: "three"}]
    }));
})

test("object options use value as label (when label missing)", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "OPTIONS_FIELD", 
            name: "hasOptions",
            options: [{ value: "one"},{ value: "two"},{ value: "three"}]
        }
    }));

    expect(state).toHaveProperty("form1.fieldsById.OPTIONS_FIELD", expect.objectContaining({
        options: [{ label: "one", value: "one"},
                  { label: "two", value: "two"},
                  { label: "three", value: "three"}]
    }));
})

test("object options use label as value (when value missing)", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "OPTIONS_FIELD", 
            name: "hasOptions",
            options: [{ value: "one"},{ value: "two"},{ value: "three"}]
        }
    }));

    expect(state).toHaveProperty("form1.fieldsById.OPTIONS_FIELD", expect.objectContaining({
        options: [{ label: "one", value: "one"},
                  { label: "two", value: "two"},
                  { label: "three", value: "three"}]
    }));
})

test("omit on specificic value", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "optional",
            value: "include",
            omitWhenValueIs: ["omit"]
        }
    }));
    expect(state).toHaveProperty("form1.value", { optional: "include" });
    state = formReducers(state, updateFieldValue({formId: "form1", fieldId: "FIELD1", value:"omit"}));
    expect(state).toHaveProperty("form1.value", {});
})

test("omit when hidden", () => {
    let state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "optional",
            value: "include",
            isVisible: false,
            omitWhenHidden: true
        }
    }));
    expect(state).toHaveProperty("form1.value", {});

    state = formReducers({}, registerForm({formId: "form1"}));
    state = formReducers(state, registerField({ 
        formId: "form1", 
        field: {
            fieldId: "FIELD1", 
            name: "optional",
            value: "include",
            omitWhenHidden: true
        }
    }));
    expect(state).toHaveProperty("form1.value", { optional: "include" });
})
