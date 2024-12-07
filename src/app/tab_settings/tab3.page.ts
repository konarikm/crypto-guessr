import { Component } from '@angular/core';

import { AppStorageService } from '../app-storage.service';
import { DIFFICULTY } from '../app.constants';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

  selectedDifficulty: string = 'medium'

  constructor(private appStorage: AppStorageService) {}

  ionViewDidLeave(){
    this.appStorage.set(DIFFICULTY, this.selectedDifficulty)
  }

}
