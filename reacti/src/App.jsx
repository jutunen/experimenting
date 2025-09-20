import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { useQuery } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { observer } from "mobx-react-lite";
import { StoreContext } from "./StoreContext";

function App() {
  return (
    <div>
      <TextInputWithSearch />
      <div style={{ height: "300px", overflow: "scroll" }}>
        <Container fluid>
          <BooksTable columnNames={["title", "author", "description"]} />
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

function TextInputWithSearch() {
  const [inputValue, setInputValue] = useState("");
  const store = useContext(StoreContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search-results", inputValue],
    queryFn: () => fetchSearchResults(inputValue),
    enabled: !!inputValue, // This is the key part! The query only runs when inputValue is not empty.
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      store.setApiResponse(data);
    }
  }, [data, store]); // The effect runs whenever 'data' or 'store' changes

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

const BooksTable = observer(({ columnNames }) => {
  const store = useContext(StoreContext);

  let tableHeader = (
    <thead>
      <tr>
        {columnNames.map((colName, index) => (
          <th key={index}>{colName}</th>
        ))}
      </tr>
    </thead>
  );

  let tableRows = store.apiResponse.map((row, index) => (
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
});

export default App;
