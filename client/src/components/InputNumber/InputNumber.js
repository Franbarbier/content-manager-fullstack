import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';

// import thumg_img from '../../../../server/public/'

import './InputNumber.css';


const InputNumber = ({value, onChange, id}) => {

//   const dispatch = useDispatch()
const [inputValue, setInputValue] = useState(value != 0 ? value.toFixed(2) : value)
// const [inputValue, setInputValue] = useState(value.toFixed(2))


function newValueInput(e) {
    console.log(e.target.value)
    
    setInputValue(Number(e.target.value))
    onChange(Number(e.target.value))

}
function sumar1(e) {
    // setInputValue(Number(inputValue) + 1 )
    onChange(Number(inputValue) + 1 )

}
function restar1(e) {
    // setInputValue(Number(inputValue) - 1 )
    onChange(Number(inputValue) - 1 )

}
useEffect(()=>{
    onChange(inputValue)
},[inputValue])

  function render(){
      return <div className='input-number-cont'>
               <input onChange={newValueInput} value={inputValue} id={id} type="number" key={Math.floor(Math.random() * (0-500 + 1)) + 0}/>
               <div>
                    <div className="sumar1" onClick={sumar1} >+</div>
                    <div className="restar1" onClick={restar1} >-</div>
               </div>
             </div>
             
       }
       
       
       return ( render() )
}




export default InputNumber;
