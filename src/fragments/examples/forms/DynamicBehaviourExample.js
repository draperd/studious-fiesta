import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import TextBox from "../../../components/forms/fields/TextBox";

import "../css/Examples.css";

class DynamicBehaviourExample extends Component {
    render() {
        return (
            <article>
                <h4>Configuring Dynamic Behaviour</h4>
                <p>This describes how it is possible to construct rules within the fields to allow them to update dynamically as values of
                   other fields change. By providing a "fieldId" for a field it can be used in behaviour rules of other fields. The 
                   "name" attribute is intentionally not used because (as you will see later) multiple fields can be used to represent a single 
                   form value.</p>
                <Form>
                    <div className="example-row">
                        <div className="example-column"><p>This field is configured with basic rules for visibility, disablement and requirement.
                                                           Update the value of the field below to trigger the changes. Note that you can configure
                                                           both negative ("isNot") rules and positive ("is") rules.</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="UPDATES"
                                          name="updates"
                                          label="Result"
                                          description="This field will update based on the value of the field below"
                                          visibleWhen={[
                                              { fieldId: "UPDATE", isNot: ["hide"]}
                                          ]}
                                          disabledWhen={[
                                              { fieldId: "UPDATE", is: ["disabled"]}
                                          ]}
                                          requiredWhen={[
                                              { fieldId: "UPDATE", is: ["required","needed"]}
                                          ]}>
                                <TextBox />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="UPDATES"
              name="updates"
              label="Result"
              description="This field will update based on the value of the field below"
              visibleWhen={[
                  { fieldId: "UPDATE", isNot: ["hide"]}
              ]}
              disabledWhen={[
                  { fieldId: "UPDATE", is: ["disabled"]}
              ]}
              requiredWhen={[
                  { fieldId: "UPDATE", is: ["required","needed"]}
              ]}>
    <TextBox />
</FieldWrapper>`}
                        </div>
                    </div>

                    <div className="example-row">
                        <div className="example-column"><p>Change the value to anything other than "hide" for the field above to be visible.
                                                           If the value is "disabled" the field above will be disabled and when the value is
                                                           "required" or "needed" the field above will be required (look for the requirement indicator
                                                           and the changing state of the button).</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="UPDATE"
                                        name="triggerChanges"
                                        label="Trigger"
                                        description="Changing the value of this field will change the field above">
                                <TextBox />
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="UPDATE"
              name="triggerChanges"
              label="Trigger"
              description="Changing the value of this field will change the field above">
    <TextBox />
</FieldWrapper>`}
                        </div>
                    </div>

                    <div className="example-row">
                        <div className="example-column"><p></p></div>
                        <div className="example-column">
                            
                        </div>
                        <div className="example-column example-code">
{``}
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

export default DynamicBehaviourExample;

