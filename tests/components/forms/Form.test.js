import React from "react";
import ReactDOM from "react-dom";
import {mount} from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";

import Form from "../../../src/components/forms/Form";
import { default as FieldWrapper } from "../../../src/components/forms/fields/wrappers/Basic";
import TextBox from "../../../src/components/forms/fields/TextBox"; 

import combinedReducers from "../../../src/reducers/combined";

const store = createStore(combinedReducers);

test("form should pass id to field", () => {
    const form = mount(
        <Provider store={store}>
            <Form>
                <FieldWrapper>
                    <TextBox fieldId="FIELD1"></TextBox>
                </FieldWrapper>
            </Form>
        </Provider>
    );


})