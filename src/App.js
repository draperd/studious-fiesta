import React, { Component } from "react";
import "./App.css";

import Form from "./components/forms/Form";
import SubmitFormButton from "./components/forms/SubmitFormButton";
import DisplayFormValue from "./components/forms/DisplayFormValue";
import { default as FieldWrapper } from "./components/forms/fields/wrappers/Basic";
import TextBox from "./components/forms/fields/TextBox";

class App extends Component {
    render() {
        return (
            <section>
                <h1>Welcome to Studious Fiesta</h1>
                <p>Studious Fiesta (named suggested by GitHub) is a demonstration of React and Redux capabilities</p>
                <h3>Form controls</h3>
                <Form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <FieldWrapper fieldId="FIELD1"
                                                  name="f1"
                                                  label="Comes and goes"
                                                  description="This text box is hidden unless the box below has the value 'show'"
                                                  visibleWhen={[
                                                     { fieldId: "FIELD2", is: [ "show" ] }
                                                  ]}>
                                        <TextBox></TextBox>
                                    </FieldWrapper>
                                </td>
                                <td>
                                    This is a field that will show and reveal based on changes to other fields.
                                </td>
                                <td>
                                    <pre>
{`
<FieldWrapper fieldId="FIELD1"
                name="f1"
                label="Comes and goes"
                description="This text box is hidden unless the box below has the value 'show'"
                visibleWhen={[
                    { fieldId: "FIELD2", is: [ "show" ] }
                ]}>
    <TextBox></TextBox>
</FieldWrapper>
`}
                                    </pre>
                                </td>   
                            </tr>
                        </tbody>
                    </table>
                    

                    <FieldWrapper fieldId="FIELD2" 
                                name="f2"
                                label="Shows and hides"
                                description="Change the value to be 'show' to reveal a hidden text box">
                        <TextBox value="show"></TextBox>
                    </FieldWrapper>

                    <FieldWrapper fieldId="FIELD3" 
                                name="f3"
                                label="Four chars or more!"
                                description="If the value has less than four characters the field will be in error"
                                validWhen={{
                                    lengthIsGreaterThan: {
                                        length: 4
                                    }
                                }}>
                        <TextBox></TextBox>
                    </FieldWrapper>

                    <FieldWrapper fieldId="FIELD4" 
                                name="f4"
                                label="A Required field"
                                description="This fields required a value for the form to be enabled"
                                isRequired={true}>
                        <TextBox></TextBox>
                    </FieldWrapper>

                    <FieldWrapper fieldId="FIELD5" 
                                name="f5"
                                label="A Disabled field"
                                description="This field is disabled"
                                isDisabled={true}>
                        <TextBox></TextBox>
                    </FieldWrapper>

                    <SubmitFormButton label="Submit Form" />
                    <DisplayFormValue />
                </Form>
            </section>

        );
    }
}

export default App;
