import { Component } from "@angular/core";

import { AppStorageService } from "../app-storage.service";
import { DIFFICULTY, SORT_BY_SCORE } from "../app.constants";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  selectedDifficulty: string = "medium";
  sortByScore: boolean = false;

  constructor(private appStorage: AppStorageService) {}

  ionViewDidLeave() {
    this.appStorage.set(DIFFICULTY, this.selectedDifficulty);
    this.appStorage.set(SORT_BY_SCORE, this.sortByScore);
  }
}
