import React from "react";
import ReactDOM from "react-dom";
import {mount} from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";

import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { expect as chaiExpect } from "chai"
chai.use(chaiEnzyme());

import Form from "../../../../src/components/forms/Form";
import RadioButtons from "../../../../src/components/forms/fields/RadioButtons"; 

import combinedReducers from "../../../../src/reducers/combined";

let mockWarn, store, wrapper;

beforeEach(() => {
    mockWarn = console.warn = jest.fn(() => {});
    store = createStore(combinedReducers);
});

afterEach(() => {
    mockWarn.mockClear();
    wrapper.unmount();
});

test("No error occurs without options", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"></RadioButtons>
            </Form>
        </Provider>
    );
})

test("A fieldId should be generated if not provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              options={["one","two","three"]}></RadioButtons>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(3);
})

test("The correct radio button is checked", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              value="two"
                              options={["one","two","three"]}></RadioButtons>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find("input[type='radio'][value='two']")).to.be.checked();
})

test("No radio buttons are initially checked when no value is provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              options={["one","two","three"]}></RadioButtons>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find("input[type='radio'][value='one']")).to.not.be.checked();
    chaiExpect(wrapper.find("input[type='radio'][value='two']")).to.not.be.checked();
    chaiExpect(wrapper.find("input[type='radio'][value='three']")).to.not.be.checked();
})

test("radio buttons are visible", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              isVisible={true}
                              options={["one","two"]}></RadioButtons>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.style("display", "inline-block");
    chaiExpect(inputs.at(1)).to.have.style("display", "inline-block");
})

test("radio buttons are hidden", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              isVisible={false}
                              options={["one","two"]}></RadioButtons>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.style("display", "none");
    chaiExpect(inputs.at(1)).to.have.style("display", "none");
})

test("radio buttons are NOT disabled", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              isDisabled={false}
                              options={["one","two"]}></RadioButtons>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.not.have.attr("disabled");
    chaiExpect(inputs.at(1)).to.not.have.attr("disabled");
})

test("radio buttons are disabled", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              isDisabled={true}
                              options={["one","two"]}></RadioButtons>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.attr("disabled", "");
    chaiExpect(inputs.at(1)).to.have.attr("disabled", "");
})

test("selecting a radio button updates the form value", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO"
                              name="radio"
                              value="one"
                              options={["one","two"]}></RadioButtons>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {radio:"one"});
    inputs.at(1).simulate("change", { target: { checked: true, value: inputs.at(1).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {radio:"two"});
})

test("selecting a radio button updates the form value (complex option with non-string value)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <RadioButtons fieldId="RADIO1"
                              name="radio"
                              value={1}
                              options={[{ label: "one", value: 1 },{ label: "two", value: 2 }]}></RadioButtons>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {radio:1});
    inputs.at(1).simulate("change", { target: { checked: true, value: inputs.at(1).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {radio:2});
})