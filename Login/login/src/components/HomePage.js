import React,{useState,useEffect} from "react";

const HomePage = () =>{
    useEffect(() =>{
        async function fetchData(){
        const res = await fetch('/homePage')
        console.log(`The home page get request status is ${res.status}`)
        }
        fetchData()
    })

return(
    <div>This is Home Page</div>
)

}
export default HomePage;