import { FilePicker } from "react-file-picker-ui";
import { scanDir } from "scandir-server";
import React, { useState } from "react";

export default function FilePickerComponent() {
  const [show, setShow] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

  return (
    <React.Fragment>
      <h2>Select Path : {path}</h2>
      <button onClick={() => setShow(true)}>Show File Picker</button>
      <FilePicker
        show={show}
        setShow={setShow}
        scanDir={scanDir}
        setSelectedPath={setSelectedPath}
      />
    </React.Fragment>
  );
}
