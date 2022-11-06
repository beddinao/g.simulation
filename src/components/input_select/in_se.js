import React , { useEffect , useState } from 'react' ;
import { to_fn_in } from '../cursor/cursor' ;
import "./in_se.css" ;
 
export function Input (props) {
  useEffect(() => {
    let inpu = document.getElementById(props.p_h + '_little_input') ;
    inpu.value = ''
  })
  return <input placeholder={props.p_h} id={props.p_h + '_little_input'} onChange={props.in_fn} />
}
export function Info_ (props) {

  var obj = JSON.parse( JSON.stringify(props.ob) ) ,
      names_ = ['name' , 'earth mass' , 'radius' , 'position x' , 'pos y' , 'pos z' , 'velocity x' , 'vy' , 'vz', 'acceleration x' , 'ay' , 'az'  ] ;

  if( props.all ){
    let ps_ = obj.manifestation.positions ;
    obj.x = ps_[ ps_.length - 1 ].x  ;
    obj.y = ps_[ ps_.length - 1 ].y  ;
  
    delete obj.manifestation  ;
  } else {

    for( let i = 0 , ks = Object.keys(obj) ; i < ks.length ; i++ )
      if( ks[i] !== 'name' && ks[i] !== 'm' && ks[i] !== 'radius' ) delete obj[ks[i]] ;
    ;

    names_.splice( 3 , names_.length )
  }

  obj.m /= 3.0024584e-6 ;
  
  var trans = input => {
    var ob = [] ,
        tofi = str => {
          return ( typeof str === 'number' ) ? str.toFixed(8) : str
        } ;

    for( let i = 0 ; i < input.length ; i += 3 ) 
      ob.push ( 
        <div>
          <p>{ tofi(input[i]) }</p>
          <p>{ tofi(input[i + 1]) }</p>
          <p>{ tofi(input[i + 2]) }</p>
        </div>
      )

    return ob
  }

  return (
    <div className='info_' >
      <div> { trans( names_ ) } </div>
      <div> { trans( Object.values(obj) ) } </div>
    </div>
  )

}
function Drop_down (props) {
  let pa_sty = getComputedStyle(props.el) ;

  function add_op() {
    for(let i = 0 ; i < props.list.length ; i++){
      let p = document.createElement('p') ;
      p.textContent = props.list[i] ;
      p.onclick = props.cl ;
      document.querySelector('.drop_down').appendChild(p)
    }
  }

  useEffect(()=> {
    add_op()
    to_fn_in('.drop_down')
    return () => document.querySelectorAll(".drop_down > p").forEach(p => p.parentNode.removeChild(p))
  },[])

  return(
    <div className={'drop_down'} style={{ width : pa_sty.width , transform : `translateY(${parseFloat(pa_sty.height) + 4 + 'px'})` }} onMouseLeave={props.out} ></div>
  )
}
export function Select (props) {
  const [ selec_d , set_selec_d ] = useState(props.children[0])
  const [ droped , set_droped ] = useState(false) ;

  useEffect(() => {
     to_fn_in(`.drop_${props.children[0]}`)  ;
    })
  return (
    <div>
      { props.input ? <Input p_h='00' in_fn={props.in_fn} /> : [] }

      <div className={`select drop_${props.children[0]}`}  onClick={e => {
        droped ? set_droped(false) : set_droped(true)
      }} >
        <p id='se_v' >{selec_d}</p>
        <p>{'>'}</p>
      </div>

      { droped ? <Drop_down list={props.children} cl={e=>{
        set_selec_d(e.target.textContent) ; set_droped(false) ; props.info ? props.fn(e) : e => {}
      }} el={document.querySelector(`.drop_${props.children[0]}`)} out={e => set_droped(false)} /> : [] }

    </div>
  )
}
export default function In_se_wrapper (props) {
  return (
    <div id='in_wr' style={{width : props.w}} >
      <p>{props.title}</p>
      {props.children}
    </div>
  )
}
