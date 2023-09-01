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
import { indentCode, buildFeaturesList } from "../utils/codeFormattor";

export default function ERC({ setCode, tab }) {
  /* TODO: 
        1. Check after selected the mintable that if Access Control is selected or not
        2. Add Comments every where.
        3. Refactor handleAccessControl function / json file for access controls and extions.
        3. Create conditional rendering for all other ERC Standards
    */

  const [accessControl, setAccessControl] = useState(false);
  const [accessControlMenu] = useState(jsonData["accessControl"]);
  const [accessControlSelection, setAccessControlSelection] = useState("");
  const [activeTab, setActiveTab] = useState("erc20");

  const [upgradeability, setUpgradeabilityFeat] = useState(false);
  const [upgradeabilityMenu] = useState(jsonData["upgradeability"]);

  const [securityEmail, setSecurityEmail] = useState("");
  const [license, setLicense] = useState("MIT");

  const [name, setName] = useState("MyToken");
  const [symbol, setSymbol] = useState("MTK");
  const [premint, setPremint] = useState(0);
  const [baseURI, setBaseURI] = useState("");
  const [URI, setURI] = useState("");
  const [disableAccessControl, setDisableAccessControl] = useState(false);

  const [natSpec, setNatSpec] = useState("");
  const [constructor, setConstructor] = useState("");
  const [constructorExt, setConstructorExt] = useState(
    `ERC20("${name}", "${symbol}")`
  );
  const [variables, setVariables] = useState("");
  const [imports, setImports] = useState(jsonData[activeTab]["mainImport"]);
  const [functionComment, setFunctionComment] = useState("");
  const [functions, setFunctions] = useState("");
  const [lastFunctions, setLastFunctions] = useState("");
  const [inheritance, setInheritance] = useState([
    ...jsonData[activeTab]["inheritance"],
  ]);

  let code = `  // SPDX-License-Identifier: ${license}
  pragma solidity ^0.8.9;
  ${imports}
    
  ${securityEmail}
  contract ${name} is ${[...inheritance]} {
    ${natSpec}
    ${variables}
    constructor() ${constructorExt} {
      ${constructor}
    }
      ${functionComment !== "" ? functionComment : ""}
      ${functions !== "" ? functions : ""}
      ${lastFunctions !== "" ? lastFunctions : ""}
  }`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSetUp = (tab) => {
    setImports(jsonData[tab]["mainImport"]);
    setInheritance(jsonData[tab]["inheritance"]);
    tab === "erc1155"
      ? setConstructorExt(`${jsonData[tab]["inheritance"]}("${URI}")`)
      : setConstructorExt(
          `${jsonData[tab]["inheritance"]}("${name}", "${symbol}")`
        );
    setFeatures(buildFeaturesList(tab));
  };

  useEffect(() => {
    if (tab !== activeTab) {
      initialSetUp(tab);
    }
    setActiveTab(tab);
    setCode(code);
  }, [
    setCode,
    accessControlSelection,
    setAccessControlSelection,
    imports,
    inheritance,
    activeTab,
    setInheritance,
    license,
    securityEmail,
    name,
    natSpec,
    constructorExt,
    constructor,
    functions,
    lastFunctions,
    code,
    symbol,
    URI,
    tab,
    initialSetUp,
  ]);

  const [features, setFeatures] = useState(buildFeaturesList(activeTab));

  const tooltip = (message) => (
    <Tooltip className="labels" id="tooltip">
      {message}
    </Tooltip>
  );

  const removeRolesCode = () => {
    setImports((imports) =>
      imports.replace(`${indentCode(jsonData["Roles"]["imports"], 1)}`, "")
    );
    setInheritance((inheritance) =>
      [...inheritance].filter(
        (inherit) => !jsonData["Roles"]["inheritance"].includes(inherit)
      )
    );
    setConstructor((constructor) =>
      constructor.replace(
        `${indentCode(jsonData["Roles"]["constructors"]["main"], 2)}`,
        ""
      )
    );
    if (activeTab === "erc721" || activeTab === "erc1155") {
      setFunctions((functions) =>
        functions.replace(jsonData["Roles"]["functions"], "")
      );
    }

    // Delete Code of Mintable if selected
    if (
      constructor.includes(
        `${indentCode(jsonData["Roles"]["constructors"]["mintable"][0], 4)}`
      )
    ) {
      setConstructor((constructor) =>
        constructor.replace(
          `${indentCode(jsonData["Roles"]["constructors"]["mintable"][0], 4)}`,
          ""
        )
      );
    }
    if (
      variables.includes(
        `${indentCode(jsonData["Roles"]["constructors"]["mintable"][1], 4)}`
      )
    ) {
      setConstructor((variables) =>
        variables.replace(
          `${indentCode(jsonData["Roles"]["constructors"]["mintable"][1], 4)}`,
          ""
        )
      );
    }

    // Delete Code for pausable
    if (
      constructor.includes(
        `${indentCode(jsonData["Roles"]["constructors"]["pausable"][0], 2)}`
      )
    ) {
      setConstructor((constructor) =>
        constructor.replace(
          `${indentCode(jsonData["Roles"]["constructors"]["pausable"][0], 2)}`,
          ""
        )
      );
    }
    if (variables.includes(jsonData["Roles"]["constructors"]["pausable"][1])) {
      setVariables((variables) =>
        variables.replace(jsonData["Roles"]["constructors"]["pausable"][1], "")
      );
    }

    // Delete Code for snapshot
    if (
      constructor.includes(
        `${indentCode(jsonData["Roles"]["constructors"]["snapshot"][0], 2)}`
      )
    ) {
      setConstructor((constructor) =>
        constructor.replace(
          `${indentCode(jsonData["Roles"]["constructors"]["snapshot"][0], 2)}`,
          ""
        )
      );
    }
    if (
      variables.includes(
        `${indentCode(jsonData["Roles"]["constructors"]["snapshot"][1], 4)}`
      )
    ) {
      setConstructor((variables) =>
        variables.replace(
          `${indentCode(jsonData["Roles"]["constructors"]["snapshot"][1], 4)}`,
          ""
        )
      );
    }
  };

  const removeOwnableCode = () => {
    setImports((imports) =>
      imports.replace(`${indentCode(jsonData["Ownable"]["imports"], 1)}`, "")
    );
    setInheritance((inheritance) =>
      [...inheritance].filter(
        (inherit) => !jsonData["Ownable"]["inheritance"].includes(inherit)
      )
    );
  };

  const handleAccessControlSelection = (opt) => {
    if (opt === "Ownable") {
      // Remove code for the Roles access control if selected previously.
      removeRolesCode();

      // Set code for the Ownable access control
      if (!imports.includes(indentCode(jsonData["Ownable"]["imports"], 1))) {
        setImports(
          (imports) => imports + indentCode(jsonData["Ownable"]["imports"], 1)
        );
      }

      if (![...inheritance].includes(...jsonData["Ownable"]["inheritance"])) {
        setInheritance((inheritance) => [
          ...inheritance,
          ...jsonData["Ownable"]["inheritance"],
        ]);
      }
    } else if (opt === "Roles") {
      // Remove the code for the Ownable access control if selected previously.
      removeOwnableCode();

      // Set the code for Role access control.
      if (!imports.includes(indentCode(jsonData["Roles"]["imports"], 1))) {
        setImports(
          (imports) => imports + indentCode(jsonData["Roles"]["imports"], 1)
        );
      }
      if (![...inheritance].includes([...jsonData["Roles"]["inheritance"]])) {
        setInheritance(
          (inheritance) =>
            new Set([...inheritance, ...jsonData["Roles"]["inheritance"]])
        );
      }

      if (
        !constructor.includes(
          indentCode(jsonData["Roles"]["constructors"]["main"], 2)
        )
      ) {
        setConstructor(
          (constructor) =>
            constructor +
            indentCode(jsonData["Roles"]["constructors"]["main"], 2)
        );
      }

      if (activeTab === "erc721" || activeTab === "erc1155") {
        if (
          !functions.includes(indentCode(jsonData["Roles"]["functions"], 2))
        ) {
          setFunctions(
            (functions) =>
              functions + indentCode(jsonData["Roles"]["functions"], 2)
          );
        }
      }

      // Check if other features are selected or not

      // 1. Mintable
      if (features["Mintable"]) {
        setConstructor(
          (constructor) =>
            constructor +
            indentCode(jsonData["Roles"]["constructors"]["mintable"][0], 2)
        );

        setVariables(
          (variables) =>
            variables +
            indentCode(jsonData["Roles"]["constructors"]["mintable"][1], 2)
        );
      }

      // 2. Pausable
      if (features["Pausable"]) {
        setConstructor(
          (constructor) =>
            constructor +
            indentCode(jsonData["Roles"]["constructors"]["pausable"][0], 2)
        );

        setVariables(
          (variables) =>
            variables +
            indentCode(jsonData["Roles"]["constructors"]["pausable"][1], 2)
        );
      }

      // 3. Snapshot (ERC-20)
      if (features["Snapshot"]) {
        setConstructor(
          (constructor) =>
            constructor +
            indentCode(jsonData["Roles"]["constructors"]["snapshot"][0], 2)
        );

        setVariables(
          (variables) =>
            variables +
            indentCode(jsonData["Roles"]["constructors"]["snapshot"][1], 2)
        );
      }

      // 4. Updatable URI (ERC-1155)
      if (features["Updatable URI"]) {
      }
    } else if (opt === "") {
      removeOwnableCode();
      removeRolesCode();
    }
  };

  const handleUpgradibilitySelection = (opt, accessControl = "") => {
    if (imports.includes(jsonData[activeTab]["mainImport"])) {
      setImports((imports) =>
        imports.replace(jsonData[activeTab]["mainImport"], "")
      );
    }

    setConstructorExt((constructorExt) => (constructorExt = []));
    setInheritance(
      (inheritance) => (inheritance = jsonData["Transparent"]["inheritance"])
    );

    if (opt === "Transparent") {
      setAccessControl(accessControl);
      let tempFun =
        jsonData["Transparent"][activeTab]["imports"] +
        jsonData["Transparent"]["imports"];

      setImports((imports) => imports + tempFun);
      setNatSpec(jsonData["Transparent"]["comments"]);
      setInheritance(
        (inheritance) =>
          (inheritance = [
            ...inheritance,
            ...jsonData["Transparent"][activeTab]["inheritance"],
          ])
      );
      setFunctions(
        (functions) =>
          (functions += jsonData["Transparent"][activeTab]["functions"])
      );
      setConstructor(jsonData["Transparent"]["constructors"]);

      if (accessControl === "Ownable") {
        // Remove roles code if any
        if (imports.includes(jsonData["Transparent"]["Roles"]["imports"])) {
          setImports((imports) =>
            imports.replace(jsonData["Transparent"]["Roles"]["imports"], "")
          );
        }
        if (
          functions.includes(
            jsonData["Transparent"]["Roles"][`${activeTab}Function`]
          )
        ) {
          setFunctions((functions) =>
            functions.replace(
              jsonData["Transparent"]["Roles"][`${activeTab}Function`],
              ""
            )
          );
        }

        setInheritance((inheritance) => {
          inheritance.filter(
            (inherit) =>
              ![...jsonData["Transparent"]["Roles"]["inheritance"]].includes(
                inherit
              )
          );
        });

        // Add ownable code
        setImports(
          (imports) => imports + jsonData["Transparent"]["Ownable"]["imports"]
        );
        setInheritance([
          ...inheritance,
          ...jsonData["Transparent"]["Ownable"]["inheritance"],
        ]);
        setFunctions(
          (functions) =>
            functions +
            jsonData["Transparent"]["Ownable"][`${activeTab}Function`]
        );
      } else if (accessControl === "Roles") {
        // Remove Ownable code
        setImports((imports) => {
          if (imports.includes(jsonData["Transparent"]["Ownable"]["imports"])) {
            imports.replace(jsonData["Transparent"]["Ownable"]["imports"], "");
          }
        });
        setInheritance((inheritance) => {
          inheritance.filter(
            (inherit) =>
              ![
                ...jsonData["Transparent"]["Ownable"]["inheritance"].includes(
                  inherit
                ),
              ]
          );
        });
        setFunctions((functions) => {
          if (
            functions.includes(
              jsonData["Transparent"]["Ownable"][`${activeTab}Function`]
            )
          ) {
            functions.replace(
              jsonData["Transparent"]["Ownable"][`${activeTab}Function`],
              ""
            );
          }
        });

        // Add Roles code
        setImports(
          (imports) => imports + jsonData["Transparent"]["Roles"]["imports"]
        );
        setInheritance((inheritance) => [
          ...inheritance,
          ...jsonData["Transparent"]["Roles"]["inheritance"],
        ]);
        setFunctions(
          (functions) =>
            functions + jsonData["Transparent"]["Roles"][`${activeTab}Function`]
        );
      }
    } else if (opt === "UUPS") {

      // Remove Transparent Code
      

      setDisableAccessControl(true);
      setAccessControl("Ownable");
      if(accessControl === "Ownable"){

      }
      // setInheritance(jsonData[activeTab]["UUPS"][accessControl]["inheritance"]);
      // setFunctions(jsonData[activeTab]["UUPS"][accessControl]["functions"]);
      // setConstructor(
      //   jsonData[activeTab]["UUPS"][accessControl]["constructors"]
      // );
      // setNatSpec(jsonData[activeTab]["UUPS"][accessControl]["comments"]);
    } else if (opt === "") {
      setAccessControl("");
      setInheritance(jsonData[activeTab]["inheritance"]);
      setFunctions("");
      setConstructor("");
      setConstructorExt((constructorExt) => `ERC20("${name}", "${symbol}")`);
      setNatSpec("");
      setImports(jsonData[activeTab]["mainImport"]);
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
        reqFunction = indentCode(
          jsonData["mintable"][activeTab]["functions"],
          2
        );
        if (e.target.checked) {
          if (!functions.includes(reqFunction)) {
            setFunctions((functions) => functions + reqFunction);
          }
          setAccessControl(true);
          setDisableAccessControl(true);
          handleAccessControlSelection(accessControlSelection);
        } else {
          //Remove auto increment Ids for erc721 if mintable is unchecked.
          if (activeTab === "erc721" && features["Auto Increments Ids"]) {
            let feat = features;
            feat["Auto Increments Ids"] = false;
            setFeatures(feat);

            setFunctions((functions) =>
              functions.replace(
                `${indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["functions"],
                  4
                )}`,
                ""
              )
            );

            setImports((imports) =>
              imports.replace(
                indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["imports"],
                  2
                ),
                ""
              )
            );

            setVariables((variables) =>
              variables.replace(
                jsonData[activeTab]["autoIncrementIds"]["variables"],
                ""
              )
            );
          }

          //Remove Roles code for mintable
          setConstructor((constructor) =>
            constructor.replace(
              jsonData["Roles"]["constructors"]["mintable"][0],
              ""
            )
          );
          /*   if (
            functions.includes(
              indentCode(
                jsonData[activeTab]["autoIncrementIds"]["functions"],
                2
              )
            )
          ) {
            setFunctions(
              functions.replace(
                indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["functions"],
                  2
                ),
                ""
              )
            );
          } */
          setFunctions((functions) => functions.replace(reqFunction, ""));
          setAccessControl(true);
          setDisableAccessControl(false);
        }
        break;
      case "Auto Increments Ids":
        if (e.target.checked) {
          let temp = { target: { id: "Mintable", checked: true } };
          const mintableCode = new Promise((resolve, reject) => {
            setFeatureImport(temp);
            resolve("done");
          });
          mintableCode.then((res) => {
            setFunctions((functions) =>
              functions.replace(
                indentCode(jsonData["mintable"][activeTab]["functions"], 2),
                indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["functions"],
                  2
                )
              )
            );
            /* if (
              functions.includes(
                indentCode(jsonData["mintable"][activeTab]["functions"], 2)
              )
            ) {
              console.log("Contains");
              setFunctions((functions) =>
                functions.replace(
                  indentCode(jsonData["mintable"][activeTab]["functions"], 2),
                  indentCode(
                    jsonData[activeTab]["autoIncrementIds"]["functions"],
                    2
                  )
                )
              );
            } else {
              setFunctions(
                (functions) =>
                  functions +
                  indentCode(
                    jsonData[activeTab]["autoIncrementIds"]["functions"],
                    2
                  )
              );
            } */
          });

          setImports(
            (imports) =>
              imports +
              indentCode(jsonData[activeTab]["autoIncrementIds"]["imports"], 2)
          );

          setVariables(
            (variables) =>
              variables + jsonData[activeTab]["autoIncrementIds"]["variables"]
          );
        } else {
          if (
            !functions.includes(
              indentCode(jsonData["mintable"][activeTab]["functions"], 2)
            )
          ) {
            setFunctions(
              functions.replace(
                indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["functions"],
                  2
                ),
                indentCode(jsonData["mintable"][activeTab]["functions"], 2)
              )
            );
          } else {
            setFunctions(
              functions.replace(
                indentCode(
                  jsonData[activeTab]["autoIncrementIds"]["functions"],
                  2
                ),
                ""
              )
            );
          }

          setImports((imports) =>
            imports.replace(
              indentCode(jsonData[activeTab]["autoIncrementIds"]["imports"], 2),
              ""
            )
          );

          let tempVariables = variables;
          tempVariables = tempVariables.replace(
            jsonData[activeTab]["autoIncrementIds"]["variables"],
            ""
          );
          /* tempVariables = tempVariables.replace(
            indentCode(jsonData[activeTab]["autoIncrementIds"]["imports"], 2)
          ); */

          setVariables(tempVariables);
        }
        break;
      case "Burnable":
        reqImport = indentCode(jsonData["burnable"][activeTab]["imports"], 2);
        if (e.target.checked) {
          setImports((imports) => imports + reqImport);
          setInheritance([
            ...inheritance,
            ...jsonData["burnable"][activeTab]["inheritance"],
          ]);
        } else {
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData["burnable"][activeTab]["inheritance"],
              ].includes(inherit);
            })
          );
          setImports(imports.replace(reqImport, ""));
        }
        break;
      case "Pausable":
        reqImport = indentCode(jsonData["pausable"]["imports"], 2);
        reqFunction = jsonData["pausable"]["functions"];
        reqLastFunction = jsonData["pausable"][activeTab]["lastFunctions"];

        if (e.target.checked) {
          setImports((imports) => imports + reqImport);
          setFunctions((functions) => functions + reqFunction);
          setLastFunctions((lastFunctions) => lastFunctions + reqLastFunction);
          setAccessControl(true);
          setDisableAccessControl(true);
          setInheritance([
            ...inheritance,
            ...jsonData["pausable"]["inheritance"],
          ]);
          handleAccessControlSelection(accessControlSelection);
        } else {
          setImports((imports) => imports.replace(reqImport, ""));
          setFunctions((functions) => functions.replace(reqFunction, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(reqLastFunction, "")
          );
          setDisableAccessControl(false);
          setInheritance((inheritance) =>
            [...inheritance].filter((inherit) => {
              return ![...jsonData["pausable"]["inheritance"]].includes(
                inherit
              );
            })
          );
          //Remove Roles code for pausable
          setConstructor((constructor) =>
            constructor.replace(
              jsonData["Roles"]["constructors"]["pausable"][0],
              ""
            )
          );
        }
        break;
      case "Permit":
        reqImport = indentCode(jsonData[activeTab]["permit"]["imports"], 2);
        constructorExtTemp = constructorExt;
        if (e.target.checked) {
          setImports(imports + `${reqImport}`);
          setConstructorExt(
            constructorExtTemp +
              ` ${jsonData[activeTab]["permit"]["constructorExt"]}("${name}")`
          );
          setInheritance([
            ...inheritance,
            ...jsonData[activeTab]["permit"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`${reqImport}`, ""));
          setConstructorExt(
            constructorExtTemp.replace(
              ` ${jsonData[activeTab]["permit"]["constructorExt"]}("${name}")`,
              ""
            )
          );
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData[activeTab]["permit"]["inheritance"],
              ].includes(inherit);
            })
          );
        }
        break;
      case "Votes":
        reqImport = indentCode(jsonData["votes"][activeTab]["imports"], 2);
        reqLastFunction = indentCode(
          jsonData["votes"][activeTab]["lastFunctions"],
          4
        );

        if (e.target.checked) {
          setImports((imports) => imports + reqImport);
          setLastFunctions(
            lastFunctions === "" || functions === ""
              ? `${reqLastFunction}`
              : reqLastFunction + `${reqLastFunction}`
          );
          setConstructorExt(
            (constructorExt) =>
              constructorExt +
              (activeTab === "erc20"
                ? ` ${jsonData["votes"][activeTab]["constructorExt"]}("${name}")`
                : ` ${jsonData["votes"][activeTab]["constructorExt"]}("${name}","1")`)
          );
          setInheritance([
            ...inheritance,
            ...jsonData["votes"][activeTab]["inheritance"],
          ]);
          if (functionComment === "") {
            setFunctionComment(
              (functionComment) => functionComment + jsonData["functionComment"]
            );
          }
        } else {
          setImports((imports) => imports.replace(reqImport, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(`${reqLastFunction}`, "")
          );
          setConstructorExt((constructorExt) =>
            constructorExt.replace(
              activeTab === "erc20"
                ? ` ${jsonData["votes"][activeTab]["constructorExt"]}("${name}")`
                : ` ${jsonData["votes"][activeTab]["constructorExt"]}("${name}","1")`,
              ""
            )
          );
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![...jsonData["votes"][activeTab]["inheritance"]].includes(
                inherit
              );
            })
          );
          if (functions === "" && lastFunctions === "") {
            setFunctionComment((functionComment) => (functionComment = ""));
          }
        }
        break;
      case "Flash Minting":
        reqImport = `${indentCode(
          jsonData[activeTab]["flashMinting"]["imports"],
          2
        )}`;
        if (e.target.checked) {
          setImports(imports + `${reqImport}`);
          setInheritance([
            ...inheritance,
            ...jsonData[activeTab]["flashMinting"]["inheritance"],
          ]);
        } else {
          setImports(imports.replace(`${reqImport}`, ""));
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData[activeTab]["flashMinting"]["inheritance"],
              ].includes(inherit);
            })
          );
        }
        break;
      case "Snapshots":
        reqImport = indentCode(jsonData[activeTab]["snapshots"]["imports"], 2);
        reqFunction = indentCode(
          jsonData[activeTab]["snapshots"]["functions"],
          4
        );
        reqLastFunction = indentCode(
          jsonData[activeTab]["snapshots"]["lastFunctions"],
          4
        );
        if (e.target.checked) {
          setImports((imports) => imports + `${reqImport}`);
          setFunctions((functions) => functions + `${reqFunction}`);
          setLastFunctions(
            (lastFunctions) => lastFunctions + `${reqLastFunction}`
          );
          if (functionComment === "") {
            setFunctionComment(
              (functionComment) =>
                (functionComment += jsonData["functionComment"])
            );
          }
          setAccessControl(true);
          setDisableAccessControl(true);

          setInheritance(
            Array.from(
              new Set([
                ...inheritance,
                ...jsonData[activeTab]["snapshots"]["inheritance"],
              ])
            )
          );
          handleAccessControlSelection(accessControlSelection);
        } else {
          //Remove Roles code for snapshot
          setConstructor((constructor) =>
            constructor.replace(
              jsonData["Roles"]["constructors"]["snapshot"][0],
              ""
            )
          );
          setImports((imports) => imports.replace(reqImport, ""));
          setFunctions((functions) => functions.replace(reqFunction, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(reqLastFunction, "")
          );
          if (functionComment !== "") {
            setFunctionComment((functionComment) =>
              functionComment.replace(jsonData["functionComment"], "")
            );
          }
          setDisableAccessControl(false);
          setInheritance((inheritance) =>
            [...inheritance].filter((inherit) => {
              return ![...jsonData["inheritance"]].includes(inherit);
            })
          );
        }
        break;
      case "Enumerable":
        reqImport = indentCode(jsonData[activeTab]["enumerable"]["imports"], 2);
        reqLastFunction = indentCode(
          jsonData[activeTab]["enumerable"]["lastFunctions"],
          4
        );
        if (e.target.checked) {
          setImports((imports) => imports + reqImport);
          setLastFunctions((lastFunctions) => lastFunctions + reqLastFunction);
          setInheritance([
            ...inheritance,
            ...jsonData[activeTab]["enumerable"]["inheritance"],
          ]);
          if (functionComment === "")
            setFunctionComment(jsonData["functionComment"]);
        } else {
          setImports((imports) => imports.replace(reqImport, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(reqLastFunction, "")
          );
          if (functions === "") {
            setFunctionComment("");
          }
          setInheritance((inheritance) =>
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData[activeTab]["enumerable"]["inheritance"],
              ].includes(inherit);
            })
          );
          if (!features["URI Storage"] && !["Supply Tracking"]) {
            setFunctionComment("");
          }
        }
        break;
      case "URI Storage":
        reqImport = indentCode(jsonData[activeTab]["uriStorage"]["imports"], 2);
        reqLastFunction = indentCode(
          jsonData[activeTab]["uriStorage"]["lastFunctions"],
          4
        );
        if (e.target.checked) {
          setImports(imports + reqImport);
          setLastFunctions(lastFunctions + reqLastFunction);
          setInheritance([
            ...inheritance,
            ...jsonData[activeTab]["uriStorage"]["inheritance"],
          ]);
          if (functionComment === "")
            setFunctionComment(jsonData["functionComment"]);
        } else {
          setImports((imports) => imports.replace(reqImport, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(reqLastFunction, "")
          );
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData[activeTab]["uriStorage"]["inheritance"],
              ].includes(inherit);
            })
          );
          if (!features["Enumerable"] && !features["URI Storage"]) {
            setFunctionComment("");
          }
        }
        break;
      case "Supply Tracking":
        reqImport = indentCode(
          jsonData[activeTab]["supplyTracking"]["imports"],
          2
        );
        reqLastFunction = indentCode(
          jsonData[activeTab]["supplyTracking"]["lastFunctions"],
          4
        );
        if (e.target.checked) {
          setImports((imports) => imports + `${reqImport}`);
          setLastFunctions(
            (lastFunctions) => reqLastFunction + `${reqLastFunction}`
          );
          setInheritance([
            ...inheritance,
            ...jsonData[activeTab]["supplyTracking"]["inheritance"],
          ]);
          if (functionComment === "")
            setFunctionComment(jsonData["functionComment"]);
        } else {
          setImports((imports) => imports.replace(`${reqImport}`, ""));
          setLastFunctions((lastFunctions) =>
            lastFunctions.replace(`\n${reqLastFunction}`, "")
          );
          setInheritance(
            [...inheritance].filter((inherit) => {
              return ![
                ...jsonData[activeTab]["supplyTracking"]["inheritance"],
              ].includes(inherit);
            })
          );
          if (!features["URI Storage"] && !features["Enumerable"]) {
            setFunctionComment("");
          }
        }
        break;
      default:
        return "";
    }
  };

  const setERC721BaseURI = (e) => {
    if (baseURI === "" && e.target.value !== "") {
      setFunctions(
        (functions) =>
          (functions += jsonData[activeTab]["baseURI"].replace(
            "${baseURI}",
            e.target.value
          ))
      );
    } else if (baseURI !== "" && e.target.value !== "") {
      setFunctions((functions) => functions.replace(baseURI, e.target.value));
    } else if (e.target.value === "") {
      setFunctions((functions) =>
        functions.replace(
          jsonData[activeTab]["baseURI"].replace("${baseURI}", baseURI),
          e.target.value
        )
      );
    }
    setBaseURI((baseURI) => (baseURI = e.target.value));
  };

  return (
    <Form className="d-inline vw-60 vh-100">
      <Form.Text className="fw-medium">SETTINGS</Form.Text>
      <Row>
        <Col xs={activeTab === "erc1155" ? "10" : "7"}>
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
          <Form.Label className="labels" hidden={activeTab === "erc1155"}>
            Symbol
          </Form.Label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            hidden={activeTab === "erc1155"}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={10}>
          {activeTab === "erc20" ? (
            <>
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
            </>
          ) : activeTab === "erc721" ? (
            <>
              <OverlayTrigger
                placement="right"
                overlay={tooltip(
                  "Will be concatenated with token IDs to generate the token URIs."
                )}
              >
                <Form.Label className="labels">Base URI</Form.Label>
              </OverlayTrigger>
              <Form.Control
                size="sm"
                type="text"
                placeholder={baseURI}
                onChange={(e) => setERC721BaseURI(e)}
              />
            </>
          ) : (
            <>
              <OverlayTrigger
                placement="right"
                overlay={tooltip(
                  "Create an initial amount of tokens for the deployer."
                )}
              >
                <Form.Label className="labels">URI</Form.Label>
              </OverlayTrigger>
              <Form.Control
                size="sm"
                type="text"
                placeholder={URI}
                onChange={(e) => {
                  setURI(e.target.value);
                }}
              />
            </>
          )}
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
          checked={features[feature]}
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
        setAccessControlSelection={setAccessControlSelection}
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
        setAccessControlSelection={setAccessControlSelection}
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
          onChange={(e) => {
            if (e.target.value) {
              setSecurityEmail(
                `/// @custom:security-contact ${e.target.value}`
              );
            } else if (e.target.value === "") {
              setSecurityEmail("");
            }
          }}
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
