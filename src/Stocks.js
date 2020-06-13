import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { BrowserRouter as Router, useParams, useHistory } from "react-router-dom";
import { Loading } from "./Loading.js";
import { SearchBar } from "./SearchBar.js";
export function Stocks() {
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const columns = [
        { headerName: "Name", field: "name", sortable: true, filter: 'agTextColumnFilter', width: 300, headerClass: "colouredHeader" },
        { headerName: "Symbol", field: "symbol", sortable: true, filter: 'agTextColumnFilter', width: 180, headerClass: "colouredHeader" },
        { headerName: "Industry", field: "industry", sortable: true, width: 320, headerClass: "colouredHeader" }
    ];
    useEffect(() => {
        let url = ``;
        if (id !== "null") {
            url = `http://131.181.190.87:3000/stocks/symbols?industry=${id}`;
        } else {
            url = `http://131.181.190.87:3000/stocks/symbols`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.error) { setError(data.message); url = `http://131.181.190.87:3000/stocks/symbols`; return data.error } else {
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
            .then(companys => {
                setRowData(companys);
                setLoading(false)
            })
            .catch(e => { })
    }
        , [id]);

    //sets up to read the token storage and allows for inter-site navigation
    let history = useHistory();
    let token = sessionStorage.getItem("token");

    //on click of table row this redirects to the relevant 
    //company stock information page
    function handleClick(tableSymbol) {
        history.push(`/quote/${tableSymbol}`);
    }

    //creates the loading wheel
    if (loading) {
        return (
            <Loading />
        );
    }
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
            <SearchBar />
            <div className="errorMessage">{error ? <p>Industry Sector "{id}" Not Found</p> : null}</div>
            <h3>Click On A Row To Inspect The Company</h3>
            <div>{!token ?
                <p>
                    Login To See Stock History For The Selected Company
                </p> :
                <p>
                    Click On A Company To See It's Stock History(You Are Logged In Now)
                    </p>}
            </div>
            <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                onRowClicked={(row) => handleClick(row.data.symbol)}
                rowSelection={"single"}
                pagination={true}
                paginationAutoPageSize={true}
            />
        </div>
    );
}