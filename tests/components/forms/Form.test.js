import React from "react";
import ReactDOM from "react-dom";
import {mount} from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";

import Form from "../../../src/components/forms/Form";
import SubmitFormButton from "../../../src/components/forms/SubmitFormButton";
import FieldWrapper from "../../../src/components/forms/fields/wrappers/FieldWrapper";
import TextBox from "../../../src/components/forms/fields/TextBox"; 

import combinedReducers from "../../../src/reducers/combined";

let wrapper, store, mockWarn;

beforeEach(() => {
    mockWarn = console.warn = jest.fn(() => {});
    store = createStore(combinedReducers);
});

afterEach(() => {
    mockWarn.mockClear();
    wrapper && wrapper.unmount();
});

test("An id for the form should be generated if not provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form>
                <FieldWrapper>
                    <TextBox fieldId="FIELD1"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );

    const state = store.getState();
    expect(state).toHaveProperty("forms");
    expect(Object.keys(state.forms)).toHaveLength(1);
    expect(Object.keys(state.forms)[0]).not.toEqual(undefined);
})

test("The id provided for the form is set in the store", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1"> 
            </Form>
        </Provider>
    );

    expect(store.getState()).toHaveProperty("forms.FORM1");
})

test("form should pass id to field", () => {
    const form = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper>
                    <TextBox fieldId="FIELD1"></TextBox>
                </FieldWrapper>
                <SubmitFormButton label="Submit Form" />
            </Form>
        </Provider>
    );

    const state = store.getState();
    expect(state).toHaveProperty("forms.FORM1");
    expect(Object.keys(state.forms)).toHaveLength(1);
    form.unmount();
})