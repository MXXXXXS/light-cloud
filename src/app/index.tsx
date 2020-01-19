import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import ControlButtons from "./components/controlButtons";
import FileLists from "./components/fileLists";

function App() {
  const [fileList, setFileList] = useState([] as File[]);
  const [sendAll, setSenAll] = useState(false);

  return (
    <div>
      <FileLists fileList={fileList} setSendAll={setSenAll} sendAll={sendAll}></FileLists>
      <ControlButtons
        setFileList={setFileList}
        setSendAll={setSenAll}
      ></ControlButtons>
      <style jsx>{`
        div {
          display: flex;
          justify-content: space-between;
          height: 100%;
          flex: 1;
          padding: 10px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
