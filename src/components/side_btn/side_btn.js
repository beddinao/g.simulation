import React , { useEffect } from 'react' ;
import './side_btn.css' ;
import { fn , to_fn_in } from '../cursor/cursor' 

function Side_btn (props) {
  useEffect(() => to_fn_in('#side_btn') )
  return (
    <button onClick={e => {props.fn(e) ; fn(e)}} id='side_btn' style={props.st} className={props.c} ><p> {props.txt} </p></button>
  )
}

export default Side_btn