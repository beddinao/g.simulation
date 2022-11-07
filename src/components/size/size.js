import React , { useEffect , useState } from 'react' ;
import './size.css' ;
import { rec_size } from '../../canvas/Canvas' ;
import { scale } from '../../windows/Options' ;


function Size () {
  const [ ob , set_ob ] = useState({ x : 0 , y : 0 }) ;
  var svg_ , w , h , inter ;

  var svg_in = () => {
    svg_ = document.querySelector('.size_con > svg') ;
    let sv_sty = getComputedStyle(svg_) ;
    w = parseFloat(sv_sty.width) ;
    h = parseFloat(sv_sty.height) ;
    draw() ;

    inter = setInterval(() => {
      set_ob({ x : rec_size[0] / scale , y : rec_size[1] / scale })
    } , 500)
  }
  var undraw = () => {
    let path_elem = document.querySelectorAll('.si_path_') ;
    path_elem.forEach(el => el.parentNode.removeChild(el)) ;
    window.clearInterval(inter) ;
  }
  var attach_path = pos => {
    let path_html_elem = document.createElementNS(
      'http://www.w3.org/2000/svg' ,
      'path'
    ) ;
    path_html_elem.setAttributeNS(null , 'd' , pos) ;
    path_html_elem.classList.add('si_path_')
    svg_.appendChild(path_html_elem) ;
  }
  function draw() {
    attach_path(`M 5,30 L 5,${h-20} M 0,35 L 5,30 L 10,35 M 0,${h-25} L 5,${h-20} L 10,${h-25}`) ;
    attach_path(`M 25,${h-5} L ${w - 20},${h-5} M 30,${h-10} L 25,${h-5} L 30,${h} M ${w-25},${h-10} L ${w-20},${h-5} L ${w-25},${h} `)
  }

  useEffect(() => {
    svg_in()
    return () => undraw()
  },[])

  return (
    <div className='size_con' >
      <svg></svg>
      <div>
        <p>{ob.y.toFixed(2)} au</p>
        <p>{ob.x.toFixed(2)} au</p>
      </div>
    </div>
  )
}

export default Size