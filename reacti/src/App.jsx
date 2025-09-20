import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { useQuery } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [arrayData, setArrayData] = useState([]);
  return (
    <div>
      <TextInputWithSearch setArrayData={setArrayData} />
      <div style={{ height: "300px", overflow: "scroll" }}>
        <Container fluid>
          <BooksTable
            data={arrayData}
            columnNames={["title", "author", "description"]}
          />
        </Container>
      </div>
    </div>
  );
}

const fetchSearchResults = async (query) => {
  const response = await fetch(`http://localhost:3000/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function TextInputWithSearch({ setArrayData }) {
  const [inputValue, setInputValue] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search-results", inputValue],
    queryFn: () => fetchSearchResults(inputValue),
    enabled: !!inputValue, // This is the key part! The query only runs when inputValue is not empty.
  });

  useEffect(() => {
    if (data) {
      setArrayData(data);
    } else {
      console.error("Invalid response structure:", data);
    }
  }, [data]);

  /*
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  */

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  );
}

function BooksTable({ columnNames, data }) {
  let tableHeader = (
    <thead>
      <tr>
        {columnNames.map((colName, index) => (
          <th key={index}>{colName}</th>
        ))}
      </tr>
    </thead>
  );

  let tableRows = data.map((row, index) => (
    <tr key={index}>
      <td>{row.title}</td>
      <td>{row.author}</td>
      <td>{row.description}</td>
    </tr>
  ));

  return (
    <Table bordered hover size="sm">
      {tableHeader}
      <tbody>{tableRows}</tbody>
    </Table>
  );
}

export default App;
