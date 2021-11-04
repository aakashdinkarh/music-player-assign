import { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import store from "./containers/store";

function App() {
  let [fileName, setFileName] = useState("No file chosen");
  
  useEffect(() => {
    localStorage.setItem("songName", JSON.stringify(fileName));
  }, [fileName]);

  const audioChange = (e) => {
    //get name and src value from input file
    const file = document.querySelector("#inputFile").files[0];
    console.log(e.target.result);
    console.log(file);
    if (file === undefined) return;
    if (file.size > 3800000) {
      alert("Max size limit is 3.7MB");
      return;
    }
    if (!file.type.startsWith("audio")) {
      alert("Not an audio file (Please select an audio file)");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      localStorage.setItem("AudioFile", JSON.stringify(reader.result));
    };
  };

  return (
    <>
      <div className="backg"></div>
      <form className="audioForm perf-center">
        <p className="upload-text">Upload your audio file below:</p>
        <br />
        <label className="custom-upload">
          <FontAwesomeIcon icon={faUpload} />
          &nbsp; Choose File...
          <input hidden id="inputFile" type="file" onChange={audioChange} />
        </label>
        <p className="fileName">{fileName}</p>
        <a href="/player" className="custom-upload upload">
          <FontAwesomeIcon icon={faCloudUploadAlt} />
          &nbsp; Upload
          <input hidden type="submit" />
        </a>
      </form>
    </>
  );
}
export default App;
