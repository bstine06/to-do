import { v4 as uuidv4 } from 'uuid';

export class Project {

  constructor(title,
              UUID,
              tasks) {
    this.title = title;
    if (tasks != null) {
      this.tasks = tasks;
    } else {
      this.tasks = [];
    }
    if (UUID != null) {
      this.UUID = UUID;
    } else {
      this.UUID = uuidv4();
    }
  }


}