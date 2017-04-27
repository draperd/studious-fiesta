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
import Basic from "../../../../../src/components/forms/fields/wrappers/Basic"; 
import { basicWrapperCssClasses as css } from "../../../../../src/components/forms/fields/wrappers/Basic"; 
import TextBox from "../../../../../src/components/forms/fields/TextBox"; 
import combinedReducers from "../../../../../src/reducers/combined";

const selectors = mapValues(css, (raw) => '.' + raw);

const store = createStore(combinedReducers);

let mockWarn;
beforeEach(() => {
    mockWarn = console.warn = jest.fn(() => {});
});

afterEach(() => {
    mockWarn.mockClear();
});

test("visibility should change on value", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       visibleWhen={ [ { fieldId: "FIELD2", is: [ "show" ] }]}>
                    <TextBox ></TextBox>
                </Basic>
                <Basic fieldId="FIELD2">
                    <TextBox></TextBox>
                </Basic>
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

    wrapper.unmount();
})

test("label should be shown", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       label="This is a label">
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.label)).to.have.text("This is a label");
    wrapper.unmount();
})

test("description should NOT be shown", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1">
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.description)).toHaveLength(0);
    wrapper.unmount();
})

test("description should NOT be shown", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       description="This is a description">
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.description)).to.have.text("This is a description");
    wrapper.unmount();
})

test("validation errors are displayed", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       validWhen={{
                           lengthIsGreaterThan: {
                               length: 4,
                               message: "Error"
                           }
                       }}>
                    <TextBox value="bob"></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find(selectors.base)).to.have.style("display", "block");
    chaiExpect(wrapper.find(selectors.errors)).to.have.text("Error");
    expect(wrapper.find(selectors.invalid)).toHaveLength(1);
    wrapper.unmount();
})

test("validation errors are NOT displayed", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       validWhen={{
                           lengthIsGreaterThan: {
                               length: 4,
                               message: "Error"
                           }
                       }}>
                    <TextBox value="passes test"></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.errors)).toHaveLength(0);
    wrapper.unmount();
})

test("required class name is applied (rule)", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="REQUIRED_WHEN_1"
                       requiredWhen={ [ { fieldId: "FIELD2", is: [ "required" ] }]}>
                    <TextBox></TextBox>
                </Basic>
                <Basic fieldId="FIELD2">
                    <TextBox value="required"></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(1);
    wrapper.unmount();
})

test("required class name is applied (declaration)", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="REQUIRED_DECLARATION"
                       isRequired={true}>
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(1);
    wrapper.unmount();
})

test("required class name is NOT applied", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       isRequired={false}>
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.required)).toHaveLength(0);
    wrapper.unmount();
})

test("disabled class is applied (rule)", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       disabledWhen={ [ { fieldId: "FIELD2", is: [ "disable" ] }]}>
                    <TextBox></TextBox>
                </Basic>
                <Basic fieldId="FIELD2">
                    <TextBox value="disable"></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.disabled)).toHaveLength(1);
    wrapper.unmount();
})

test("disabled class is applied (declaration)", () => {
    const wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <Basic fieldId="FIELD1"
                       isDisabled={true}>
                    <TextBox></TextBox>
                </Basic>
            </Form>
        </Provider>
    );
    expect(wrapper.find(selectors.disabled)).toHaveLength(1);
    wrapper.unmount();
})