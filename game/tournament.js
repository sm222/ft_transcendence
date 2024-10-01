import { GameData } from "./gameSetting.js"

export class Tournament {
  constructor(
    _PlayersNames     = ['mike' ,          'bob',  'liza',          'rose' ],
    _PlayersColors    = ['green',          'red',  'blue',          'White'],
    _PlayerColorsName = ['lightseagreen' , 'pink', 'darkslateblue', 'gray' ]
  ) {
    this._PlayersNames = _PlayersNames
    this._PlayersColors = _PlayersColors
    this._PlayerColorsName = _PlayerColorsName
    this._game = null
    this._list = null
    this._GameData = null
    this._totalRound = 0
    this._tempList = []
    this._roundIndex = 0
  }
  copy(data) {
    this._PlayersNames     =  data._PlayersNames
    this._PlayersColors    =  data._PlayersColors
    this._PlayerColorsName =  data._PlayerColorsName
    this._game             =  data._game
    this._list             =  data._list
    this._GameData         =  data._GameData
    this._totalRound       =  data._totalRound
    this._tempList         =  data._tempList
    this._roundIndex       =  data._roundIndex
  }
  setPlayersNames(names) { this._PlayersNames = names }

  setPlayersColos(colors) { this._PlayersColors = colors }

  setPlayersColosName(ColorsNames) { this._PlayerColorsName = ColorsNames }

  setGame(game) { this._game = game }

  setGameData(gamedata) { this._GameData = gamedata }

  start() {
    // safety
    //if (!this._game)     { alert("no gameMode set!"); return }
    //if (!this._GameData) { alert("no gameData set!"); return }
    //
    this._GameData.resetTime()
    //this._GameData.setEndGame(this.nextRound)
    const firstSize = this._PlayersNames.length
    let endSize = 1
    for (let size = firstSize; size / 2 >= 1; size /= 2) {
      endSize++
    }
    let pose = 0
    for (let index = 0; index < endSize - 1; index++) {
      this._tempList.push([pose, pose + 1])
      pose += 2
    }
    this._totalRound = endSize
    this._roundIndex = 0
    console.log(this._tempList)

    this.nextRound()
  }
  nextRound() {
    const name            = []
    const playercolor     = []
    const playercolorName = []
    for (let index = 0; index < 2; index++) {
      name.push(this._PlayersNames[this._tempList[this._roundIndex][index]])
      playercolor.push(this._PlayersColors[this._tempList[this._roundIndex][index]])
      playercolorName.push(this._PlayerColorsName[this._tempList[this._roundIndex][index]])
    }
    console.log(name)
    console.log(playercolor)
    console.log(playercolorName)
    this._GameData.setNames(name)
    this._GameData.setPlayerColors(playercolor)
    this._GameData.setPlayersColors(playercolorName)
    this._roundIndex++
    const ft =  this._game
    ft(this._GameData, this)
  }
  end() {

  }
}