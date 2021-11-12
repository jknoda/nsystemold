import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UsuarioComponent } from './Cadastros/usuario/usuario.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
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
// import { TreinoaluComponent } from './Treinos/treinoalu/treinoalu.component';


const appRoutes: Routes = [
    
        {path: '', component: HomeComponent},
        {path: 'home', component: HomeComponent},
        {path: 'usuariolista', component: UsuarioListaComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
        {path: 'alunolista', component: AlunoListaComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'aluno', component: AlunoComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'anamnese', component: AnamneseComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'atividadelista', component: AtividadeListaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'atividade', component: AtividadeComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinolista', component: TreinoListaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treino', component: TreinoComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoatvlista', component: TreinoatvlistaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoatv', component: TreinoatvComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoalulista', component: TreinoalulistaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoalu', component: TreinoaluComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'auth', component: AuthComponent},
        {path: 'denied', component: DeniedComponent},
        {path: '**', component: HomeComponent}
   
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{

}