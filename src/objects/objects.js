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
    return  ( r(to_eq) < 200 ) ? r(to_eq) :  r( 0.00000015 )
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
    //this.ctx.fillStyle = 'transparent' ;
    //this.ctx.fillRect( ( x_ - ( w / 2 ) ) , ( y_ - ( h / 2 ) ) , w , h ) ;

    //let old_matrix = this.ctx.getTransform() ;
    //this.ctx.translate(
    //  old_matrix.e  ,
    //  old_matrix.f  ,
    //)
  }
}


// defaults 
var a_ps = [
  {
    name: "Mercury",
    m: 1.65956463e-7,
    radius : 2440 ,
    x: -0.346390408691506,
    y: -0.272465544507684,
    z: 0.00951633403684172,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
    vz: -1.01249478093275
  },
  {
    name: "Venus",
    m: 2.44699613e-6,
    radius : 6052 ,
    x: -0.168003526072526,
    y: 0.698844725464528,
    z: 0.0192761582256879,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
    vz: 0.391700036358566
  },
]
var a_ss = [
  {
    name: "Sun", 
    m: 1,
    radius : 695508 ,
    x: -1.50324727873647e-6,
    y: -3.93762725944737e-6,
    z: -4.86567877183925e-8,
    vx: 3.1669325898331e-5,
    vy: -6.85489559263319e-6,
    vz: -7.90076642683254e-7
  },
]
var a_bs = [
  {
    name: "Earth",
    m: 3.0024584e-6,
    radius : 6371 ,
    x: 0.648778995445634,
    y: 0.747796691108466,
    z: -3.22953591923124e-5,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
    vz: -0.000258553333317722
  },
  {
    name: "Mars",
    m: 3.213e-7 ,
    radius : 3390 ,
    x: -0.574871406752105 ,
    y: -1.395455041953879 ,
    z: -0.01515164037265145 ,
    vx: 4.9225288800471425 ,
    vy: -1.5065904473191791 ,
    vz: -0.1524041758922603
  }
]


var objects = new S_Arrays('objects' , JSON.parse(JSON.stringify(a_ss.concat(a_bs , a_ps))) ) ;

var planets = new S_Arrays('planets' , a_ps ) ;

var stars = new S_Arrays('stars' , a_ss ) ;

var black_holes = new S_Arrays('black_holes', a_bs ) ;

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