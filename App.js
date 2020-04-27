import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Route, Switch, Link, BrowserRouter as Router } from "react-router-dom";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import "./styles.css";

function LandingPageContent() {
  return (
    <div class="column-right1">
      <br />
      <p>
        Welcome to the Stock Analyst portal. Click on Stocks to see the
        available companies, Quote to get the latest price information by stock
        symbol, or choose Price History to sample from the most recent one
        hundred days of information for a particular stock.
      </p>
    </div>
  );
}

function Routing() {
  return (
    <Router>
      <div class="row">
        <div class="column-left">
          <nav>
            <div>
              <Link to="/">
                <button>Home</button>
              </Link>
            </div>
            <div>
              <Link to="/stocks">
                <button>Stocks By Industry</button>
              </Link>
            </div>
            <div>
              <Link to="/quote">
                <button>Stocks By Symbol</button>
              </Link>
            </div>
            <div>
              <Link to="/price">
                <button>Price History (Restricted)</button>
              </Link>
            </div>
            <br />
            <br />
            <br />
            <div>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </div>
            <div>
              <Link to="/register">
                <button>Register</button>
              </Link>
            </div>
          </nav>
        </div>
        <div class="column-right">
          <Switch>
            <Route path="/stocks">
              <Stocks />
            </Route>
            <Route path="/quote">
              <Quote />
            </Route>
            <Route path="/price">
              <Price />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div class="column-right1">
      <LandingPageContent />
    </div>
  );
}

function SearchBar(props) {
  const [innerSearch, setInnerSearch] = useState(``);
  return (
    <div>
      <input
        aria-labelledby="search-button"
        name="search"
        id="search"
        type="search"
        value={innerSearch}
        onChange={e => setInnerSearch(e.target.value)}
      />
      <br />
      <button
        id="search-button"
        type="button"
        onClick={() => props.onSubmit(innerSearch)}
      >
        Search
          </button>
      <button
        id="search-button"
        type="button"
        onClick={() => { props.onSubmit(""); setInnerSearch("") }}
      >
        Clear
          </button>
    </div>
  );
}

function DropDownMenu(props) {
  const [innerSearches, setInnerSearches] = useState(``);
  const [selectableOptions, setSelectableOptions] = useState([]);
  //fetch the symbols from the search stocks by industry page, because this allows
  //for a dynamically rendered drop down menu
  fetch(`http://131.181.190.87:3000/stocks/symbols`)
    .then(res => res.json())
    .then(data => {
      if (data.error) { } else {
        return data
      }
    })
    .then(data =>
      data.map(company => {
        return {
          symbol: company.symbol
        };
      })
    )
    .then(companys => setSelectableOptions(companys))
    .catch(e => { });
  return (
    <div>
      <select
        aria-labelledby="search-button"
        name="search"
        id="searchMenu"
        value={innerSearches}
        onChange={e => setInnerSearches(e.target.value)}
      >
        <option>Select A Symbol</option>
        {//allows us to write each of the symbols to the drop down menu
          selectableOptions.map(function (SYMBOL) {
            return <option key={SYMBOL.symbol} value={SYMBOL.symbol}>{SYMBOL.symbol}</option>;
          })}
      </select>
      <br />
      <button
        id="search-button"
        type="button"
        onClick={() => props.onSubmit(innerSearches)}
      >
        Search
          </button>
    </div>
  );
}

function Stocks() {
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState(``);
  const [error, setError] = useState(null);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, width: 300, headerClass: "colouredHeader" },
    { headerName: "Symbol", field: "symbol", sortable: true, width: 180, headerClass: "colouredHeader" },
    { headerName: "Industry", field: "industry", sortable: true, width: 300, headerClass: "colouredHeader" }
  ];

  useEffect(() => {
    let url = `http://131.181.190.87:3000/stocks/symbols`;
    if (search.length) {
      url = `http://131.181.190.87:3000/stocks/symbols?industry=${search}`;
    } else {
      url = `http://131.181.190.87:3000/stocks/symbols`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.error) { setError(data.message); return data.error } else {
          setError(null); return data
        }
      })
      .then(data =>
        data.map(company => {
          return {
            name: company.name,
            symbol: company.symbol,
            industry: company.industry
          };
        })
      )
      .then(companys => setRowData(companys))
      .catch(e => { })
  }
    , [search]);

  return (

    <div
      className="ag-theme-material"
      style={{
        height: "500px",
        width: "800px"
      }}
    >
      <br />
      <br />
      <br />
      <h2>Search For Stocks By Industry</h2>
      <SearchBar onSubmit={setSearch} />
      <div>{error ? <p>{error}</p> : null}</div>

      <br />
      <br />
      <AgGridReact columnDefs={columns} rowData={rowData} />
    </div>
  );
}

function Quote() {
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState(``);

  const columns = [
    { headerName: "Name", field: "name", headerClass: "colouredHeader" },
    { headerName: "Symbol", field: "symbol", headerClass: "colouredHeader" },
    { headerName: "Industry", field: "industry", headerClass: "colouredHeader" }
  ];
  const columns1 = [
    { headerName: "TimeStamp", field: "timestamp", width: 250, headerClass: "colouredHeader" },
    { headerName: "Open", field: "open", width: 150, headerClass: "colouredHeader" },
    { headerName: "Close", field: "close", headerClass: "colouredHeader" }
  ];
  const columns2 = [
    { headerName: "High", field: "high", headerClass: "colouredHeader" },
    { headerName: "Low", field: "low", headerClass: "colouredHeader" },
    { headerName: "Volumes", field: "volumes", headerClass: "colouredHeader" }
  ];

  useEffect(() => {
    let url = `http://131.181.190.87:3000/stocks/${search}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.error) { } else { return data }
      })
      .then(companys => setRowData([companys]))
      .catch(e => { })
  }
    , [search]);

  return (
    <div
      className="ag-theme-material"
      style={{
        height: "135px",
        width: "600px"
      }}
    >
      <br />
      <br />
      <br />
      <h2>Search For Stocks By Symbol</h2>
      <DropDownMenu onSubmit={setSearch} />

      <br />
      <br />
      <AgGridReact columnDefs={columns} rowData={rowData} />
      <br />
      <br />
      <br />
      <AgGridReact columnDefs={columns1} rowData={rowData} />
      <br />
      <br />
      <br />
      <AgGridReact columnDefs={columns2} rowData={rowData} />
    </div>
  );
}

function Price() {
  return <h2>Price</h2>;
}

function Login() {
  return <h2>Login</h2>;
}

function Register() {
  return <h2>Register</h2>;
}
export default function App() {
  return (
    <div>
      <div class="Heading">
        <div class="HeadingInner">
          <h1><b>STOCKS WEBSITE</b></h1>
        </div>
      </div>
      <Routing />
    </div>
  );
}
