import { Loading } from "./Loading.js";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import { Chart } from "./Chart.js";

export function Quote() {
    const [error, setError] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [names, setNames] = useState(``);
    const [industry, setIndustry] = useState(``);
    const [fromDate, setFromDate] = useState(`2019-11-06`);
    const [toDate, setToDate] = useState(`2020-03-24`);
    const [minToDate, setMinToDate] = useState(`2019-11-06`);
    const [selection, setSelection] = useState(`Closing`);

    //gets the login token
    const token = sessionStorage.getItem("token");
    //allows access to the authenticated search
    const headers = {
        Authorization: `Bearer ${token}`
    };
    const columns = [
        { headerName: "TimeStamp", field: "timestamp", width: 250, sortable: true, headerClass: "colouredHeader" },
        { headerName: "Open", field: "open", width: 120, sortable: true, filter: 'agNumberColumnFilter', headerClass: "colouredHeader" },
        { headerName: "Close", field: "close", width: 110, sortable: true, filter: 'agNumberColumnFilter', headerClass: "colouredHeader" },
        { headerName: "High", field: "high", width: 110, sortable: true, filter: 'agNumberColumnFilter', headerClass: "colouredHeader" },
        { headerName: "Low", field: "low", width: 110, sortable: true, filter: 'agNumberColumnFilter', headerClass: "colouredHeader" },
        { headerName: "Volumes", field: "volumes", sortable: true, filter: 'agNumberColumnFilter', headerClass: "colouredHeader" }
    ];
    let { id } = useParams();
    useEffect(() => {
        let url = ``;
        //switches fetch url when logged in
        if (token !== null) {
            url = `http://131.181.190.87:3000/stocks/authed/${id}?from=${fromDate}T00%3A00%3A00.000Z&to=${toDate}T00%3A00%3A00.000Z`;
        } else {
            url = `http://131.181.190.87:3000/stocks/${id}`;
        }
        fetch(url, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setError(null);
                    return data
                }
            })
            //changes how data is sent to the table to handle for
            //when the user is logged in or not
            .then(companys => {
                if (token !== null) {
                    setRowData(companys);
                    setNames(companys[0].name);
                    setIndustry(companys[0].industry);
                    setLoading(false);
                } else {
                    setRowData([companys]);
                    setNames(companys.name);
                    setIndustry(companys.industry);
                    setLoading(false);
                }
            })
            .catch(e => { })
    }
        , [id, headers, token, fromDate, toDate]);
    //this section sets data to be used by the chart
    var timestampArray = [];
    var selectedArray = [];
    var ylabels = '';
    var chartTitle = '';
    for (var i = 0; i < rowData.length; i++) {
        var date = rowData[i].timestamp;
        date = date.slice(0, 7);
        timestampArray.push(date);
        //based on the selection of the drop down menu, 
        //it sets the chart data to match
        if (selection === "Closing") {
            selectedArray.push(rowData[i].close);
            ylabels = 'Closing Value';
            chartTitle = 'Closing Values For Each Day Over Time';
        } else if (selection === "Opening") {
            selectedArray.push(rowData[i].open);
            ylabels = 'Opening Value';
            chartTitle = 'Opening Values For Each Day Over Time';
        } else if (selection === "High") {
            selectedArray.push(rowData[i].high);
            ylabels = 'Highest Value';
            chartTitle = 'Highest Values For Each Day Over Time';
        } else if (selection === "Low") {
            selectedArray.push(rowData[i].low);
            ylabels = 'Lowest Value';
            chartTitle = 'Lowest Values For Each Day Over Time';
        } else if (selection === "Volumes") {
            selectedArray.push(rowData[i].volumes);
            ylabels = 'Volumes Traded';
            chartTitle = 'Volumes Traded Each Day Over Time';
        }
    }
    //reverse the order so it appears oldest to newest on the chart
    timestampArray.reverse();
    selectedArray.reverse();

    //loading wheel
    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div
            className="ag-theme-material"
            style={{
                height: "353px",
                width: "900px"
            }}
        >
            <br />
            <br />
            <br />
            <h2>Showing Stocks For {names}</h2>
            <h3>Industry: {industry}</h3>
            <h3>Symbol: {id}</h3>
            <div className="errorMessage">{
                error ? <p>{error}</p> : null}
            </div>
            <div>{!token ?
                <p>Login To See Stock History For This Company</p> :
                <div>
                    <h3>View Stocks Between:</h3>
                    <input
                        type="date"
                        id="from"
                        min="2019-11-06"
                        max="2020-03-24"
                        onChange={() => {
                            setMinToDate(document.getElementById("from").value)
                        }
                        }
                    />
                    <h3>And:</h3>
                    <input
                        type="date"
                        id="to"
                        min={minToDate}
                        max="2020-03-24"
                    />
                    <button
                        //use this to set minimum and maximum dates on the datepicker
                        //the second datepicker will also have its minimum value changed, 
                        //based on whether the first datepicker has any selected dates or not
                        onClick={() => {
                            if (document.getElementById("from").value !== "") {
                                setFromDate(document.getElementById("from").value);
                            } else {
                                setFromDate("2019-11-06");
                            }
                            if (document.getElementById("to").value !== "") {
                                setToDate(document.getElementById("to").value)
                            } else {
                                setToDate("2020-03-24");
                            }
                        }}>
                        Search
                </button>
                </div>
            }
            </div>
            <br />
            <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                pagination={true}
                paginationAutoPageSize={true}
            />
            {/* this section displays the table and its dropdown menu ONLY if
            the user is logged in. Otherwise it is not there */}
            <div>{token ?
                <div>
                    <br />
                    <h3>Inspect Stock Value Over Time</h3>
                    <select
                        id="stocks"
                        value={selection}
                        onChange={e => setSelection(e.target.value)}
                    >
                        <option value="Opening">Opening Values</option>
                        <option value="Closing">Closing Values</option>
                        <option value="High">High Values</option>
                        <option value="Low">Low Values</option>
                        <option value="Volumes">Volumes Traded</option>
                    </select>
                    <br />
                    <br />
                    <Chart
                        timestamps={timestampArray}
                        values={selectedArray}
                        name={selection}
                        yaxisTitle={ylabels}
                        chartTitle={chartTitle} />
                </div> : null}
            </div>
        </div>
    );
}