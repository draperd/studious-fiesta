import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import TextBox from "../../../components/forms/fields/TextBox";

import "../css/Examples.css";

class ValidationExample extends Component {
    render() {
        return (
            <article>
                <h4>Configuring Validation</h4>
                <p>Fields can be configured with zero or more validators to ensure that the value entered is acceptable. At the moment
                   there is only one validator available, but more will be added soon.
                </p>
                <Form>
                    <div className="example-row">
                        <div className="example-column"><p>This field must be provided with a value that is at least 5 characters in length
                                                           otherwise the form will in an invalid state.</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="MINLENGTH5"
                                          name="minlength5"
                                          label="Minimum Length 5"
                                          description="If the value has less than four characters the field will be in error"
                                          validWhen={{
                                              lengthIsGreaterThan: {
                                                  length: 4,
                                                  message: "Error!"
                                              }
                                          }}>
                                <TextBox></TextBox>
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="MINLENGTH5"
              name="minlength5"
              label="Minimum Length 5"
              description="If the value has less than four characters the field will be in error"
              validWhen={{
                  lengthIsGreaterThan: {
                      length: 4,
                      message: "Error!"
                  }
              }}>
    <TextBox></TextBox>
</FieldWrapper>`}
                        </div>
                    </div>

                    <div className="example-row">
                        <div className="example-column"></div>
                        <div className="example-column">
                            <SubmitFormButton label="Submit Form" />
                        </div>
                        <div className="example-column example-code">
{`<SubmitFormButton label="Submit Form" />`}
                        </div>
                    </div>
                    <div className="example-row">
                        <div className="example-column"></div>
                        <div className="example-column">
                            <DisplayFormValue />
                        </div>
                        <div className="example-column example-code">
{`<DisplayFormValue />`}
                        </div>
                    </div>
                    
                </Form>
            </article>
        );
    }
}

export default ValidationExample;

