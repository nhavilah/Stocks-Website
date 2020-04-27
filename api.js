import {useState,useEffect} from "react";

function getCompanies(search){
    // const [url,setUrl]=(``);
    // if(search.length){
    //     setUrl(`http://131.181.190.87:3000/stocks/symbols?industry=${search}`);
    // }else{
    //     setUrl(`http://131.181.190.87:3000/stocks/symbols`);
    // }
    if(search.length){
        const url=`http://131.181.190.87:3000/stocks/symbols?industry=${search}`;
        return fetch(url)
            .then(res => res.json())
            .then(data=>data)
            .then(data=>
            data.map(company=>{
                return{
                    name:company.name,
                    symbol:company.symbol,
                    industry:company.industry
                };
            })
            )
        ;
    }else{
        const url=`http://131.181.190.87:3000/stocks/symbols`;
        return fetch(url)
            .then(res => res.json())
            .then(data=>data)
            .then(data=>
            data.map(company=>{
                return{
                    name:company.name,
                    symbol:company.symbol,
                    industry:company.industry
                };
            })
            )
        ;
    }
}

export function useCompanies(search){
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [company,setCompany]=useState([]);
    useEffect(()=>{
        getCompanies(search)
        .then(company=>{
            setCompany(company);
            setLoading(false);
        })
        .catch(e=>{
            setError(e);
            setLoading(false);
        });
    },[search]);
    return{
        loading,
        company,
        error
    };
}