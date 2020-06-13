import React from "react";
import Logo from "./img/stocks_img.jpg";

export function LandingPageContent() {
    return (
        <div>
            <br />
            <img src={Logo} alt={Logo} width={100} height={100} />
            <p>
                Welcome to the Stock Analyst portal.
            <br />
            Click on Stocks to see the
            available companies, inspect companies
            to
            <br />
            review stock data, and
            login to see stock history for each company.
            </p>
        </div>
    );
}