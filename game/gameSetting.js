import * as THREE from 'three'

const Second  =  60

export class GameData {
  constructor(
    _PlayerNames      =      ['mike' , 'bob'],
    _PlayerColors     =      ['green', 'red'],
    _PlayerColorsName =      ['pink' , 'lightseagreen'],
    _EndCall          =      null,
    _CallBack         =      null,
    _EndScore         =      [0,0,0,0],
    _Times            =      [0, 0, 0],
    _PlayersNumber    =      2,
    _GameSize         =      10,
    _keybordMode      =      false,
    _Clock            = new  THREE.Clock(false)
  ) {
    this._PlayerNames      =  _PlayerNames
    this._PlayerColors     =  _PlayerColors
    this._PlayerColorsName =  _PlayerColorsName
    this._EndCall          =  _EndCall
    this._CallBack         =  _CallBack
    this._EndScore         =  _EndScore
    this._Times            =  _Times
    this._PlayersNumber    =  _PlayersNumber
    this._GameSize         =  _GameSize
    this._keybordMode      =  _keybordMode
    this._Clock            =  _Clock
    // 
  }
  copy(data) {
    this._PlayerNames      =  data._PlayerNames
    this._PlayerColors     =  data._PlayerColors
    this._PlayerColorsName =  data._PlayerColorsName
    this._EndCall          =  data._EndCall
    this._CallBack         =  data._CallBack
    this._EndScore         =  data._EndScore
    this._Times            =  data._Times
    this._PlayersNumber    =  data._PlayersNumber
    this._GameSize         =  data._GameSize
    this._keybordMode      =  data._keybordMode
    this._Clock            =  data._Clock
  }
  //* CallBack
  setCallBack(ft) {
    this._CallBack = ft
  }
  getCallBack() {
    return this._CallBack
  }

  //* Gamemod

  //* times
  resetTime() {
    this._Times = [0, 0, 0]
  }
  //> call on Draw if you want the timer to go up
  TickTime() {
    this._Times[2]++
    if (this._Times[2] >= Second) { this._Times[2] = 0; this._Times[1]++}
    if (this._Times[1] >= Second) { this._Times[1] = 0; this._Times[0]++}
  }
  TimeLog() {
    console.log(this._Times)
  }
  getTime() {
    return this._Times
  }
  //* Score 
  setEndScore(EndScore) {
    this._EndScore = EndScore
  }
  getEndScore() {
    return this._EndScore
  }
  //* EndGame
  setEndGame(ft) {
    this._EndCall = ft
  }
  getEndGame() {
    return this._EndCall
  }
  //* Names
  setNames(names) {
    this._PlayerNames = names
  }
  setName(name, pos) {
    this._PlayerNames[pos] = name
  }
  getNames() {
    return this._PlayerNames
  }
  getName(pos) {
    return this._PlayerNames[pos]
  }
  //* Playercolors
  getPlayerColor(pos) {
    return this._PlayerColors[pos]
  }
  getPlayersColor() {
    return this._PlayerColors
  }
  setPlayerColor(color, pos) {
    this._PlayerColors[pos] = color
  }
  setPlayerColors(colors) {
    this._PlayerColors = colors
  }
  //* PlayerNameColor
  getPlayersNameColor() {
    return this._PlayerColorsName
  }
  getPlayerNameColor(pos) {
    return this._PlayerColorsName[pos]
  }
  setPlayersColors(colors) {
    this._PlayerColorsName = colors
  }
  setPlayerColorsName(color, pos) {
    this._PlayerColorsName[pos] = color
  }
}
