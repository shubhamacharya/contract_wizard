/* eslint-disable no-undef */
import { useEffect, useState } from "react";

import {
  Form,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  FormGroup,
} from "react-bootstrap";

import RadioButtonOptions from "./RadioButtonOptions";
import jsonData from "../utils/codeSections.json";
import { indentCode } from "../utils/codeFormattor";

export default function ERC20({ setCode }) {
  {
    /* TODO: 
        1. Check after selected the mintable that if Access Control is selected or not
        2. Add Comments every where.
        3. Create conditional rendering for all other ERC Standards
    */
  }

  const [accessControl, setAccessControl] = useState(false);
  const [accessControlMenu] = useState(jsonData["accessControl"]);
  const [accessControlSelection, setAccessControlSelection] = useState("");

  const [upgradeability, setUpgradeabilityFeat] = useState(false);
  const [upgradeabilityMenu] = useState(jsonData["upgradeability"]);

  const [securityEmail, setSecurityEmail] = useState("");
  const [license, setLicense] = useState("MIT");

  const [name, setName] = useState("MyToken");
  const [symbol, setSymbol] = useState("MTK");
  const [premint, setPremint] = useState(0);
  const [disableAccessControl, setDisableAccessControl] = useState(false);

  const [natSpec, setNatSpec] = useState("");
  const [constructor, setConstructor] = useState("");
  const [constructorExt, setConstructorExt] = useState(
    `ERC20("${name}", "${symbol}")`
  );
  const [variables, setVariables] = useState("");
  const [imports, setImports] = useState(jsonData["erc20"]["mainImport"]);
  const [functions, setFunctions] = useState("");
  const [lastFunctions, setLastFunctions] = useState("");
  const [inheritance, setInheritance] = useState(["ERC20"]);

  let code = `  // SPDX-License-Identifier: ${license}
  pragma solidity ^0.8.9;
  ${imports}
  
  ${securityEmail}
  contract ${name} is ${[...inheritance]} {
    ${natSpec}
    constructor() ${constructorExt} {
      ${constructor}
    }
    ${functions !== "" ? functions : ""}
    ${lastFunctions !== "" ? lastFunctions : ""}
  }`;

  useEffect(() => {
    setCode(code);
  }, [
    code,
    setCode,
    accessControlSelection,
    setAccessControlSelection,
    imports,
    inheritance,
  ]);

  const [features, setFeatures] = useState(() => {
    let obj = {};
    jsonData["erc20"]["features"].forEach((feat) => {
      obj[feat] = false;
    });
    return obj;
  });

  const tooltip = (message) => (
    <Tooltip className="labels" id="tooltip">
      {message}
    </Tooltip>
  );

  const handleAccessControlSelection = (opt) => {
    let newInheritArray = inheritance;
    let tempImport = imports;

    let replaceString;
    if (opt === "Ownable") {
      // Setup contract for the Ownable Access control
      replaceString = `\n${indentCode(
        jsonData["erc20"]["Roles"]["imports"],
        2
      )}`;

      // Remove AccessControl extesion for Roles from contract if present
      if (newInheritArray.length > 1) {
        newInheritArray.pop("AccessControl");
      }

      // Delete the imports for Access Roles if present
      if (tempImport.includes(replaceString)) {
        tempImport = tempImport.replace(replaceString, "").trim();
      }

      // Delete the constructor code for Access Roles if present
      if (
        constructor.includes(
          `${indentCode(jsonData["erc20"]["Roles"]["constructors"]["main"], 2)}`
        )
      ) {
        setConstructor(
          constructor.replace(
            `${indentCode(
              jsonData["erc20"]["Roles"]["constructors"]["main"],
              2
            )}`,
            ""
          )
        );
      }

      // Add the Ownable requirements to contract.
      newInheritArray.push("Ownable");
      tempImport += `\n${indentCode(
        jsonData["erc20"]["Ownable"]["imports"],
        2
      )}`;
    } else if (opt === "Roles") {
      // Setup contract for the Roles Access control
      let constructorTemp = constructor;
      let variablesTemp = variables;
      let feat = features;

      // Check if the Mintable is selected or not
      if (feat["Mintable"]) {
        // Add the constructor code for mintable with access control as Roles
        constructorTemp += `${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["mintable"][0],
          4
        )}`;

        // Add the variable code for mintable with access control as Roles
        variablesTemp +=
          jsonData["erc20"]["Roles"]["constructors"]["mintable"][1];
      }
      if (features["Snapshots"]) {
        if (
          !constructorTemp.includes(
            indentCode(
              `${jsonData["erc20"]["Roles"]["constructors"]["snapshot"][0]}`,
              4
            )
          )
        ) {
          constructorTemp += indentCode(
            `${jsonData["erc20"]["Roles"]["constructors"]["snapshot"][0]}`,
            4
          );
        }
        variablesTemp +=
          jsonData["erc20"]["Roles"]["constructors"]["snapshot"][1];
      }

      replaceString = `\n${indentCode(
        jsonData["erc20"]["Ownable"]["imports"],
        2
      )}`;
      if (newInheritArray.length > 1) newInheritArray.pop("Ownable");
      if (tempImport.includes(replaceString)) {
        tempImport = tempImport.replace(replaceString, "").trim();
      }

      constructorTemp === ""
        ? (constructorTemp = `${indentCode(
            jsonData["erc20"]["Roles"]["constructors"]["main"],
            2
          )}`)
        : (constructorTemp += `\n${indentCode(
            jsonData["erc20"]["Roles"]["constructors"]["main"],
            2
          )}`);
      console.log(constructorTemp);
      newInheritArray.push("AccessControl");

      tempImport += `\n${indentCode(jsonData["erc20"]["Roles"]["imports"], 2)}`;
      setConstructor(constructorTemp);
      setVariables(variablesTemp);
    } else if (opt === "") {
      let newInheritArray = inheritance;
      newInheritArray.pop();

      let deleteImports = [
        `${indentCode(jsonData["erc20"]["Roles"]["imports"], 2)}`,
        `\n${indentCode(jsonData["erc20"]["Roles"]["imports"], 2)}`,
        `\n${indentCode(jsonData["erc20"]["Ownable"]["imports"], 2)}`,
        `${indentCode(jsonData["erc20"]["Ownable"]["imports"], 2)}`,
      ];

      let deleteCtors = [
        `${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["mintable"][0],
          2
        )}`,

        `\n${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["mintable"][0],
          2
        )}`,

        `${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["snapshot"][0],
          2
        )}`,

        `\n${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["snapshot"][0],
          2
        )}`,

        `${indentCode(jsonData["erc20"]["Roles"]["constructors"]["main"], 2)}`,
        `\n${indentCode(
          jsonData["erc20"]["Roles"]["constructors"]["main"],
          2
        )}`,
      ];

      let deleteVariables = [
        jsonData["erc20"]["Roles"]["constructors"]["mintable"][1],
        jsonData["erc20"]["Roles"]["constructors"]["snapshot"][1],
      ];

      /**
       * Delete All the imports done by Ownable or Roles if deselected
       */
      deleteImports.forEach((delStr) => {
        if (tempImport.includes(delStr)) {
          tempImport = tempImport.replace(delStr, "").trim();
        }
      });
      /**
       * Delete All the constructor definitions added by Ownable or Roles
       */
      let ctors = constructor;
      deleteCtors.forEach((delCtors) => {
        if (ctors.includes(delCtors)) {
          ctors = ctors.replace(delCtors, "").trim();
        }
      });
      /**
       * Delete All the variables definitions added by Ownable or Roles
       */
      let delVar = variables;
      deleteVariables.forEach((delVari) => {
        if (delVar.includes(delVari)) {
          delVar.replace(delVar, "").trim();
        }
      });
      setVariables(delVar);
      setConstructor(ctors);
      setInheritance(newInheritArray);
    }

    setAccessControlSelection(opt);
    setInheritance(newInheritArray);
    setImports(tempImport);
  };

  const handleUpgradibilitySelection = (opt, accessControl = "Ownable") => {
    if (opt === "Transparent") {
      setAccessControl("");
      setImports(jsonData["erc20"]["Transparent"]["imports"]);
      setNatSpec(jsonData["erc20"]["Transparent"]["comments"]);
      setInheritance(jsonData["erc20"]["Transparent"]["inheritance"]);
      setFunctions(jsonData["erc20"]["Transparent"]["functions"]);
      setConstructor(jsonData["erc20"]["Transparent"]["constructors"]);
    } else if (opt === "UUPS") {
      setAccessControl(accessControl);
      setInheritance(jsonData["erc20"]["UUPS"][accessControl]["inheritance"]);
      setFunctions(jsonData["erc20"]["UUPS"][accessControl]["functions"]);
      setConstructor(jsonData["erc20"]["UUPS"][accessControl]["constructors"]);
      setNatSpec(jsonData["erc20"]["UUPS"][accessControl]["comments"]);
    } else if (opt === "") {
      setAccessControl("");
      setInheritance(["ERC20"]);
      setFunctions("");
      setConstructor("");
      setNatSpec("");
      setImports(jsonData["erc20"]["mainImport"]);
    }
  };

  const setFeatureImport = (e) => {
    let reqImport = "";
    let reqFunction = "";
    let reqLastFunction = "";
    let constructorExtTemp = "";
    let featSelectionStatus = features;

    featSelectionStatus[e.target.id] = e.target.checked;
    setFeatures(featSelectionStatus);

    switch (e.target.id) {
      case "Mintable":
        reqFunction = indentCode(jsonData["mintable"]["erc20"]["functions"], 4);
        if (e.target.checked) {
          setFunctions(
            functions === ""
              ? `\n${reqFunction}`
              : functions + `\n${reqFunction}`
          );
          setAccessControl(true);
          setDisableAccessControl(true);
          handleAccessControlSelection(jsonData["accessControl"][0]);
        } else {
          setFunctions(functions.replace(`\n${reqFunction}`, "").trim());
          setAccessControl(false);
          setDisableAccessControl(false);
          handleAccessControlSelection("");
        }
        break;
      case "Burnable":
        reqImport = indentCode(jsonData["burnable"]["erc20"]["imports"], 2);
        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setInheritance([
            ...inheritance,
            ...jsonData["burnable"]["erc20"]["inheritance"],
          ]);
        } else {
          setInheritance(
            inheritance.filter((inherit) => {
              return ![
                ...jsonData["burnable"]["erc20"]["inheritance"],
              ].includes(inherit);
            })
          );
          setImports(imports.replace("\n" + reqImport, "").trim());
        }
        break;
      case "Pausable":
        reqImport = indentCode(jsonData["pausable"]["imports"], 2);
        reqFunction = indentCode(jsonData["pausable"]["functions"], 4);
        reqLastFunction = indentCode(
          jsonData["pausable"]["erc20"]["lastFunctions"],
          4
        );

        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setFunctions(
            functions === ""
              ? `\n${reqFunction}`
              : functions + `\n${reqFunction}`
          );
          setLastFunctions(
            lastFunctions === ""
              ? `\n${reqLastFunction}`
              : reqLastFunction + `\n${reqLastFunction}`
          );
          setAccessControl(true);
          setDisableAccessControl(true);
          setInheritance([
            ...inheritance,
            ...jsonData["pausable"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`\n${reqImport}`, "").trim());
          setFunctions(functions.replace(`\n${reqFunction}`, "").trim());
          setLastFunctions(
            lastFunctions.replace(`\n${reqLastFunction}`, "").trim()
          );
          setAccessControl(false);
          setDisableAccessControl(false);
          setInheritance(
            inheritance.filter((inherit) => {
              return ![...jsonData["pausable"]["inheritance"]].includes(
                inherit
              );
            })
          );
        }
        break;
      case "Permit":
        reqImport = indentCode(jsonData["erc20"]["permit"]["imports"], 2);
        constructorExtTemp = constructorExt;
        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setConstructorExt(
            constructorExtTemp +
              ` ${jsonData["erc20"]["permit"]["constructorExt"]}("${name}")`
          );
          setInheritance([
            ...inheritance,
            ...jsonData["erc20"]["permit"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`\n${reqImport}`, "").trim());
          setConstructorExt(
            constructorExtTemp
              .replace(` ${jsonData["erc20"]["permit"]["constructorExt"]}`, "")
              .trim()
          );
          setInheritance(
            inheritance.filter((inherit) => {
              return ![...jsonData["erc20"]["permit"]["inheritance"]].includes(
                inherit
              );
            })
          );
        }
        break;
      case "Votes":
        reqImport = indentCode(jsonData["votes"]["erc20"]["imports"], 2);
        constructorExtTemp = constructorExt;
        reqLastFunction = indentCode(
          jsonData["votes"]["erc20"]["lastFunctions"],
          4
        );

        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setLastFunctions(
            lastFunctions === "" || functions === ""
              ? `\n${reqLastFunction}`
              : reqLastFunction + `\n${reqLastFunction}`
          );
          setConstructorExt(
            constructorExtTemp +
              ` ${jsonData["votes"]["erc20"]["constructorExt"]}("${name}")`
          );
          setInheritance([
            ...inheritance,
            ...jsonData["votes"]["erc20"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`\n${reqImport}`, "").trim());
          setLastFunctions(
            lastFunctions.replace(`\n${reqLastFunction}`, "").trim()
          );
          setConstructorExt(
            constructorExtTemp
              .replace(` ${jsonData["votes"]["erc20"]["constructorExt"]}`, "")
              .trim()
          );
          setInheritance(
            inheritance.filter((inherit) => {
              return ![...jsonData["votes"]["erc20"]["inheritance"]].includes(
                inherit
              );
            })
          );
        }
        break;
      case "Flash Minting":
        reqImport = `${indentCode(
          jsonData["erc20"]["flashMinting"]["imports"],
          2
        )}`;
        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setInheritance([
            ...inheritance,
            ...jsonData["erc20"]["flashMinting"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`\n${reqImport}`, "").trim());
          setInheritance(
            inheritance.filter((inherit) => {
              return ![
                ...jsonData["erc20"]["flashMinting"]["inheritance"],
              ].includes(inherit);
            })
          );
        }
        break;
      case "Snapshots":
        reqImport = indentCode(jsonData["erc20"]["snapshots"]["imports"], 2);
        reqFunction = indentCode(
          jsonData["erc20"]["snapshots"]["functions"],
          4
        );
        reqLastFunction = indentCode(
          jsonData["erc20"]["snapshots"]["lastFunctions"],
          4
        );

        if (e.target.checked) {
          setImports(imports + `\n${reqImport}`);
          setFunctions(
            functions === ""
              ? `\n${reqFunction}`
              : functions + `\n${reqFunction}`
          );
          setLastFunctions(
            lastFunctions === ""
              ? `\n${reqLastFunction}`
              : reqLastFunction + `\n${reqLastFunction}`
          );
          setAccessControl(true);
          setDisableAccessControl(true);
          setInheritance([
            ...inheritance,
            ...jsonData["erc20"]["snapshots"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`\n${reqImport}`, "").trim());
          setFunctions(functions.replace(`\n${reqFunction}`, "").trim());
          setLastFunctions(
            lastFunctions.replace(`\n${reqLastFunction}`, "").trim()
          );
          setAccessControl(false);
          setDisableAccessControl(false);
          setInheritance(
            inheritance.filter((inherit) => {
              return ![
                ...jsonData["erc20"]["snapshots"]["inheritance"],
              ].includes(inherit);
            })
          );
        }
        break;
      default:
        return "";
    }
  };

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
              "Create an initial amount of tokens for the deployer."
            )}
          >
            <Form.Label className="labels">Premint</Form.Label>
          </OverlayTrigger>
          <Form.Control
            size="sm"
            type="text"
            placeholder={premint}
            onChange={(e) => {
              setPremint(e.target.value);
              setConstructor(
                e.target.value !== 0
                  ? `_mint(msg.sender, ${e.target.value} * 10 ** decimals());`
                  : ""
              );
            }}
          />
          <hr className="solid"></hr>
        </Col>
      </Row>
      <Form.Text className="fw-medium">FEATURES</Form.Text>
      {Object.keys(features).map((feature) => (
        <Form.Check
          type="switch"
          key={`${feature}`}
          id={`${feature}`}
          label={`${feature}`}
          onChange={(e) => setFeatureImport(e)}
        />
      ))}
      <hr className="solid"></hr>

      {/* Access Control Section  */}
      <RadioButtonOptions
        header="Access Control"
        disableAccessControl={disableAccessControl}
        menu={accessControlMenu}
        setter={setAccessControl}
        selected={accessControl}
        handleAccessControlSelection={handleAccessControlSelection}
        default={jsonData["accessControl"][0]}
      ></RadioButtonOptions>

      <hr className="solid"></hr>

      {/* Upgradeability Section  */}
      <RadioButtonOptions
        header="Upgradeability"
        menu={upgradeabilityMenu}
        setter={setUpgradeabilityFeat}
        selected={upgradeability}
        setCode={setCode}
        handleUpgradibilitySelection={handleUpgradibilitySelection}
        default={jsonData["upgradeability"][0]}
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
