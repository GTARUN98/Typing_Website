import React,{useState,useEffect} from "react";
import { Box,Container,Typography,TextField,Button } from '@mui/material'
import NavBar from './NavBar'

let arrayQuote,arrayValue,no_of_backspace=0,sec=0,min=0,no_words=0;
var timer,len=0,correct=0,wrong=0,lengthClicked=0;
var endTime;
const HomePage = () =>{
    const [status,setStatus] = useState(0)
    const [disable,setDisable] = useState(true)
    const [index,setIndex] = useState(0)
    
    
    const [buttonValue,setbuttonValue] = useState('Start')
    const [para,setPara] = useState('')
    const [length,setLength] = useState(0)
    const [startTime,setStartTime] = useState()
    const [seconds,setSeconds] = useState(0)
    const [minutes,setMinutes] = useState(0)
    const [accuracy,setAccuracy] = useState(null)
    const [WPM,setWPM] = useState(null)
    const [idVal,setIdVal] = useState(0)
    
    
    async function fetchData(){
        const res = await fetch('/homePage')
         console.log(`The home page get request status is ${res.status}`)
         setStatus(res.status)
         if(res.status === 422){
             return res.json();
         }
     }
     async function getPara(){
         const response = await fetch("http://api.quotable.io/random")
        const obj_data = await response.json()
        const quote = await obj_data.content
        const para_from_api_display = document.getElementById('para_from_api')
        para_from_api_display.innerHTML = ''
        let temp=idVal;
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText= character
            characterSpan.id = "span"+temp
            //console.log(temp)
            temp=temp+1;
            para_from_api_display.appendChild(characterSpan)
        });
        setIdVal(temp)
        para_from_api_display.value = null
        arrayQuote = para_from_api_display.querySelectorAll('span')

        
        
        
        
        setPara( obj_data.content)
        no_words = (obj_data.content).split(' ').length;
        len=obj_data.length
        setLength(obj_data.length)
        
    }
    useEffect(() =>{
        fetchData()
        getPara()
    },[])//if we don write [] then for every state change this is going to run we can staop it to run only one time by using square bracket
    //let str = "Before we dive into paragraph structure, let’s start with paragraph meaning. A paragraph is an individual segment of writing that discusses a central idea, typically with more than one sentence. It even has its own paragraph symbol in copyediting, called the pilcrow (¶), not to be confused with the section symbol called the silcrow (§) that’s common in legal code.Here we focus mainly on paragraph structure, but feel free to read our ultimate guide to paragraphs for more of the basics. Parts of a paragraphLike other forms of writing, paragraphs follow a standard three-part structure with a beginning, middle, and end. These parts are the topic sentence, development and support, and conclusion"
    
    function setTime(){
        if(sec === 59){
            sec=0;
            min +=1
        }
        else {
            sec +=1
            // console.log(sec)
            }
        document.getElementById('sec_id').innerText = (sec>=10 ?sec : "0"+sec)
        document.getElementById('min_id').innerText = (min>=10 ?min : "0"+min)
            
        }
        const resultsData = async(e) =>{
            // e.preventDefault() //so that the form does'nt get reloaded
            try{const data = {words:no_words,time:(endTime-startTime),accuracy:accuracy,correct:correct,wrong:wrong,length:lengthClicked}
            const res =  await fetch("/results",{
                method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                    words:no_words,time:(endTime-startTime),accuracy:accuracy,correct:correct,wrong:wrong,length:lengthClicked
                })
            })
            // console.log("im in resultsData")
            // console.log("res of results is",res)
            if(res.status === 200){
                console.log("results api is called")
            }}catch(error){
                console.log(error)
            }
        }
        
    const startButton = (e)=>{
        if(buttonValue ==='Start'){
            timer = setInterval(setTime,1000)//this will be daone for interval of every 1000milli sec
            const d = new Date();
            setStartTime(d.getTime());
            // console.log(startTime)
            setDisable(false);
            setbuttonValue('Stop')
            
        }
    else{
        setbuttonValue('Start')
        setDisable(true);
        calResults();
        setSeconds(0)
        setMinutes(0)
        document.getElementById('start_btn').disabled=true
        document.getElementById('start_btn').style.backgroundColor="grey"
        document.getElementById('fullWidth').value = ""
        clearInterval(timer);
        console.log(`timer is stopped ${timer}`)
        resultsData()
        console.log(WPM,accuracy)
        document.getElementById('wpm').innerText = `WPM : ${WPM}`
        document.getElementById('acc').innerText = `Accuracy : ${accuracy}`
        console.log(`no of correct are ${correct}`)
        console.log(`no of wrong are ${wrong}`)
        console.log(`no of lenghtClicked are ${lengthClicked}`)
        
        }
}

const handleKeyPressed = async (event) =>{
         event.preventDefault()
        const text_field_id = document.getElementById('fullWidth')
        // text_field_id.on('keydown ', function(event){
        //     console.log("Code: " + event.which);
        // });
        // console.log(`key clicked is ${event.key}`)
        //console.log(event)

        //console.log(event.keyCode)
        // if(event.key === 8){//for handling backspace that should be adde din no of length clicked
        //     no_of_backspace += 1;
        //     console.log("backspace is clicked")
        // }
        if(text_field_id.value.length >= len){
            console.log(text_field_id.value.length,len)
            calResults()
            startButton()
        }
        arrayValue = text_field_id.value.split('')
        lengthClicked = 0;
        correct=0;
        wrong=0;
        await arrayQuote.forEach((characterSpan,index)=>{
            const character = arrayValue[index]
            // console.log(index)
            if(character && index < length){
                if(character === characterSpan.innerText){
                    document.getElementById("span"+index).style.color="green"
                    document.getElementById("span"+index).style.textDecoration="underline"
                    // console.log(correct)
                    correct++
                    // console.log(character + characterSpan.innerText)
                }
                else{
                    document.getElementById("span"+index).style.color="red"
                    document.getElementById("span"+index).style.textDecoration="underline"
                    wrong++;
                }
                lengthClicked += 1
                const progressBar = document.getElementById("progressBar")
                progressBar.style.width = `${Math.floor((lengthClicked/length)*100)}%`
                // console.log(`${Math.floor((lengthClicked/length)*100)}%`)
                progressBar.innerText = `${Math.floor((lengthClicked/length)*100)}%`
            }
            else if(index >= length){
                console.log("the calResults is called bcoz the sentence is filled")
                startButton()
                calResults()
            }
            else{
                document.getElementById("span"+index).style.color="black"
                document.getElementById("span"+index).style.textDecoration="none"
                calResults()
            }
            // console.log(character +" ")
        })
        
        
    }
    // console.log(startTime)
    const calResults = () =>{
        const d  =new Date()
        endTime = d.getTime();
        // console.log(`start time is ${startTime}`)
        // console.log(`end time is ${endTime}`)
        // console.log(`lengthClicked  is ${lengthClicked}`)
        // console.log(`correct is ${correct}`)
        // console.log(`wrong is ${wrong}`)
        //console.log(`correct is ${correct}`)

        // console.log("Accuracy is :",((correct/lengthClicked)*100))
        const accur = ((correct/lengthClicked)*100).toFixed(2);
        // console.log("WPM is ",(((lengthClicked)*12000)/(endTime-startTime)))
        const wordpermin = (((lengthClicked)*12000)/(endTime-startTime)).toFixed(2)
        setWPM((wordpermin))
        setAccuracy((accur))
    }
    
    // if(status !== 422){
    return(
     <>
     <NavBar/> 
    {/* <Typography></Typography> */}
    <div id="progressBar" style={{height:"25px",backgroundColor: "orange",textAlign:"center",justifyContent:"center",alignItems:"center",width:"0%",borderRadius:"25px"}}>0%</div>
    <Container maxWidth="md" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
    <Box style={{marginLeft:"auto"}}>Timer: <span id="min_id">00</span><span>:</span><span id="sec_id">00</span></Box>
    <Box style={{padding:"15px"}}><Typography style={{marginBottom:"25px",userSelect: "none"}} id="para_from_api"></Typography></Box>
    <TextField
    fullWidth label="Start Writing Here...." id="fullWidth" multiline rows={7} disabled={disable}
    // onKeyPress={handleKeyPressed}
    
    onChange={handleKeyPressed}
    />
    

    <Button variant="contained" id="start_btn"
    style={{marginTop:"15px",marginBottom:"3px",marginLeft:"auto"}} onClick={startButton}>{buttonValue}</Button>
    <Button variant="contained"
    style={{marginTop:"15px",marginBottom:"3px",marginLeft:"auto"}} onClick={()=>{window.location.reload(false)}}>Next</Button>
    
    <Box style={{marginRight:"auto"}}><Typography id="wpm">WPM : {WPM}</Typography><Typography id="acc">Accuracy : {accuracy}</Typography></Box>
    </Container>
    
    </>)/* }else{
        return {status};
    } */


}
export default HomePage;