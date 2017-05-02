import React, { Component } from "react";

import Form from "../../../components/forms/Form";
import SubmitFormButton from "../../../components/forms/SubmitFormButton";
import DisplayFormValue from "../../../components/forms/DisplayFormValue";
import FieldWrapper from "../../../components/forms/fields/wrappers/FieldWrapper";
import CheckBoxes from "../../../components/forms/fields/CheckBoxes";

import "../css/Examples.css";

class DataManipulationExample extends Component {
    render() {
        return (
            <article>
                <h4>Data Manipulation</h4>
                <p>Sometimes it is necessary to manipulate data in an out of a form. This section shows some options for handling this type of data manipulation.</p>
                <Form>
                    <div className="example-row">
                        <div className="example-column"><p>This field is configured to track the options that are added and removed from the initial value.
                                                           This is an example of how a single field can generate multiple values in the resulting form (one 
                                                           for the added items and one for the removed items).</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="CHECKBOXES"
                                          name="checkboxes"
                                          label="Added and removed"
                                          description="This tracks the added and removed values"
                                          value={["two","four"]}
                                          options={["one","two","three","four","five"]}
                                          useChangesAsValues={true}>
                                <CheckBoxes></CheckBoxes>
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="CHECKBOXES"
              name="checkboxes"
              label="Added and removed"
              description="This tracks the added and removed values"
              value={["two","four"]}
              options={["one","two","three","four","five"]}
              useChangesAsValues={true}>
    <CheckBoxes></CheckBoxes>
</FieldWrapper>`}
                        </div>
                    </div>

                    <div className="example-row">
                        <div className="example-column"><p>In some cases you may want to convert a string value into an array so that items can
                                                           be added and removed from it. This can be done by providing a "valueDelimiter" configuration.
                                                           In this example alternative suffices are provided for logging the added and removed items.</p></div>
                        <div className="example-column">
                            <FieldWrapper fieldId="CHECKBOX_STRING"
                                          name="checkboxString"
                                          label="Added and removed"
                                          description="This tracks the added and removed values from a string value"
                                          value="three,five"
                                          valueDelimiter=","
                                          options={["one","two","three","four","five"]}
                                          useChangesAsValues={true}
                                          addedSuffix="_extra"
                                          removedSuffix="_less">
                                <CheckBoxes></CheckBoxes>
                            </FieldWrapper>
                        </div>
                        <div className="example-column example-code">
{`<FieldWrapper fieldId="CHECKBOX_STRING"
              name="checkboxString"
              label="Added and removed"
              description="This tracks the added and removed values from a string value"
              value="three,five"
              valueDelimiter=","
              options={["one","two","three","four","five"]}
              useChangesAsValues={true}
              addedSuffix="_extra"
              removedSuffix="_less">
    <CheckBoxes></CheckBoxes>
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

export default DataManipulationExample;

