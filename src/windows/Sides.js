import React , { useState , useEffect } from 'react' ;
import In_se_wrapper , { Input , Select , Info_ } from '../components/input_select/in_se' ;
import Window from '../components/window/window' ;
import Button from '../components/main_btn/main_btn' ;
import Side_btn from '../components/side_btn/side_btn' ;
import { planets , all_exis , objects } from '../objects/objects' ;
import { canvas_events } from '../canvas/Canvas' ;


var Create_ = (props) => {
  const [ info , set_info ] = useState(props.ar._arr[1] ? props.ar._arr[1] : planets._arr[1]) ;
  var a_ = [] , a = [] ;
  
  for(let i = 1 ; i < props.ar._arr.length ; i++ ){
    a_.push(props.ar._arr[i].name)
  }
  useEffect(() => {
    if(props.fn){
      props.fn(info)
    }
  })

  a.push(
    <In_se_wrapper w='100%'>
      <Select info={true} fn={e => set_info(props.ar.get_obj(e.currentTarget.textContent))} >
        {a_}
      </Select>
    </In_se_wrapper>
  ) ;

  a.push(<Info_ ob={info} all={props.all} />)

  return a
}

var calc_mass = str => {
  let leng = str.length ;
  return parseFloat(str) * ( ( str.slice( leng - 4 , leng ) === 'ea_m' ) ? 3.0024584e-6 : 1 )
}

var calc_size = str => {
  let leng = str.length ;
  return parseFloat(str) * ( ( str.slice( leng - 4 , leng ) === 'mile' ) ? 0.6213712 : 1 )
}

function Shoose(props) {
  const [ which , set_which ] = useState('none') ;
  const [ is_btn_s , set_is_btn_s ] = useState(false) ;

  var els = [] , info_ = {} ;

  function create_ob ( i_x , i_y , o_x , o_y , mass) {
    let ob = {
      x : i_x ,
      y : i_y ,
      ox : o_x ,
      oy : o_y ,
      mass_x : mass.x ,
      mass_y : mass.y
    }
    if( which === objects ) {
      let obj = ob ;
      
      obj[els[0]._a] = els[0]._v ;
      obj['m'] = calc_mass(els[1]._v) ;
      obj[els[2]._a] = calc_size(els[2]._v) ;

      
      objects.set_obj(obj)
    } else {
      objects.set_obj(Object.assign(info_ , ob))
    }
  }
  var Creat_Ob = () => {

    const in_v = (e , n) => {
      let _p = e.currentTarget.parentNode.querySelector('#se_v') ;
      els[n]._v = e.currentTarget.value + ( _p ? ( _p.textContent || _p.value ) : '' ) ;
    } ;
    els = [
      {
        _a : 'name' ,
        _i : <Input p_h='NAME' in_fn={ e => in_v( e , 0 ) } />
      } ,
      {
        _a : 'mass' ,
        _i : <Select input={true} in_fn={ e => in_v( e , 1 ) }  >{[ 'so_m' , 'ea_m' ]}</Select> ,
      } ,
      {
        _a : 'radius' ,
        _i : <Select input={true} in_fn={ e => in_v( e , 2 ) } >{[ 'km' , 'mile' ]}</Select>
      }
    ] ;
    var a = new Array ;
    for (let i = 0 ; i < els.length ; i++ ){
      a.push(
        <In_se_wrapper key={els[i]._a + ' '} title={els[i]._a} >
          {els[i]._i}
        </In_se_wrapper>
      )
    }
    return a
  }

  //

  var Items = () => {
    var a = new Array ;
    for (let i = 0 ; i < all_exis.length - 1 ; i++ ) {
      a.push(
        <Button c='var(--main-c)' key={all_exis[i]._id} st={{ height : '48%' , width : '48%' }} evnt={(e) => {
          set_which(all_exis[all_exis.length - 1](e.currentTarget.textContent)) ;
        } } >
            {all_exis[i]._id}
        </Button>
      )
    }
    //
    useEffect(()=>{
      set_is_btn_s(false)
      return () => { set_is_btn_s(true) }
    } , [])
    //
    return a
  }
  return (
    <Window h_txt='Create' btn_s={
      is_btn_s ? ( <div>
        <Button evnt={props.close} c='var(--text)'>close</Button>
        <Button evnt={() =>  { props.close() ; canvas_events(true , create_ob )} } c='var(--main-c)'>create</Button>
      </div> ) : []
    } st={{ left : '8%' }} >
      { which === 'none' ? <Items /> : which === objects ? <Creat_Ob /> : <Create_ all={false} ar={which} fn={ai =>{ info_ = ai }} /> }
    </Window>
  )
}
///

export function Main_create () {
  const [ dis , set_dis ] = useState(false) ;
  return !dis ? <Side_btn txt='+' fn={ () => set_dis(true) } c='cr_' /> : <Shoose close={() => set_dis(false)} />
}

export var tar = 0 ;

export function Main_info () {
  const [ dis , set_dis ] = useState(true) ;
  const [ con_dis , set_con_dis ] = useState(false)
  const [ cur_obj , set_cur_obj ] = useState({}) ;

  var get_cur_obj = obj => {
    set_cur_obj(obj)
  }
  var remove_obj = () => {
    objects.remove_obj(cur_obj.name) ;
    set_dis(true) ;
    set_con_dis(false) ;
    setTimeout(() => set_dis(false) , 200)
  }
  
  var Del_conf = () => {
    return (
      <Window h_txt={"delete " + cur_obj.name} st={{ width:'25em' , height:'20em' }} btn_s={ <div> 
          <Button c='var(--text)' evnt={() => set_con_dis(false)} >cancel</Button>
          <Button c='var(--extra-c)' evnt={remove_obj} >yes</Button>
         </div> } >
        <p> are you sure ? </p>
      </Window>
    )
  }

  return dis ? <Side_btn txt='{}' fn={()=> { dis ? set_dis(false) : set_dis(true)}} c='_in' /> : (
    <Window h_txt='Info' btn_s={ <div>
        <Button evnt={() => set_con_dis(true)} c='var(--extra-c)'>delete</Button>
        <Button evnt={()=>{ tar = objects.get_masses().indexOf(objects.get_obj(cur_obj.name)) }} c='var(--main-c)'>follow</Button>
        <Button evnt={() => set_dis(true)} c='var(--text)'>close</Button>
      </div>  } st={{ left : '65%' }} >
        <Create_ all={true} ar={objects} fn={get_cur_obj} />
        { con_dis ? <Del_conf /> : [] }
    </Window>
  )
}




