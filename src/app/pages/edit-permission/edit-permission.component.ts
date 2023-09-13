import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {
  taskData: any = [
    {
      name: 'Indeterminate',
      completed: false,
      color: 'primary',
      subtasks: [
        {name: 'Primary', completed: false, color: 'primary'},
        {name: 'Accent', completed: false, color: 'accent'},
        {name: 'Warn', completed: false, color: 'warn'},
      ],
    },
    {
      name: 'Indeterminate',
      completed: false,
      color: 'primary',
      subtasks: [
        {name: 'Primary', completed: false, color: 'primary'},
        {name: 'Accent', completed: false, color: 'accent'},
        {name: 'Warn', completed: false, color: 'warn'},
      ],
    },
    {
      name: 'Indeterminate',
      completed: false,
      color: 'primary',
      subtasks: [
        {name: 'Primary', completed: false, color: 'primary'},
        {name: 'Accent', completed: false, color: 'accent'},
        {name: 'Warn', completed: false, color: 'warn'},
      ],
    }
  ]
  
  taskForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: [this.taskData.name],
      color: [this.taskData.color],
      subtasks: this.fb.array([])
    });
    const subtasksArray = this.taskForm.get('subtasks') as FormArray;
    this.taskData.subtasks.forEach(subtask => {
      const subtaskGroup = this.fb.group({
        name: [subtask.name],
        color: [subtask.color],
        completed: [subtask.completed]
      });
      subtasksArray.push(subtaskGroup);
    });
    
  }

  get refForm() {
    return this.taskForm.get('subtasks') as FormArray;
                                    
  }

}
