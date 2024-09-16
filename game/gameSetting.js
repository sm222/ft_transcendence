
const Second  =  60

export class GameData {
  constructor(
    _PlayerNames      = ['mike', 'bob'],
    _PlayerColors     = ['green', 'red'],
    _PlayerColorsName = ['pink', 'lightseagreen'],
    _EndCall          = null,
    _EndScore         = [0,0,0,0],
    _Times            = [0, 0, 0]
  ) {
    this._PlayerNames      =  _PlayerNames
    this._PlayerColors     =  _PlayerColors
    this._PlayerColorsName =  _PlayerColorsName
    this._EndCall          =  _EndCall
    this._EndScore         =  _EndScore
    this._Times            =  _Times
  }
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
