import React from "react";
import "./Searchbar.css"
export default function Searchbar({search,setSearch}){
    return(
        <div className="searchbar">
            <input type="text" placeholder="search your task" value={search} onChange={(e)=>setSearch(e.target.value)}></input>
            

        </div>
    )
}