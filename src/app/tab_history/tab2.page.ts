import { Component } from '@angular/core';
import { Share } from '@capacitor/share';
import { AppStorageService } from '../app-storage.service';
import { GAME_HISTORY, SORT_BY_SCORE } from '../app.constants';
import { Game } from '../model/game';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  gamesArray: Game[] = []
  arrayEmpty: boolean = true;
  sortByScore: boolean = false;

  constructor(private appStorage: AppStorageService) {}

  async ionViewDidEnter () {
    const data = await this.appStorage.get(GAME_HISTORY)
    if (data) {
      this.gamesArray = data
    }

    const data2 = await this.appStorage.get(SORT_BY_SCORE)
    this.sortByScore = data2

    this.arrayEmpty = (this.gamesArray.length == 0 ? true : false)
  }

  deleteGame(game: Game){
    const index = this.gamesArray.indexOf(game)

    if(index > -1) {
      this.gamesArray.splice(index, 1)
      this.appStorage.set(GAME_HISTORY, this.gamesArray)

      if(this.gamesArray.length == 0){
        this.arrayEmpty = true;
      }
    }
  }

  async shareGame(game: Game) {
    await Share.share({
        title: 'Check out my CryptoGuessr score!',
        text: `Just got a score of ${game.score} in CryptoGuessr. Not bad, huh?`,
        dialogTitle: 'Share this!'
    });
  }
}
