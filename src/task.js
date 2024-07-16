import { v4 as uuidv4 } from 'uuid';

export class Task {

  constructor(title, 
              description, 
              dueDate, 
              priority, 
              notes,
              UUID) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.complete = false;
    if (UUID != null) {
      this.UUID = UUID;
    } else {
      this.UUID = uuidv4();
    }
  }

}