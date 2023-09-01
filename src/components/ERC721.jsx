import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import RadioButtonOptions from "./RadioButtonOptions";
import jsonData from "../utils/codeSections.json";

export default function ERC721({ setCode }) {
  const [name, setName] = useState("MyToken");
  const [symbol, setSymbol] = useState("MTK");
 
  const [securityEmail, setSecurityEmail] = useState("");
  const [license, setLicense] = useState("MIT");

  const tooltip = (message) => (
    <Tooltip className="labels" id="tooltip">
      {message}
    </Tooltip>
  );

  let code = ``;

  useEffect(() => {
    setCode(code);
  }, [code, setCode]);
  const [features, setFeatures] = useState(() => {
    let obj = {};
    jsonData["erc721"]["features"].forEach((feat) => {
      obj[feat] = false;
    });
    return obj;
  });
  return (
    <Form className="d-inline vw-60 vh-100">
      <Form.Text className="fw-medium">SETTINGS</Form.Text>
      <Row>
        <Col xs={7}>
          <Form.Label className="labels">Name</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>

        <Col xs={3}>
          <Form.Label className="labels">Symbol</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={10}>
          <OverlayTrigger
            placement="right"
            overlay={tooltip(
              "Will be concatenated with token IDs to generate the token URIs."
            )}
          >
            <Form.Label className="labels">Base URI</Form.Label>
          </OverlayTrigger>
          <Form.Control size="sm" type="text" placeholder="https://" />
          <hr className="solid"></hr>
        </Col>
      </Row>
      <Form.Text className="fw-medium">FEATURES</Form.Text>
      {Object.keys().map((feature) => (
        <Form.Check
          type="switch"
          key={`${feature}`}
          id={`${feature}`}
          label={`${feature}`}
        />
      ))}
      <hr className="solid"></hr>

      {/* Access Control Section  */}
      <RadioButtonOptions
        header="Access Control"
        default={jsonData["erc20"]["accessControl"][0]}
      ></RadioButtonOptions>

      <hr className="solid"></hr>

      {/* Upgradeability Section  */}
      <RadioButtonOptions
        header="Upgradeability"
        setCode={setCode}
        default={jsonData["erc20"]["upgradeability"][0]}
      ></RadioButtonOptions>

      <hr className="solid"></hr>
      <Form.Text className="fw-medium">Info</Form.Text>
      <FormGroup>
        <Form.Label className="labels">Security Contact</Form.Label>
        <Form.Control
          size="sm"
          type="email"
          placeholder="security@example.com"
          onChange={(e) =>
            setSecurityEmail(`/// @custom:security-contact ${e.target.value}`)
          }
        />
      </FormGroup>
      <FormGroup>
        <Form.Label className="labels">License</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          placeholder="MIT"
          onChange={(e) => setLicense(e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}
