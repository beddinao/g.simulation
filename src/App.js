import React from "react";
import './main.css' ;
import Head from './components/head/head'
import Canvas from './canvas/Canvas' ;
import Cursor from './components/cursor/cursor' ;
import Help from './windows/Help' ;
import Size from './components/size/size' ;
import { Main_info , Main_create } from './windows/Sides' ;

document.oncontextmenu = () => {
  return false
} 
document.title = "  G. Simulation"

export default function App() {
  return (
    <main>
      <Head />
      <Canvas />
      <Main_create />
      <Main_info />
      <Help />
      <Size />
      <Cursor />
    </main>
  )
}