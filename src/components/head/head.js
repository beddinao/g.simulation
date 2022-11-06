import React , { useEffect , useState } from 'react' ;
import { Options } from '../../windows/Options' ;
import { fn } from '../cursor/cursor' ;
import './head.css' ;

var svg_1 ;

function draw () {
  svg_1 = document.querySelector('#head svg') ;
  let svg_1_s = getComputedStyle(svg_1) ;
  dra(parseFloat(svg_1_s.height) , parseFloat(svg_1_s.width))
}

var dra = (h , w) => {
  let pos = `M 0,${h} L ${w / 2},0 L ${w},${h}` ;
  let path_html_elem = document.createElementNS(
    'http://www.w3.org/2000/svg' ,
    'path'
  ) ;
  path_html_elem.setAttributeNS(null , 'd' , pos) ;
  path_html_elem.classList.add('path_')
  svg_1.appendChild(path_html_elem) ;
}

var undraw = () => {
  let path_elem = document.querySelector('.path_') ;
  path_elem.parentNode.removeChild(path_elem)
}

function Head () {
  const [ dis , set_dis ] = useState(false) ;
  useEffect(()=>{
    draw() ;
    let divs = document.querySelectorAll('#head > div:nth-child(1) > p')
    divs.forEach(div => {
      div.className = 'var(--txt)' ;
      div.onmouseenter = div.onmouseleave = div.onmousedown = div.onmouseup =  fn ;
    })
    return () => {
      undraw() ;
      divs.forEach(el => {
        el.onmouseup = null
      })
    }
  } , [])
  return(
    <div id='head' >
      <div><p onClick={() => { dis ? set_dis(false) : set_dis(true) }  } >options</p><p ><a href='https://sh-wave.netlify.app' target='_blank' style={{ color : 'var(--txt)' }} >more</a></p></div>
      <svg></svg>
      <div className='circle' ></div>
      <p><span style={{ color : 'var(--main-c)' }} >G. </span> SIMULATION</p>
      { dis ? <Options close={() => set_dis(false)} /> : [] }
    </div>
  )
}

export default Head