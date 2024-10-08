import React from 'react' ;
import Window from '../components/window/window' ;
import Button from '../components/main_btn/main_btn' ;
import { objects } from '../objects/objects' ;
import In_se_wrapper , { Input } from '../components/input_select/in_se' ;

let trail_length = 10 , scale = 400 ;

function Options (props) {

  const st = { height : '18em' , width : '32em' , top : '50%' , transform: 'translateY(50%)' } ;
  return (
    <Window h_txt='options' st={st} btn_s={<div><Button evnt={props.close} c='var(--text)'>close</Button></div>} >
      <In_se_wrapper title='scale' >
        <Input p_h={` 20 < ${scale} < 1000 `} in_fn={ e => { 
          let txt = parseFloat(e.currentTarget.value) ;
          if( txt > 19 && txt < 1001 ) scale = txt ;
        } } />
      </In_se_wrapper>
      <In_se_wrapper title='trail length' >
        <Input p_h={` 0 < ${trail_length} < 10000 `} in_fn={ e => { 
          let txt = parseFloat(e.currentTarget.value) ;
          if( txt > 0 && txt < 10000 ) trail_length = txt ;
        } } />
      </In_se_wrapper>
      <In_se_wrapper title='reset' >
        <Button c='var(--extra-c)' evnt={() =>{ objects.reset()  }} >restore defaults</Button>
      </In_se_wrapper>
    </Window>
  )
}

export { Options , trail_length , scale }
