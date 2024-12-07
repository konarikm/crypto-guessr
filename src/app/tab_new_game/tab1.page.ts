import { Component } from '@angular/core';
import { cryptoData } from '../cryptodata/crypto-data';
import { AppStorageService } from '../app-storage.service';
import { DIFFICULTY, GAME_HISTORY, HIGH_SCORE } from '../app.constants';
import { ToastController } from '@ionic/angular';
import { Game } from '../model/game';
import { CryptoService } from '../api/crypto.service';
import { CryptoResponse } from '../model/crypto_response';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  selectGame: boolean = false;
  startGame: boolean = false;
  showButtons: boolean = false;
  gameOver: boolean = false;
  correctAnswer: boolean = false;
  showCrypto: boolean = false;

  cryptoId: string = '';
  filteredCryptos: string[] = []

  // API RESPONSE
  cryptoResponse?: CryptoResponse;
  cryptoSymbol: string | null = null
  realPrice: number = 0;

  displayedPrice: number = 0;
  score: number = 0;
  
  // PERSISTENT MEMORY
  gamesArray: Game[] = []
  bestScore: number = 0;
  difficulty: string = 'medium'

  constructor(private appStorage: AppStorageService, private toastController: ToastController, private cryptoService: CryptoService) {}

  filterSuggestions(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length > 0) {
      this.filteredCryptos = cryptoData.filter((crypto) =>
        crypto.toLowerCase().startsWith(query)
      );
    } else {
      this.filteredCryptos = [];
    }
  }

  selectInputCrypto(crypto: string, inputField: any) {
    this.cryptoId = crypto; // Update the input field
    this.filteredCryptos = []; // Clear suggestions
    inputField.setBlur(); // Close the keyboard
  }

  startNewGame() {
    this.cryptoId = ''
    this.score = 0;

    this.startGame = true;
    this.selectGame = true;
    
    this.gameOver = false;
    this.showButtons = false;
    this.showCrypto = false;
  }

  nextCrypto() {
    this.cryptoId = ''

    this.selectGame = true;
    
    this.correctAnswer = false;
    this.showButtons = false;
    this.showCrypto = false;
  }

  backToMenu() {
    this.gameOver = false;
    this.startGame = false;
    this.correctAnswer = false;
  }

  async saveGame() {
    const game = new Game(this.score);
    this.gamesArray.unshift(game);
    this.appStorage.set(GAME_HISTORY, this.gamesArray)

    this.gameOver = false;
    this.startGame = false;
    this.correctAnswer = false;

    const toast = await this.toastController.create({
      message: 'Game saved successfully!',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }

  selectCrypto(random: boolean) {
    if(random){
      const randomIndex = Math.floor(Math.random() * cryptoData.length);
      this.cryptoId = cryptoData[randomIndex];
    }
    
    if(this.cryptoId == ''){
      return;
    }

    // API REQUEST
    this.cryptoService.getData(this.cryptoId).subscribe({
      next: (data) => {
        this.cryptoResponse = data;

        this.cryptoSymbol = this.cryptoResponse.data.symbol;

        // FOR SHOWCASE USE DEFAULT PRICE $1
        // this.realPrice = 1;
        this.realPrice = parseFloat(this.cryptoResponse.data.priceUsd);

        // Calculate displayed price (+- X% of realPrice)
        let percentage;
        switch (this.difficulty){
          case 'medium':
            percentage = 20;
            break;

          case 'hard':
            percentage = 15;
            break;

          case 'insane':
            percentage = 10;
            break;

          default:
            percentage = 20
        }


        const variationPercentage = Math.random() * percentage;
        const isIncrease = Math.random() > 0.5; // Randomly decide increase or decrease

        // Apply variation
        this.displayedPrice = isIncrease 
          ? this.realPrice * (1 + variationPercentage / 100) // Increase by percentage
          : this.realPrice * (1 - variationPercentage / 100); // Decrease by percentage

        // More decimals for small prices
        const decimals = this.realPrice < 1 ? 10 : 3;
        this.realPrice = parseFloat(this.realPrice.toFixed(decimals));
        this.displayedPrice = parseFloat(this.displayedPrice.toFixed(decimals));
      },
    });

    this.selectGame = false;
    this.showButtons = true;
    this.showCrypto = true;
  }

  isMore() {
    if(this.realPrice >= this.displayedPrice){
      this.correctAnswer = true;
      this.score++;      
    }
    else{
      // GAME OVER
      this.gameOver = true;

      //CHECK IF SCORE IS NEW BEST
      if(this.score > this.bestScore){
        this.appStorage.set(HIGH_SCORE, this.score);
        this.bestScore = this.score;
      }
    }
  }

  isLess() {
    if(this.realPrice <= this.displayedPrice){
      this.correctAnswer = true;
      this.score++
    }
    else{
      // GAME OVER
      this.gameOver = true;

      // CHECK IF SCORE IS NEW BEST
      if(this.score > this.bestScore){
        this.appStorage.set(HIGH_SCORE, this.score);
        this.bestScore = this.score;
      }
    }
  }

  async ionViewDidEnter () {
    const highScore = await this.appStorage.get(HIGH_SCORE)
    const difficulty = await this.appStorage.get(DIFFICULTY)

    if(difficulty){
      this.difficulty = difficulty;
    }

    if (highScore) {
      this.bestScore = highScore;
    }
  }
}
