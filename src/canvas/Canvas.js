import React , { useEffect } from 'react' ;
import { objects , pop_manif } from '../objects/objects' ;
import { tar } from '../windows/Sides' ;
import { move } from '../components/cursor/cursor' ;
import { scale } from '../windows/Options' ;
import './Canvas.css' ;

export var ctx , canvas_events , rec_size = [ 0 , 1 ] ;

function Canvas () {

  var dragging , ox , oy , ix , iy , canvas , h_ , w_ ;

  canvas_events = ( con , fn ) => {
    if(!con){
      document.onmousedown = null ;
      document.onmouseup = null ;
      document.onmousemove = move ;
    }else {
      let cus = document.querySelectorAll('.cursor') ;
      cus.forEach( el =>
        el.classList.add('spec_cur')
      )
      document.onmousedown = e => {
        ox = e.clientX ; 
        oy = e.clientY ;
        dragging = true ;
      }
      document.onmousemove = e => {
        ix = e.clientX ; 
        iy = e.clientY ;
        move(e)
      }
      document.onmouseup = e => {
        let mass = objects.get_masses()[tar] ;
        fn( e.clientX   , e.clientY , ox , oy , mass ) ;
        canvas_events(false , () => {} , () => {} )
        cus.forEach( el =>
          el.classList.remove('spec_cur')
        )
        dragging = false ;
      }
    }
  }

  var draw_name = mass => {
    let r = mass.manifestation.calc_radius() ;
    let p = mass.manifestation.positions ;
    ctx.font = '12px monospace' ;
    ctx.fillStyle = 'rgb(80,80,80)' ;
    ctx.fillText( mass.name , p[p.length - 1].x - r , p[p.length - 1].y - ( r * 1.25 )  ) ;
  }
  
  function animate(ctx){
    objects.update_p()
    .update_a()
    .update_v() ;

    let mass_i = objects.get_masses()[tar] ;
    
    ctx.clearRect(mass_i.x * scale - ( w_ / 2 )  , mass_i.y * scale - ( h_ / 2 )  , w_  , h_  ) ;

    
    mass_i.manifestation.draw(
      mass_i.x * scale ,
      mass_i.y * scale
    ) ;
      
    draw_name( mass_i )
    objects.get_masses().forEach(mass => {
      if( mass.name !== mass_i.name ){
        let x = mass_i.x + mass.x * scale ;
        let y = mass_i.y + mass.y * scale ;

        if( x > rec_size[0] )rec_size[0] += x ;
        if( y > rec_size[1] )rec_size[1] += y ;
        
        mass.manifestation.draw( x , y ) ;
  
        draw_name( mass )
      }
    })
      
    if( dragging ) {
      ctx.beginPath() ;
      ctx.moveTo( ( ox - ( w_ / 2 ) ) + mass_i.x * scale , ( oy - ( h_ / 2 ) ) + mass_i.y * scale ) ;
      ctx.lineTo( ( ix - ( w_ / 2 ) ) + mass_i.x * scale , ( iy - ( h_ / 2 ) ) + mass_i.y * scale ) ;
      ctx.strokeStyle = '#3F98FF' ;
      ctx.stroke()
    }

    objects.get_masses()[tar].manifestation.follow(w_ , h_)

    requestAnimationFrame(() => animate( ctx ))
  }

  function get_canvas () {
    canvas = document.getElementById('canvas') ;
    if( canvas.getContext ) {
      ctx = canvas.getContext("2d") ;
      
      w_ = canvas.width = window.innerWidth ;
      h_ = canvas.height = window.innerHeight ;

      pop_manif(objects.get_masses())
    
      animate( ctx )
    }
  }

  useEffect(()=> {
    get_canvas()
  } ,[])

  return (
    <div id='canvas_con' >
      <canvas id='canvas' > check something </canvas>
    </div>
  )
}

export default Canvas 