import React, { Component } from "react";
import "./App.css";

import Form from "./components/forms/Form";
import { default as FieldWrapper } from "./components/forms/fields/wrappers/Basic";
import TextBox from "./components/forms/fields/TextBox";

class App extends Component {
    render() {
        return (
            <Form>
                <FieldWrapper>
                    <TextBox fieldId="FIELD1"
                             visibleWhen={ [
                                 { fieldId: "FIELD2", is: [ "show" ] }
                             ] }></TextBox>
                    <TextBox fieldId="FIELD2"></TextBox>
                </FieldWrapper>
            </Form>

        );
    }
}

export default App;
