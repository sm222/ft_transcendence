import { Draw } from './render.js'
import { initMenu } from './menu.js'
import { KeyBordinput } from './keybord.js'
import { GameData } from './gameSetting.js'

//https://youtu.be/sPereCgQnWQ?si=8OPsM8BTY7RlDg4E

// setup are made here
export const gamedata = new GameData
// default value
//? _PlayerNames      =    ['mike' , 'bob'],
//? _PlayerColors     =    ['green', 'red'],
//? _PlayerColorsName =    ['pink' , 'lightseagreen'],
//? _EndCall          =    null, <-- end screen can be custom
//? _EndScore         =    [0,0,0,0],
//? _Times            =    [0, 0, 0],
//? _PlayersNumber    =    2


Draw()          //* init
KeyBordinput()  //> setup keybord
initMenu()      //~ start the menu
