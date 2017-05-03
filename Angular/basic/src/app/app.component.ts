import { Component,OnInit  } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HeroService]
})
export class AppComponent implements OnInit {
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

  constructor(private builder: FormBuilder,private heroService: HeroService){
    // this.myForm.getRawValue();
  }

  ngOnInit(): void {
    this.getHeroes();
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

  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  heroes: Hero[];
  selectedHero: Hero;

  onSelectHero(hero:Hero){
    this.selectedHero = hero;
  }

  getHeroes(): void {
    // this.heroes = this.heroService.getHeroes();
    // this.heroService.getHeroes().then(heroes => this.heroes = heroes);
    this.heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);
  }
  

}
