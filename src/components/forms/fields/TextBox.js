/**
 * @module
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateFieldValue } from "../../../actions/formActions";

const TextBox = ({ onChange, fieldId, formId }) => (
    <input type="text"
           onChange={(evt) => onChange({ evt, formId, fieldId })}></input>
)

TextBox.propTypes = {
    fieldId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

// const getVisibleTodos = (todos, filter) => {
//   switch (filter) {
//     case "SHOW_ALL":
//       return todos
//     case "SHOW_COMPLETED":
//       return todos.filter(t => t.completed)
//     case "SHOW_ACTIVE":
//       return todos.filter(t => !t.completed)
//   }
// }

const mapStateToProps = (state) => {
    return {
        // todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onChange: ({ evt, formId, fieldId }) => {
          dispatch(updateFieldValue({ evt, formId: ownProps.formId, fieldId }))
        }
    }
}

const TextBoxContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TextBox);

export default TextBoxContainer;