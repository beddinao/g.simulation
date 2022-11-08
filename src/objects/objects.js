import { ctx } from '../canvas/Canvas' ;
import { trail_length , scale } from '../windows/Options' ;
/*
 
  1 astronomical unit  =  1.495979e+8 km  =  9.29558254831e+7 mile  =  300px 

*/
var g = 39.5 ,
    dt = 0.008 ,
    soft_c = 0.15 ;

class S_Objects {
  constructor(n , w , p , v ) {
    this.name = n ;
    this.m = w[0] ,
    this.radius = w[1] ;
    this.x = p[0] ;
    this.y = p[1] ;
    this.z = 0 ;
    this.vx = v[0] ;
    this.vy = v[1] ;
    this.vz = 0 ;
    this.manifestation = new Manifestation(
      ctx ,
      this.radius
    )
  }
}
class S_Arrays {
  constructor(id , masses){
    this._arr = [
      this._id = id ,
    ] ;
    masses.forEach(mass => this._arr.push(mass)) ;
  };
  //
  reset(){
    location.reload()
  }

  set_obj = obj =>
    this._arr.push(new S_Objects(
      ( this.get_obj(obj.name) !== undefined ) ?  obj.name + '_' + parseFloat(obj.x) : obj.name , 
      [ obj.m , obj.radius ] , 
      [ 
        ( ( obj.x - window.innerWidth / 2 ) / scale ) + obj.mass_x , 
        ( ( obj.y - window.innerHeight / 2 ) / scale ) + obj.mass_y
      ] ,
      [ ( obj.x - obj.ox ) / 35 , ( obj.y - obj.oy ) / 35 ]
    ));
  get_obj (el) {
    return this._arr.find(ob => {
      return ob.name === el
    })
  } ;
  get_masses(){
    return this._arr.slice( 1 , this._arr.length )
  }
  remove_obj = el =>{ 
    this._arr.splice(this._arr.indexOf(this.get_obj(el)) , 1) ;
    if( this._arr.length == 1 ){
      location.reload()
    }
  };

  //
  update_p(){
    let le = this.get_masses().length ;
    for(let i = 0 ; i < le ; i++ ){
      let mass_i = this.get_masses()[i] ;
      mass_i.x += mass_i.vx * dt ;
      mass_i.y += mass_i.vy * dt ;
      mass_i.z += mass_i.vz * dt
    }
    return this
  }
  update_v(){
    let le = this.get_masses().length ;
    for(let i = 0 ; i < le ; i++ ){
      let mass_i = this.get_masses()[i] ;
      mass_i.vx += mass_i.ax * dt ;
      mass_i.vy += mass_i.ay * dt ;
      mass_i.vz += mass_i.az * dt
    }
    return this
  }
  update_a(){
    let masses_length = this.get_masses().length ;
    for(let i = 0 ; i < masses_length ; i++ ){
      let ax = 0 , ay = 0 , az = 0 ;
      let mass_i = this.get_masses()[i] 

      for(let j = 0 ; j < masses_length ; j++ ){
        if( i !== j){
          let mass_j = this.get_masses()[j] ;

          let d_x = mass_j.x - mass_i.x ,
          d_y = mass_j.y - mass_i.y ,
          d_z = mass_j.z - mass_i.z ;

          var dist_sq = d_x * d_x + d_y * d_y + d_z * d_z ;

          var f = ( g * mass_j.m ) / ( dist_sq * Math.sqrt( dist_sq + soft_c ) ) ;
          ax += d_x * f ;
          ay += d_y * f ;
          az += d_z * f
        }
      }

      mass_i.ax = ax ;
      mass_i.ay = ay ;
      mass_i.az = az ;
    }
    return this 
  }
}

export class Manifestation {
  constructor(ctx , radius){
    this.ctx = ctx ;
    this.radius = radius ;
    this.positions = [] ;
  }

  store_positions = (x , y) => {
    this.positions.push({ x , y }) ;
    if( this.pos_len(0) >= trail_length ) this.positions.splice( 0 , this.pos_len(trail_length) ) ;
  }
  pos_len (n) {
    return this.positions.length -  n 
  }
  calc_radius = () => {
    let r = num => { return this.radius * ( scale * num ) } , 
        to_eq = 0.000015 ;
    return  ( r(to_eq) > 250 ) ? r( 0.00000015 ) : ( r(to_eq) > 50 ) ? r( 0.000008 ) : r(to_eq)
  }

  draw(x , y){

    this.store_positions(x , y) ;

    this.ctx.beginPath() ;
    this.ctx.moveTo( this.positions[0].x , this.positions[0].y ) ;
    this.ctx.strokeStyle = 'rgb(56, 60, 68)' ;
    this.ctx.strokeWidth = 40 ;
    for(let i = 1  ; i < this.pos_len(0)  ; i++ ){
      this.ctx.lineTo(this.positions[i].x , this.positions[i].y )
    }
    this.ctx.stroke()
    
    this.ctx.beginPath() ;
    this.ctx.arc(
      this.positions[this.pos_len(1)].x ,
      this.positions[this.pos_len(1)].y ,
      this.calc_radius() ,
      0 ,
      2 * Math.PI
    );
    this.ctx.strokeWidth = 6 ;
    this.ctx.fillStyle = 'rgba(79, 84, 96,.1)' ;
    this.ctx.strokeStyle = '#3F98FF' ;
    this.ctx.stroke() ;
    this.ctx.fill()
  }
  follow(w , h){
    this.ctx.resetTransform() ;
    let x_ = this.positions[this.pos_len(1)].x  ;
    let y_ = this.positions[this.pos_len(1)].y ;
    this.ctx.translate(
      - ( x_ - ( w / 2 ) ) ,
      - ( y_ - ( h / 2 ) )
    )
  }
}


// defaults 

var a_bs_s = [
  {
    name : 'Earth' ,
    m : 2.986095001493E-30,
    radius : 6371 ,
    x : 7.009975722991404E-01 ,
    y : 6.920815019360272E-01 ,
    z : 1.681649272837761E-04 ,
    vx : -4.484879364 ,
    vy : 4.47255706748 ,
    vz : -0.000411710293745
  },
  {
    name : 'Mars' ,
    m : 3.2085500016043E-30,
    radius : 3389 ,
    x  :  7.539209714608244E-01 ,
    y : 1.284648859119576E+00  ,
    z :  8.402002886049328E-03 ,
    vx : -4.19988844719  ,
    vy :3.0432445237 ,
    vz : 0.166899575805 ,
  }
]
var a_ps_s = [
  {
    name : 'Venus' ,
    m :2.4342500012171E-29,
    radius : 6051 ,
    x : -4.412813246675847E-01,
    y : -5.804023560488093E-01 ,
    z : 1.716909987421782E-02 ,
    vx : 5.87578875774  ,
    vy : -4.44677771127 ,
    vz : -0.400018733105 ,
  } ,
  {
    name : 'Mercury' ,
    m :1.6510000008255E-30 ,
    radius : 2440+-1  ,
    x : -3.446199632430936E-01 ,
    y : -2.900796543576517E-01  ,
    z :7.230294332921780E-03 ,
    vx :4.63109579536 ,
    vy : -7.30805790149 ,
    vz : -1.02170262947,
  } ,
  {
    name : 'Jupiter' ,
    m : 9.4909361047455E-23 ,
    radius : 71492+-4 ,
    x : 4.903756709785851E+00 ,
    y : 6.168858035718945E-01 ,
    z : -1.122693355848382E-01 ,
  } ,{
    name : 'Saturn' ,
    m : 2.8417000014208E-30 ,
    radius : 60268+-4 ,
    x : 7.979782726614224E+00 ,
    y : -5.755956247828226E+00 ,
    z : -2.176306710075845E-01 ,
  } ,
  {
    name :  'Uranus' ,
    m : 4.3406500021703E-29 ,
    radius : 25559+-4 ,
    x : 1.352020152627576E+01 ,
    y : 1.428940666007000E+01 ,
    z : -1.220853198562557E-01 ,
  } ,
  {
    name : 'Neptune' ,
    m : 5.1204500025602E-29 ,
    radius : 24766+-15 ,
    x : 2.973545720367138E+01 ,
    y : -3.115504158441270E+00 ,
    z : -6.211239097132475E-01
  }
] ;
var a_ss_s = [
  {
    name : 'Sun' ,
    m : 1 ,
    radius : 695700 ,
    x : -9.087550525554187E-03 ,
    y : 5.920001697036284E-04 ,
    z : 2.067850930940190E-04 ,
    vx : 9.05591871191e-05 ,
    vy :0.00330750603137 ,
    vz : 2.54868987252e-05 ,
  }
] ;

var inner_solar_system = [
  a_ss_s[0] ,
  a_ps_s[1] ,
  a_ps_s[0] ,
  a_bs_s[0] ,
  a_bs_s[1]
]

var objects = new S_Arrays('objects' , JSON.parse(JSON.stringify(inner_solar_system)) ) ;

var planets = new S_Arrays('planets' , a_ps_s ) ;

var stars = new S_Arrays('stars' , a_ss_s ) ;

var black_holes = new S_Arrays('black_holes', a_bs_s ) ;

//

export function pop_manif (masses) {
  masses.forEach(mass => {
    mass['manifestation'] = new Manifestation(
      ctx ,
      mass.radius
    )
  })
}

var all_exis = [
  planets ,
  stars ,
  black_holes ,
  objects , 
  function get_ar (ar) {
    return this.find(a => {
      return a._id === ar
    })
  } ,
]

export { planets , all_exis , objects }