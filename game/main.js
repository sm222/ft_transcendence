import { Draw } from './render.js'
import { initMenu } from './menu.js'
import { KeyBordinput } from './keybord.js'
import { GameData } from './gameSetting.js'

//https://youtu.be/sPereCgQnWQ?si=8OPsM8BTY7RlDg4E


export const gamedata = new GameData

Draw()          //* init
KeyBordinput()  //> setup keybord
initMenu()      //~ start the menu

