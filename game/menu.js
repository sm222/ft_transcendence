import * as THREE from 'three'

import { GameData } from './gameSetting.js'
import { Tournament } from './tournament.js'


const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament


export async function initMenu(gameData, TournamentData) {
  newGamedata.copy(gameData)
  newTrounemanData.copy(TournamentData)
  MainMenu()
}

async function LeaveMenu() {

}

async function MainMenu() {
  if (newTrounemanData._roundIndex < newTrounemanData._totalRound - 1) {
    newTrounemanData.nextRound()
  }
  else {
    if (newTrounemanData._roundWiner.length > 1) {
      const name        = []
      const color       = []
      const playerColor = []
      for (let index = 0; index < newTrounemanData._roundWiner.length; index++) {
        const element = newTrounemanData._roundWiner[index]
        name.push(element[0])
        color.push(element[1])
        playerColor.push(element[2])
      }
      newTrounemanData._roundWiner = []
      newTrounemanData.setPlayersNames(name)
      newTrounemanData.setPlayersColos(color)
      newTrounemanData.setPlayersColosName(playerColor)
      newTrounemanData.start()
      console.log("new round")

    }
    else
      console.log("endgame")
  }
}

/*
[
  [0] "mike",
  [1] "green", paddle color // 
  [2] "lightseagreen" // name color
]
*/