import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {InputMaskModule} from 'primeng/inputmask';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FieldsetModule} from 'primeng/fieldset';
import {EditorModule} from 'primeng/editor';
import {PanelMenuModule} from 'primeng/panelmenu';
import {MenuItem} from 'primeng/api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { MenuModule } from './principal/menu/menu.module';
import { TopoModule } from './principal/topo/topo.module';

import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { UsuarioComponent } from './Cadastros/usuario/usuario.component';
import { TopoService } from './principal/topo/topo.service';
import { AlunoListaComponent } from './Cadastros/aluno/alunolista.component';
import { AlunoComponent } from './Cadastros/aluno/aluno.component';
import { DeniedComponent } from './principal/denied/denied.component';
import { AtividadeComponent } from './Cadastros/atividadelista/atividade.component';
import { AtividadeListaComponent } from './Cadastros/atividadelista/atividadelista.component';
import { TreinoComponent } from './Treinos/treino/treino.component';
import { TreinoListaComponent } from './Treinos/treino/treinolista.component';
import { TreinoatvComponent } from './Treinos/treinoatv/treinoatv.component';
import { TreinoatvlistaComponent } from './Treinos/treinoatv/treinoatvlista.component';
import { AnamneseComponent } from './Cadastros/aluno/anamnese/anamnese.component';
 import { TreinoalulistaComponent } from './Treinos/treinoalu/treinoalulista.component';
import { TreinoaluComponent } from './Treinos/treinoalu/treinoalu.component';
import { UsuarioListaComponent } from './Cadastros/usuario/usuariolista.component';
import { TesteModule } from './teste/teste.module';
import { TestepdfComponent } from './testepdf/testepdf.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    UsuarioComponent,
    UsuarioListaComponent,
    AlunoComponent,
    AlunoListaComponent,
    AnamneseComponent,
    DeniedComponent,
    AtividadeListaComponent,
    AtividadeComponent,
    TreinoComponent,
    TreinoListaComponent,
    TreinoatvComponent,
    TreinoatvlistaComponent,
    TreinoaluComponent,
    TreinoalulistaComponent,
    TestepdfComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    BrowserAnimationsModule,
    InputMaskModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    ToolbarModule,
    CalendarModule,
    InputTextareaModule,
    InputSwitchModule,
    FieldsetModule,
    EditorModule,
    MenuModule,    
    TopoModule,
    PanelMenuModule,
    TesteModule
  ],
  providers: [    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    TopoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

const firebase = {
  apiKey: "AIzaSyDfHXtFhUHbY4yqDgLhT8fklAZKbLkfePg",
  authDomain: "authentication-cff69.firebaseapp.com",
  databaseURL: "https://authentication-cff69-default-rtdb.firebaseio.com",
  projectId: "authentication-cff69",
  storageBucket: "authentication-cff69.appspot.com",
  messagingSenderId: "146817382520",
  appId: "1:146817382520:web:5e9af5d1c75862e8cb558d",
  measurementId: "G-WSLWFXPMV8"
}
