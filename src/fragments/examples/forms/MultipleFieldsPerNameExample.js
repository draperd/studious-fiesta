import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import RadioButtons from "../../../components/forms/fields/RadioButtons";
import TextBox from "../../../components/forms/fields/TextBox";

import "../css/Examples.css";

class MultipleFieldsPerNameExample extends Component {
    render() {
        return (
            <article>
                <h4>Multiple Fields Per Name</h4>
                <p>As mentioned earlier it is possible to have multiple fields that can provide values for the same attribute in the form. This
                   is done to support use cases like the one shown below. Care must be taken to ensure that the fields are configured appropriately
                   so that only one field sets the value (otherwise it's a case of "last one wins").
                </p>
                <Form>
                    <div className="example-row">
                        <div className="example-column"><p>This field allows selection from a set of fixed options or choose to enter
                                                           a custom value. The field will only provide a value to the form when the "omitWhenValueIs"
                                                           rule is not satisfied. This rule will be triggered when selecting the custom option.</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="FIXED_OPTION"
                                          name="data"
                                          label="Options"
                                          description="Select an option or choose to enter a custom value"
                                          value="One"
                                          omitWhenValueIs={["CUSTOM"]}
                                          options={["One","Two","Three", { label: "Enter a custom value", value:"CUSTOM"}]}>
                                <RadioButtons />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="FIXED_OPTION"
              name="data"
              label="Options"
              description="Select an option or choose to enter a custom value"
              value="One"
              omitWhenValueIs={["CUSTOM"]}
              options={["One",
                        "Two",
                        "Three", 
                        { label: "Enter a custom value", 
                          value:"CUSTOM"}]}>
    <RadioButtons />
</FieldWrapper>`}
                        </div>
                    </div>

                    <div className="example-row">
                        <div className="example-column"><p>This TextBox is configured with a rule that ensures it is hidden unless the field
                                                           above has the value "CUSTOM". It will only provide a value to the form when it
                                                           is visible - this is achieved through the use of "omitWhenHidden"</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="CUSTOM_OPTION"
                                          name="data"
                                          label="Custom"
                                          description="Enter a custom value"
                                          omitWhenHidden={true}
                                          visibleWhen={[
                                              { fieldId: "FIXED_OPTION", is: ["CUSTOM"]}
                                          ]}>
                                <TextBox />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="CUSTOM_OPTION"
              name="data"
              label="Custom"
              description="Enter a custom value"
              omitWhenHidden={true}
              visibleWhen={[
                  { fieldId: "FIXED_OPTION", is: ["CUSTOM"]}
              ]}>
    <TextBox />
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

export default MultipleFieldsPerNameExample;

