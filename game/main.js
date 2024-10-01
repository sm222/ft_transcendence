import { Draw } from './render.js'
import { initMenu } from './menu.js'
import { KeyBordinput } from './keybord.js'
import { GameData } from './gameSetting.js'
import { Tournament } from './tournament.js'
import { initGame } from './game.js'

//https://youtu.be/sPereCgQnWQ?si=8OPsM8BTY7RlDg4E

// setup are made here

//sessionStorage.setItem("gameData", gamedata);
//sessionStorage.setItem("TournamentData", TournamentData);
//gamedata = sessionStorage.getItem("gameData")
//TournamentData = sessionStorage.getItem("TournamentData")

//localStorage['game'] = JSON.stringify(new GameData);
//localStorage['tour'] = JSON.stringify(new Tournament);
//let  a = localStorage['game'];
//let  b = localStorage['tour'];
//=  JSON.parse(a)

const gamedata       = new GameData
const TournamentData = new Tournament

//=  JSON.parse(b)
// default value
//? _PlayerNames      =    ['mike' , 'bob'],
//? _PlayerColors     =    ['green', 'red'],
//? _PlayerColorsName =    ['pink' , 'lightseagreen'],
//? _EndCall          =    null, <-- end screen can be custom
//? _EndScore         =    [0,0,0,0],
//? _Times            =    [0, 0, 0],
//? _PlayersNumber    =    2

gamedata.setCallBack(initMenu)
TournamentData.setGame(initGame)
TournamentData.setGameData(gamedata)
Draw()          //* init
KeyBordinput()  //> setup keybord


TournamentData.start()

{
    //initMenu()      //~ start the menu

}