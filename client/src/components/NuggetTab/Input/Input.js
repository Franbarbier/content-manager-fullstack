const Input = ({type, onChange, value, placeholder="", disabled=false}) => {

    if(type==="number"){
        value = setToFixed(parseFloat(value))
    }

    function setToFixed(valueToFix){
        let valueFixed;
        if(type==="number" && valueToFix % 1 !== 0 && typeof valueToFix !== "string"){
            valueFixed = valueToFix?.toFixed(2)
        }else if(type==="number" && valueToFix % 1 === 0 && typeof valueToFix !== "string"){
            valueFixed = valueToFix?.toFixed(0)
        }
        return valueFixed;
    }

    return ( 
        <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} />
     );
}
 
export default Input;