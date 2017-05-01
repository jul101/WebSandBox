import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  inputMsg:string = '';
  fieldName:string='name';
  fieldTitle:string="姓名";

  fieldValue:string='Johnson';

  disabled:boolean=false;

  clearMsg(event){
    this.inputMsg='';
  }

  toggleEditable(){
    this.disabled=!this.disabled;
  }

  constructor(private builder: FormBuilder){
    // this.myForm.getRawValue();
  }

  custName:string='Rock';
  region:string='USA';
  gender:string='1';

  myForm: FormGroup = this.builder.group({
    custName: [this.custName,[Validators.required]],
    region: this.region,
    gender: this.gender,
  });

  genderList:Array<any>=[
    {id:"1",label:'Male'},
    {id:"2",label:'Female'},
    {id:"0",label:'Half'},
  ];
  

}
