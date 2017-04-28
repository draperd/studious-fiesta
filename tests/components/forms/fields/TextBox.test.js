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
import TextBox from "../../../../src/components/forms/fields/TextBox"; 

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

test("A fieldId should be generated if not provided", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <TextBox></TextBox>
            </Form>
        </Provider>
    );

    const state = store.getState();
    expect(state).toHaveProperty("forms.FORM1.fieldsById");
    expect(Object.keys(state.forms.FORM1.fieldsById)[0]).not.toEqual("undefined");
})

test("value can be updated with a generated fieldId", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <TextBox name="test"></TextBox>
            </Form>
        </Provider>
    );

    let state = store.getState();
    expect(state.forms.FORM1.value).toEqual({});

    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(1);
    inputs.node.value = "updated";
    inputs.simulate("change", inputs.at(1));

    state = store.getState();
    expect(state.forms.FORM1.value).toEqual({ test: "updated" });
})

test("visibility should change on value", () => {
    wrapper = mount(
        <Provider store={store}>
            <Form formId="FORM1">
                <TextBox fieldId="FIELD1"
                         visibleWhen={ [ { fieldId: "FIELD2", is: [ "show" ] }]}></TextBox>
                <TextBox fieldId="FIELD2"></TextBox>
            </Form>
        </Provider>
    );

    // Initially the first field should be hidden because the second field is not "show"
    const inputs = wrapper.find("input");
    expect(inputs).toHaveLength(2);
    chaiExpect(inputs.first()).to.have.style("display", "none");
    chaiExpect(inputs.at(1)).to.have.style("display", "inline-block");

    // Change the second field to "show" to reveal the first field
    inputs.at(1).node.value = "show";
    inputs.at(1).simulate("change", inputs.at(1));
    chaiExpect(inputs.first()).to.have.style("display", "inline-block");
    
    // Change the second field to "shows" to hide the first child again
    inputs.at(1).node.value = "shows";
    inputs.at(1).simulate("change", inputs.at(1));
    chaiExpect(inputs.first()).to.have.style("display", "none");
})

