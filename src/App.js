import logo from "./logo.svg";
import "./App.css";
import DataTable from "./DataTable";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState([]);

  const getData = () => {
    axios.get("http://localhost:3002/tasks").then((res) => {
      // console.log(res);
      setRows(res.data);
    });
  }

  useEffect(() => {
    try {
      getData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearTask = (id) => {
    axios.post('http://localhost:3002/delete', { id }).then((res) => {
      getData();
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div style={{
        height: '100%'
      }}>
        <DataTable handleClearTask={handleClearTask} rows={rows}></DataTable>
      </div>
    </div>
  );
}

export default App;
