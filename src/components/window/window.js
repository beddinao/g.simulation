import React from 'react' ;
import './window.css' ;
import { move , fn } from '../cursor/cursor' ;

export function css_var (co , n , v) {
  let r = document.querySelector(':root') ;
  if ( co === 'Get' ) {
    return getComputedStyle(r).getPropertyValue(n)
  }else if ( co === 'Post' ) {
    r.style.setProperty(n , v)
  }
}

const drag_mouse = (e) => {
  fn(e) ;
  let tar = e.currentTarget.parentNode ;
  e.preventDefault();
  let pos_3 = e.clientX ;
  let pos_4 = e.clientY ;
  document.onmouseup = () => {
    document.onmouseup = null;
    document.onmousemove = move ;
  } ;
  document.onmousemove = (e) => {
    e = e || window.event;
    e.preventDefault();
    let pos_1 = pos_3 - e.clientX;
    let pos_2 = pos_4 - e.clientY;
    pos_3 = e.clientX;
    pos_4 = e.clientY;
    tar.style.top = tar.offsetTop - pos_2 + 'px' ;
    tar.style.left = tar.offsetLeft - pos_1 + 'px' ;
    move(e)
  } ;
}

function Window (props) {
  return(
    <div id='main_window' style={props.st} >
      <div onMouseDown={drag_mouse} onMouseUp={fn} onMouseEnter={fn} onMouseLeave={fn} className='var(--text)' ><p id='id' >{props.h_txt}</p></div>
      <div className={props.se_sty} >{props.children}</div>
      {props.btn_s}
    </div>
  )
}

export default Window