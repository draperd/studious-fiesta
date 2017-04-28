import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import RadioButtons from "../../../components/forms/fields/RadioButtons";

import "../css/Examples.css";

class OptionsExample extends Component {
    render() {
        return (
            <article>
                <h4>Configuring Options</h4>
                <p>Some field components (such as RadioButtons) rely on options being available to allow the user to set a value. At the moment
                   only static options are supported but in the future support will be available for options to be loaded dynamically and for
                   options to be refreshed as other fields in the form are changed.
                </p>
                <Form>
                    <div className="example-row">
                        <div className="example-column"><p>This is a simple example of a RadioButtons component rendering 3 options. No radio button
                                                           is initially checked because no value has been provided. The options are defined as a simple
                                                           array of strings.</p></div>
                        <div className="example-column">
                            <FieldWrapper name="simple_options"
                                          label="Options"
                                          description="Some options rendered as radio buttons"
                                          options={["one","two","three"]}>
                                <RadioButtons />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper name="simple_options"
              label="Options"
              description="Some options rendered as radio buttons"
              value="two"
              options={["one","two","three"]}>
    <RadioButtons />
</FieldWrapper>`}
                        </div>
                    </div>
                    <div className="example-row">
                        <div className="example-column"><p>This is an example using complex options where the "label" and "value" are different
                                                           to enable localization of labels and complex values to be set in the form value.</p></div>
                        <div className="example-column">
                            <FieldWrapper name="complex_options"
                                          label="Options"
                                          description="Some options rendered as radio buttons"
                                          value={3}
                                          options={[ { label: "one", value: 1 },
                                                     { label: "two", value: 2 },
                                                     { label: "three", value: 3 }]}>
                                <RadioButtons />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper name="complex_options"
              label="Options"
              description="Some options rendered as radio buttons"
              value={3}
              options={[ { label: "one", value: 1 },
                          { label: "two", value: 2 },
                          { label: "three", value: 3 }]}>
    <RadioButtons />
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

export default OptionsExample;

