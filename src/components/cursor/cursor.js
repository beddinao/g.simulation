import React , { useEffect } from 'react' ;
import './cursor.css' ;
import { css_var } from '../window/window' ;

var curs , i_ds = ['a','b'] ;

export var move = e => curs.forEach(el => {
    el.style.top = e.pageY + 'px' ;
    el.style.left = e.pageX + 'px' ;
  })


export function fn (e) {

  /* Magic  */
  for( let i = 0 ; i < curs.length ; i++ ){
    curs[i].classList.forEach( cl => 
      cl.length > 8 ? curs[i].classList.remove(cl) : []
    )
    curs[i].classList.add(
      `cur_${i_ds[i]}_${e.type}`
    ) 
  }
  css_var('Post' , '--t-btn-c' , e.currentTarget.className )
}

export var to_fn_in = elm => {
  let ele = document.querySelectorAll(elm) ;
  ele.forEach(elem => {
    elem.onmouseenter = elem.onmouseleave = elem.onmousedown = elem.onmouseup =  fn ;
  } )
}

function Cursor () {
  var a = new Array ;

  for(let i = 0 ; i < 2 ; i++ )
    a.push( <div className={`cursor cur_${i_ds[i]}`} /> )
  ;

  useEffect(() => {
    curs = document.querySelectorAll('.cursor') ;
    document.onmousemove = move ;

    return () => document.onmousemove = null ;
  } , [])
  
  return a
}

export default Cursor