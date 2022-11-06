import React from 'react' ;
import './main_btn.css' ;
import { fn } from '../cursor/cursor' ;

function Button (props) {

  var hover = (e , co) => {e.currentTarget.style.color = co ? props.c : 'var(--txt)' ; fn(e) } ;
  var click = e => { props.evnt( props.clas ? document.querySelector('.' + props.clas) : e ) ; fn(e) };

  return(
    <button id='main_btn' className={props.c} onClick={click} onMouseDown={fn} onMouseUp={fn} style={props.st} onMouseEnter={e => hover(e , true)} onMouseLeave={e => hover(e , false)} >{props.children}</button>
  )
}

export default Button