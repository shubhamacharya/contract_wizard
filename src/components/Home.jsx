/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import CodePane from "./CodePane";
import { Card } from "react-bootstrap";
import jsonData from "../utils/codeSections.json";
import ERC from "./ERC";

export default function Home() {
  const [code, setCode] = useState("Hello this is code");
  const [activeTab, setActiveTab] = useState("erc20");

  useEffect(() => {
    
  }, [code, setCode, activeTab, setActiveTab])
  
  return (
    <div className="panel">
      <Nav variant="pills" defaultActiveKey="erc20">
        {jsonData["tabs"].map((tab) => (
          <Nav.Item>
            <Nav.Link
              className="text-uppercase"
              eventKey={tab}
              id={tab}
              key={tab}
              onClick={(e) => {
                setActiveTab(e.target.id);
              }}
            >
              {tab}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div className="bottom">
        <div className="left">
          <Card>
            <Card.Body>
              <ERC tab={activeTab} setCode={setCode}></ERC>
            </Card.Body>
          </Card>
        </div>
        <div className="right">
          <CodePane code={code}></CodePane>
        </div>
      </div>
    </div>
  );
}
