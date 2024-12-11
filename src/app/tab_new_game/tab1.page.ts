import { Component } from "@angular/core";
import { cryptoData } from "../cryptodata/crypto-data";
import { AppStorageService } from "../app-storage.service";
import { DIFFICULTY, GAME_HISTORY, HIGH_SCORE } from "../app.constants";
import { ToastController } from "@ionic/angular";
import { Share } from "@capacitor/share";
import { Game } from "../model/game";
import { CryptoService } from "../api/crypto.service";
import { CryptoResponse } from "../model/crypto_response";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  selectGame: boolean = false;
  startGame: boolean = false;
  showButtons: boolean = false;
  showCrypto: boolean = false;
  correctAnswer: boolean = false;
  gameOver: boolean = false;
  newBestScore: boolean = false;

  cryptoId: string = "";
  filteredCryptos: string[] = [];
  usedCryptos: string[] = []; // Track used cryptocurrencies

  // API RESPONSE
  cryptoResponse?: CryptoResponse;
  cryptoSymbol: string | null = null;
  realPrice: number = 0;

  displayedPrice: number = 0;
  score: number = 0;

  // PERSISTENT MEMORY
  gamesArray: Game[] = [];
  bestScore: number = 0;
  difficulty: string = "medium";

  constructor(
    private appStorage: AppStorageService,
    private toastController: ToastController,
    private cryptoService: CryptoService,
  ) {}

  filterSuggestions(event: any) {
    const query = event.target.value.toLowerCase();

    if (query.length > 0) {
      this.filteredCryptos = cryptoData.filter(
        (crypto) =>
          crypto.toLowerCase().startsWith(query) &&
          !this.usedCryptos.includes(crypto), // Exclude already used cryptos
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
    this.cryptoId = "";
    this.score = 0;

    this.startGame = true;
    this.selectGame = true;

    this.gameOver = false;
    this.showButtons = false;
    this.showCrypto = false;
    this.newBestScore = false;
  }

  nextCrypto() {
    this.cryptoId = "";

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

    // Load existing games from storage to avoid overwriting
    const savedGames = (await this.appStorage.get(GAME_HISTORY)) || [];
    this.gamesArray = savedGames;

    this.gamesArray.unshift(game); // Add the new game
    this.appStorage.set(GAME_HISTORY, this.gamesArray); // Save the updated array

    this.gameOver = false;
    this.startGame = false;
    this.correctAnswer = false;

    const toast = await this.toastController.create({
      message: "Game saved successfully!",
      duration: 3000,
      position: "bottom",
      color: "success",
    });

    await toast.present();
  }

  async shareGame() {
    await Share.share({
      title: "Check out my CryptoGuessr score!",
      text: `Just got a score of ${this.score} in CryptoGuessr. Not bad, huh?`,
      dialogTitle: "Share this!",
    });
  }

  async selectCrypto(random: boolean) {
    if (random) {
      const randomIndex = Math.floor(Math.random() * cryptoData.length);
      this.cryptoId = cryptoData[randomIndex];
    }

    if (this.cryptoId == "") {
      const toast = await this.toastController.create({
        message: "Please enter a cryptocurrency ID!",
        duration: 2000,
        position: "bottom",
        color: "danger",
      });

      await toast.present();
      return;
    }

    if (!cryptoData.includes(this.cryptoId)) {
      this.cryptoId = "";
      const toast = await this.toastController.create({
        message: "Cryptocurrency not found! Please try a different one.",
        duration: 2000,
        position: "bottom",
        color: "danger",
      });

      await toast.present();
      return;
    }

    if (this.usedCryptos.includes(this.cryptoId)) {
      this.cryptoId = "";
      const toast = await this.toastController.create({
        message: "You can´t guess the same crypto multiple times!",
        duration: 2000,
        position: "bottom",
        color: "danger",
      });

      await toast.present();
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
        switch (this.difficulty) {
          case "medium":
            percentage = 20;
            break;

          case "hard":
            percentage = 15;
            break;

          case "insane":
            percentage = 10;
            break;

          default:
            percentage = 20;
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

    // Add crypto to used, so user can´t use it again in the same game
    if (!this.usedCryptos.includes(this.cryptoId)) {
      this.usedCryptos.push(this.cryptoId);
    }

    this.selectGame = false;
    this.showButtons = true;
    this.showCrypto = true;
  }

  isMore() {
    if (this.realPrice >= this.displayedPrice) {
      this.correctAnswer = true;
      this.score++;
    } else {
      // GAME OVER
      this.gameOver = true;

      // Reset used cryptos
      this.usedCryptos = [];

      //CHECK IF SCORE IS NEW BEST
      if (this.score > this.bestScore) {
        this.appStorage.set(HIGH_SCORE, this.score);
        this.bestScore = this.score;
        this.newBestScore = true;
      }
    }
  }

  isLess() {
    if (this.realPrice <= this.displayedPrice) {
      this.correctAnswer = true;
      this.score++;
    } else {
      // GAME OVER
      this.gameOver = true;

      // Reset used cryptos
      this.usedCryptos = [];

      // CHECK IF SCORE IS NEW BEST
      if (this.score > this.bestScore) {
        this.appStorage.set(HIGH_SCORE, this.score);
        this.bestScore = this.score;
        this.newBestScore = true;
      }
    }
  }

  async ionViewDidEnter() {
    try {
      const [highScore, difficulty, savedGames] = await Promise.all([
        this.appStorage.get(HIGH_SCORE),
        this.appStorage.get(DIFFICULTY),
        this.appStorage.get(GAME_HISTORY),
      ]);

      this.bestScore = highScore || 0;
      this.difficulty = difficulty || "medium";
      this.gamesArray = savedGames || [];
    } catch (error) {
      console.error("Error loading data from storage:", error);
    }
  }
}
