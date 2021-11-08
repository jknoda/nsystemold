import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UsuarioComponent } from './Cadastros/usuario/usuario.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AlunoListaComponent } from './Cadastros/aluno/alunolista.component';
import { AlunoComponent } from './Cadastros/aluno/aluno.component';


const appRoutes: Routes = [
    
        {path: '', component: HomeComponent},
        {path: 'home', component: HomeComponent},
        {path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
        {path: 'alunolista', component: AlunoListaComponent, canActivate: [AuthGuard]},
        {path: 'aluno', component: AlunoComponent, canActivate: [AuthGuard]},
        {path: 'auth', component: AuthComponent},
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