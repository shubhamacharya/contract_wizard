import { useState } from "react";
import { Form } from "react-bootstrap";

export default function RadioButtonOptions(props) {
  const [selectedOpt, setSelectedOpt] = useState(props.default);

  const handleSelection = (selectionId) => {
    props.setAccessControlSelection(selectionId);
    if (props.handleAccessControlSelection) {
      props.handleAccessControlSelection(selectionId);
    }
    else if (props.handleUpgradibilitySelection) {
      props.handleUpgradibilitySelection(selectionId);
    }
  };

  return (
    <>
      <Form.Text className="fw-medium">
        {props.header}
        <Form.Check
          type="switch"
          id={`${props.header}-switch`}
          inline={true}
          onChange={(e) => {
            props.setter(e.target.checked);
            setSelectedOpt(e.target.id);
         
            if (e.target.checked) {
              setSelectedOpt(props.default);
              handleSelection(props.default);
            } else {
              setSelectedOpt(props.default);
              handleSelection("");
            }
          }}
          checked={props.selected}
          disabled={
            props.header === "Access Control" && props.disableAccessControl
          }
        />
      </Form.Text>
      {props.menu.map((opt) => (
        <Form.Check
          key={`${opt}`}
          type="radio"
          disabled={!props.selected}
          onChange={(e) => {
            setSelectedOpt(e.target.id);
            handleSelection(e.target.id);
          }}
          name={`${props.header.replace(" ", "-")}-grp`}
          label={`${opt}`}
          id={`${opt}`}
          checked={opt === selectedOpt && props.selected}
        />
      ))}
    </>
  );
}
