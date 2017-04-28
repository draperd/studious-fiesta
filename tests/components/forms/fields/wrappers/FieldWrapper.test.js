import React from "react";
import ReactDOM from "react-dom";
import {mount} from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";

import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { expect as chaiExpect } from "chai"
chai.use(chaiEnzyme());

import { mapValues } from "lodash";

import Form from "../../../../../src/components/forms/Form";
import FieldWrapper from "../../../../../src/components/forms/fields/wrappers/FieldWrapper"; 
import { fieldWrapperCssClasses as css } from "../../../../../src/components/forms/fields/wrappers/FieldWrapper"; 
import TextBox from "../../../../../src/components/forms/fields/TextBox"; 
import combinedReducers from "../../../../../src/reducers/combined";

const selectors = mapValues(css, (raw) => '.' + raw);


let mockWarn, store, wrapper;
beforeEach(() => {
    mockWarn = console.warn = jest.fn(() => {});
    store = createStore(combinedReducers);
});

afterEach(() => {
    mockWarn.mockClear();
    wrapper.unmount();
});

test("A fieldId should be generated if not provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper>
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );

    const state = store.getState();
    expect(state).toHaveProperty("forms.FORM1.fieldsById");
    expect(Object.keys(state.forms.FORM1.fieldsById)[0]).not.toEqual("undefined");
})


test("visibility should change on value", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       visibleWhen={ [ { fieldId: "FIELD2", is: [ "show" ] }]}>
                    <TextBox ></TextBox>
                </FieldWrapper>
                <FieldWrapper fieldId="FIELD2">
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );

    // Initially the first field should be hidden because the second field is not "show"
    const wrappers = wrapper.find(selectors.base);
    const inputs = wrapper.find("input");
    expect(wrappers).toHaveLength(2);
    chaiExpect(wrappers.first()).to.have.style("display", "none");
    chaiExpect(wrappers.at(1)).to.have.style("display", "block");

    // Change the second field to "show" to reveal the first field
    inputs.at(1).node.value = "show";
    inputs.at(1).simulate("change", inputs.at(1));
    chaiExpect(wrappers.first()).to.have.style("display", "block");
    
    // Change the second field to "shows" to hide the first child again
    inputs.at(1).node.value = "shows";
    inputs.at(1).simulate("change", inputs.at(1));
    chaiExpect(wrappers.first()).to.have.style("display", "none");
})

test("label should be shown", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       label="This is a label">
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.label)).to.have.text("This is a label");
})

test("description should NOT be shown", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1">
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.description)).toHaveLength(0);
})

test("description should NOT be shown", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       description="This is a description">
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.description)).to.have.text("This is a description");
})

test("validation errors are displayed", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       validWhen={{
                           lengthIsGreaterThan: {
                               length: 4,
                               message: "Error"
                           }
                       }}>
                    <TextBox value="bob"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.base)).to.have.style("display", "block");
    chaiExpect(wrapper.find(selectors.errors)).to.have.text("Error");
    expect(wrapper.find(selectors.invalid)).toHaveLength(1);
})

test("validation errors are NOT displayed", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       validWhen={{
                           lengthIsGreaterThan: {
                               length: 4,
                               message: "Error"
                           }
                       }}>
                    <TextBox value="passes test"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.errors)).toHaveLength(0);
})

test("required class name is applied (rule)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="REQUIRED_WHEN_1"
                       requiredWhen={ [ { fieldId: "FIELD2", is: [ "required" ] }]}>
                    <TextBox></TextBox>
                </FieldWrapper>
                <FieldWrapper fieldId="FIELD2">
                    <TextBox value="required"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(1);
})

test("required class name is applied (declaration)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="REQUIRED_DECLARATION"
                       isRequired={true}>
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(1);
})

test("required class name is NOT applied", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       isRequired={false}>
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(0);
})

test("disabled class is applied (rule)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       disabledWhen={ [ { fieldId: "FIELD2", is: [ "disable" ] }]}>
                    <TextBox></TextBox>
                </FieldWrapper>
                <FieldWrapper fieldId="FIELD2">
                    <TextBox value="disable"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.disabled)).toHaveLength(1);
})

test("disabled class is applied (declaration)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                       isDisabled={true}>
                    <TextBox></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.disabled)).toHaveLength(1);
})

test("multiple fields assigning updating one attribute", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <FieldWrapper fieldId="FIELD1"
                         name="data"
                         value="initial"
                         omitWhenValueIs={["custom"]}>
                    <TextBox/>
                </FieldWrapper>
                <FieldWrapper fieldId="FIELD2"
                         name="data"
                         omitWhenHidden={true}
                         value="test"
                         visibleWhen={ [{ fieldId: "FIELD1", is: [ "custom" ]}] }>
                    <TextBox/>
                </FieldWrapper>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(1)).to.have.style("display", "none");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", { data: "initial" });

    inputs.at(0).node.value = "custom";
    inputs.at(0).simulate("change", inputs.at(0));

    chaiExpect(inputs.at(1)).to.have.style("display", "inline-block");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", { data: "test" });
})