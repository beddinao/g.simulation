import React , { useState } from 'react' ;
import Window from '../components/window/window' ;
import Button from '../components/main_btn/main_btn' ;
import Side_btn from '../components/side_btn/side_btn' ;

const bt_c_s = 'calc( 95% - 1.25em )' ,
      btn_sty = { height : '2.5em' ,
        left : bt_c_s , top : bt_c_s ,
        borderRadius : '50%' ,
      }
;

function Help () {
  const [ vis , set_vis ] = useState(false) ;

  return vis ? (
    <Window h_txt='help' btn_s={
      <div>
        <Button evnt={() => set_vis(false)} c='var(--main-c)'>close</Button>
      </div>
    } >
      <div><p>- units : kilograme , solar mass .</p></div>
      <div><p>- time : 292 days for every second, might be less depends on the refresh rate of screens.</p></div>
      <div><p>- This simulation is and has not been made to be 100% accurate , it is just a fun project where you can see what will happen if an exoplanet suddenly enters the solar system .  </p></div>
      <div><p>- The Information given in the info tab are only the ones being applied on this envirement, therefore it requires more calculations to be used as real time data . </p></div>
      <div><p>- if you like to contribute : <a target='_blank' >https://eddi.github</a> </p> </div>
    </Window>
  ) : <Side_btn st={btn_sty} txt='?' fn={() => set_vis(true)} />
}


export default Help