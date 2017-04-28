import React, { Component } from "react";
import "./App.css";

import BasicFieldExample from "./fragments/examples/forms/BasicFieldExample";
import DynamicBehaviourExample from "./fragments/examples/forms/DynamicBehaviourExample";
import ValidationExample from "./fragments/examples/forms/ValidationExample";
import OptionsExample from "./fragments/examples/forms/OptionsExample";
import MultipleFieldsPerNameExample from "./fragments/examples/forms/MultipleFieldsPerNameExample";

class App extends Component {
    render() {
        return (
            <section>
                <h1>Welcome to Studious Fiesta</h1>
                <p>Studious Fiesta (named suggested by GitHub) is a demonstration of React and Redux capabilities</p>
                <h3>Form controls</h3>

                <BasicFieldExample />
                <DynamicBehaviourExample />
                <ValidationExample />
                <OptionsExample />
                <MultipleFieldsPerNameExample />
            </section>

        );
    }
}

export default App;
