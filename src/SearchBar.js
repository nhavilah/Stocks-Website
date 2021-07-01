import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Routing } from "./App.js";
export function SearchBar() {
    const [innerSearch, setInnerSearch] = useState("null");
    return (
        <div>
            <input
                aria-labelledby="search-button"
                name="search"
                id="search"
                type="search"
                onChange={e => setInnerSearch(e.target.value)}
                list="industries"
            />
            {/*drop down menu in case user doesn't know what industry they'd like to search for*/}
            <datalist id="industries">
                <option>Health Care</option>
                <option>Industrials</option>
                <option>Consumer Discretionary</option>
                <option>Information Technology</option>
                <option>Consumer Staples</option>
                <option>Utilities</option>
                <option>Financials</option>
                <option>Real Estate</option>
                <option>Materials</option>
                <option>Energy</option>
                <option>Telecommunication Services</option>
            </datalist>
            <br />
            <Link to={`/stocks/${innerSearch}`}>
                <button>
                    Search
            </button>
            </Link>
            <Link to={`/stocks/null`}>
                <button
                    id="search-button"
                    type="reset"
                    onClick={() => {
                        document.getElementById("search").value = "";
                        setInnerSearch("null")
                    }}
                >
                    Clear
            </button>
            </Link>
        </div>
    );
}