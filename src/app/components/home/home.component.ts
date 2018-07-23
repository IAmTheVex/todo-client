import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { ApiService } from '../../providers/api.service';
import { Stats } from '../../types/entities/Stats';
import { Task } from '../../types/entities/Task';
import { text } from '../../../../node_modules/@angular/core/src/render3/instructions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }

  stats = new Stats(0, 0);

  today;
  tasks: Task[] = []

  async ngOnInit() {
    console.log("ngOnInit");
    this.today = moment().format("dddd, Do of MMMM YYYY");
    try {
      let current = await this.api.current();
      this.stats = current.me.stats;
      this.tasks = current.me.tasks;
      console.log(current);
    } catch (ex) {
      console.error(ex);
    }
  }

  async addNewTask() {
    console.log("addNewTask");

    try {
      this.tasks.push(await this.api.newTask("New task!"));
      this.stats.total++;
      this.stats.remaining++;
    } catch (ex) {
      console.error(ex);
    }
  }

  async deleteTask(index) {
    let { id, state } = <any>this.tasks[index];
    console.log("deleteTask", id, state);

    try {
      await this.api.removeTask(id);
      if (state == true) this.stats.done--;
      else this.stats.remaining--;

      this.stats.total--;
      this.tasks.splice(index, 1);
    } catch (ex) {
      console.error(ex);
    }
  }

  async taskUpdate(index: string) {
    let { id, state } = this.tasks[index];
    console.log("taskUpdate", id, state);

    try {
      await this.api.mark(id, !state);
      if (state == false) {
        this.stats.done++;
        this.stats.remaining--;
      } else {
        this.stats.done--;
        this.stats.remaining++;
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  async taskOnBlur(id, name) {
    console.log("taskOnBlur", id, name);

    try {
      await this.api.editTask(id, name);
    } catch (ex) {
      console.error(ex);
    }
  }

}
