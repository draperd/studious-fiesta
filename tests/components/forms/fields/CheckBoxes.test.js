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
import CheckBoxes from "../../../../src/components/forms/fields/CheckBoxes"; 

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
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"></CheckBoxes>
            </Form>
        </Provider>
    );
})

test("A fieldId should be generated if not provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              options={["one","two","three"]}></CheckBoxes>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(3);
})

test("The correct checkboxs are checked", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              value={["two","three"]}
                              options={["one","two","three"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find("input[type='checkbox'][value='two']")).to.be.checked();
    chaiExpect(wrapper.find("input[type='checkbox'][value='three']")).to.be.checked();
})

test("No checkboxs are initially checked when no value is provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              options={["one","two","three"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    chaiExpect(wrapper.find("input[type='checkbox'][value='one']")).to.not.be.checked();
    chaiExpect(wrapper.find("input[type='checkbox'][value='two']")).to.not.be.checked();
    chaiExpect(wrapper.find("input[type='checkbox'][value='three']")).to.not.be.checked();
})

test("checkboxs are visible", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              isVisible={true}
                              options={["one","two"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.style("display", "inline-block");
    chaiExpect(inputs.at(1)).to.have.style("display", "inline-block");
})

test("checkboxs are hidden", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              isVisible={false}
                              options={["one","two"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.style("display", "none");
    chaiExpect(inputs.at(1)).to.have.style("display", "none");
})

test("checkboxs are NOT disabled", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              isDisabled={false}
                              options={["one","two"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.not.have.attr("disabled");
    chaiExpect(inputs.at(1)).to.not.have.attr("disabled");
})

test("checkboxs are disabled", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              isDisabled={true}
                              options={["one","two"]}></CheckBoxes>
            </Form>
        </Provider>
    );
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.at(0)).to.have.attr("disabled", "");
    chaiExpect(inputs.at(1)).to.have.attr("disabled", "");
})

test("selecting a checkbox updates the form value", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="RADIO"
                              name="checkbox"
                              value={["one"]}
                              options={["one","two"]}></CheckBoxes>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:["one"]});
    inputs.at(1).simulate("change", { target: { checked: true, value: inputs.at(1).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:["one","two"]});
})

test("selecting a checkbox updates the form value (complex option with non-string value)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="CB1"
                              name="checkbox"
                              value={[1]}
                              options={[{ label: "one", value: 1 },{ label: "two", value: 2 }]}></CheckBoxes>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:[1]});
    inputs.at(1).simulate("change", { target: { checked: true, value: inputs.at(1).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:[1,2]});
})

test("de-selecting a checkbox updates the form value (complex option with non-string value)", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="CB1"
                              name="checkbox"
                              value={[1,2]}
                              options={[{ label: "one", value: 1 },{ label: "two", value: 2 }]}></CheckBoxes>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:[1,2]});
    inputs.at(1).simulate("change", { target: { checked: false, value: inputs.at(1).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox:[1]});
})

test("test adding and removed from delimited value", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <CheckBoxes fieldId="CB1"
                              name="checkbox"
                              value="2,4"
                              valueDelimiter=","
                              useChangesAsValues={true}
                              options={["1","2","3","4","5"]}></CheckBoxes>
            </Form>
        </Provider>
    );

    const inputs = wrapper.find("input");
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox_added:"", checkbox_removed:""});
    inputs.at(1).simulate("change", { target: { checked: false, value: inputs.at(1).node.value} });
    inputs.at(0).simulate("change", { target: { checked: true, value: inputs.at(0).node.value} });
    inputs.at(4).simulate("change", { target: { checked: true, value: inputs.at(4).node.value} });
    expect(store.getState()).toHaveProperty("forms.FORM1.value", {checkbox_added:"1,5", checkbox_removed:"2"});
})