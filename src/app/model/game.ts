export class Game {
  score: number;
  date: Date;

  constructor(score: number, date: Date = new Date()) {
    this.score = score;
    this.date = date;
  }
}
