import { Component, OnInit,Input } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-col-container',
  templateUrl: './col-container.component.html',
  styleUrls: ['./col-container.component.css']
})
export class ColContainerComponent implements OnInit {

  @Input() fieldName:string;
  @Input() fieldValue:string;
  // @Input() disabled:boolean;
  @Input() editable:boolean;
  @Input() control:FormControl;
  @Input() name:string;
  @Input() label:string;
  @Input() type:string;
  @Input() items:Array<any>;

  constructor() { }

  ngOnInit() {
    if(this.control){
      this.fieldValue=this.control.value;
    }else{
      this.control = new FormControl('');
    }
    console.log('control',this.control);
    console.log('name',this.name);
    console.log('editable',this.editable);
  }

}
