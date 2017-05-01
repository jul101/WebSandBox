import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ButtonsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ColContainerComponent } from './utils/col-container/col-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ColContainerComponent
  ],
  imports: [
    BrowserModule,
    ButtonsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
