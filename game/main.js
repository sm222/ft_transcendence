import { Draw } from './render.js'
import { initMenu } from './menu.js'
import { KeyBordinput } from './keybord.js'
import { GameData } from './gameSetting.js'
import { Tournament } from './tournament.js'
import { initGame } from './game.js'

import { initDevRoom } from './devRoom.js'

//https://youtu.be/sPereCgQnWQ?si=8OPsM8BTY7RlDg4E

// setup are made here

const gamedata       = new GameData
const TournamentData = new Tournament

//? _PlayerNames      =    ['mike' , 'bob'],
//? _PlayerColors     =    ['green', 'red'],
//? _PlayerColorsName =    ['pink' , 'lightseagreen'],
//? _EndCall          =    null, <-- end screen can be custom
//? _EndScore         =    [0,0,0,0],
//? _Times            =    [0, 0, 0],
//? _PlayersNumber    =    2

gamedata.setCallBack(initMenu)
//TournamentData.setGame(initGame)
TournamentData.setGame(initDevRoom)
TournamentData.setGameData(gamedata)
gamedata._keybordMode =  true
Draw()          //* init
KeyBordinput()  //> setup keybord


TournamentData.start()

{
    //initMenu()      //~ start the menu

}