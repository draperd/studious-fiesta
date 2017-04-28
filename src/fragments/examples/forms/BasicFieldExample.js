import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import TextBox from "../../../components/forms/fields/TextBox";

import "../css/Examples.css";

class BasicFieldExample extends Component {
    render() {
        return (
            <article>
            <h4>Basic Field Configuration</h4>
            <p>This describes the basic use of the field and wrapper components. Don't worry - it gets more interesting later on</p>
            <Form>

                <div className="example-row">
                    <div className="example-column"><p>This is the most simple of examples. It is just a TextBox where the value entered is assigned to
                                                       against the "name" attribute in the overall form value.</p></div>
                    <div className="example-column">
                        <TextBox name="simpleTextBox" />
                    </div>
                    <div className="example-column example-code">
{`<TextBox name="simpleTextBox" />`}
                    </div>
                </div>

                <div className="example-row">
                    <div className="example-column"><p>It's much more useful to wrap the field with some additional information about its purpose. This
                                                       shows the basic example wrapper but other implementations to provide alternative styling and
                                                       behaviour can easily be used with the same set of fields. Notice that the properties of the
                                                       FieldWrapper are automatically cascaded down to the TextBox.</p></div>
                    <div className="example-column">
                        <FieldWrapper name="wrappedTextBox"
                                      label="Enter some text"
                                      description="This is an example of a wrapped TextBox">
                            <TextBox />
                        </FieldWrapper>
                    </div>
                    <div className="example-column example-code">
{`<FieldWrapper name="wrappedTextBox"
              label="Enter some text"
              description="This is an example of a wrapped TextBox">
    <TextBox />
</FieldWrapper>`}
                    </div>
                </div>

                <div className="example-row">
                    <div className="example-column"><p>Fields can be configured to be hidden, disabled and required as well as given an initial value.
                                                       Note how the "Submit Form" button for this form is disabled because a required field has not been provided
                                                       with any data. Enter some text to see the button become enabled.</p></div>
                    <div className="example-column">
                        <FieldWrapper name="hidden"
                                      label="You can't see me"
                                      isVisible={false}>
                            <TextBox />
                        </FieldWrapper>
                        <FieldWrapper name="disabled"
                                      label="You can't edit me"
                                      description="This field is disabled"
                                      value="locked"
                                      isDisabled={true}>
                            <TextBox />
                        </FieldWrapper>
                        <FieldWrapper name="required"
                                      label="Input needed"
                                      description="This field must have a value for the form submit button to be enabled"
                                      isRequired={true}>
                            <TextBox />
                        </FieldWrapper>
                    </div>
                    <div className="example-column example-code">
{`<FieldWrapper name="hidden"
              label="You can't see me"
              isVisible={false}>
    <TextBox />
</FieldWrapper>
<FieldWrapper name="disabled"
              label="You can't edit me"
              description="This field is disabled"
              value="locked"
              isDisabled={true}>
    <TextBox />
</FieldWrapper>
<FieldWrapper name="required"
              label="Input needed"
              description="This field must have a value for the form submit button to be enabled"
              isRequired={true}>
    <TextBox />
</FieldWrapper>`}
                    </div>
                </div>
                <div className="example-row">
                    <div className="example-column">This is a button with access to the form state.</div>
                    <div className="example-column">
                        <SubmitFormButton label="Submit Form" />
                    </div>
                    <div className="example-column example-code">
{`<SubmitFormButton label="Submit Form" />`}
                    </div>
                </div>
                <div className="example-row">
                    <div className="example-column">This component is used just to demonstrate the value that the form holds</div>
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

export default BasicFieldExample;

