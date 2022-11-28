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
import { TesteComponent } from './teste/teste.component';
import { TreinoscalendarioComponent } from './Participe/treinoscalendario/treinoscalendario.component';
import { SugestoesComponent } from './Participe/sugestoes/sugestoes.component';
import { treinoviacalenComponent } from './Treinos/treinoviacalendario/treinoviacalen.component';
import { NoticiaslistaComponent } from './Noticias/noticiaslista.component';
import { NoticiasComponent } from './Noticias/noticias.component';
import { AlterComponent } from './principal/alter/alter.component';
import { CheckinComponent } from './principal/checkin/checkin.component';
import { ResponsaveisComponent } from './Cadastros/aluno/responsaveis/responsaveis.component';
import { QuizlistaComponent } from './Participe/quizresp/quiz/quizlista.component';
import { QuizrespComponent } from './Participe/quizresp/quiz/quizresp.component';
import { QuestoeslistaComponent } from './Cadastros/questoes/questoeslista.component';
import { QuestoesComponent } from './Cadastros/questoes/questoes.component';
import { QuizalterlistaComponent } from './Cadastros/questoes/quizalternativas/quizalterlista.component';
import { QuizalternativasComponent } from './Cadastros/questoes/quizalternativas/quizalternativas.component';
import { MantercardlistaComponent } from './JudoCardGame/mantercard/mantercardlista.component';
import { MantercardComponent } from './JudoCardGame/mantercard/mantercard.component';
import { CardgameComponent } from './JudoCardGame/cardgame/cardgame.component';
import { QuizinitComponent } from './Participe/quizresp/quizinit.component';
import { QuizresplistComponent } from './Diversos/quizresplist/quizresplist.component';
import { JudolistaComponent } from './Cadastros/aluno/judo/judolista.component';
import { JudoComponent } from './Cadastros/aluno/judo/judo.component';
import { PlacarComponent } from './Diversos/placar/placar.component';
import { RespcardComponent } from './JudoCardGame/respcard/respcard.component';
import { RespcardlistaComponent } from './JudoCardGame/respcard/respcardlista.component';
import { TabimagensComponent } from './Cadastros/tabimagens/tabimagens.component';
import { TabimagenslistaComponent } from './Cadastros/tabimagens/tabimagenslista.component';
import { SugestoesinitComponent } from './Participe/sugestoes/sugestoesinit.component';
import { Quiz2listaComponent } from './Participe/quizresp/quiz2/quiz2lista.component';
import { Quiz2respComponent } from './Participe/quizresp/quiz2/quiz2resp.component';
//import { TestepdfComponent } from './testepdf/testepdf.component';
// import { TreinoaluComponent } from './Treinos/treinoalu/treinoalu.component';


const appRoutes: Routes = [
    
        {path: '', component: HomeComponent},
        {path: 'home', component: HomeComponent},
        {path: 'usuariolista', component: UsuarioListaComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
        //{path: 'alunolista', component: AlunoListaComponent, canActivate: [AuthGuard], data: {roles:['ADM']}},
        {path: 'alunolista', component: AlunoListaComponent, canActivate: [AuthGuard]},
        {path: 'aluno', component: AlunoComponent, canActivate: [AuthGuard], data: {roles:['USU']}},
        {path: 'anamnese', component: AnamneseComponent, canActivate: [AuthGuard], data: {roles:['USU']}},
        {path: 'responsaveis', component: ResponsaveisComponent, canActivate: [AuthGuard], data: {roles:['USU']}},
        {path: 'atividadelista', component: AtividadeListaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'atividade', component: AtividadeComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinolista', component: TreinoListaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoviacalen', component: treinoviacalenComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treino', component: TreinoComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoatvlista', component: TreinoatvlistaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoatv', component: TreinoatvComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoalulista', component: TreinoalulistaComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'treinoalu', component: TreinoaluComponent, canActivate: [AuthGuard], data: {roles:['TEC']}},
        {path: 'noticiaslista', component: NoticiaslistaComponent, canActivate: [AuthGuard]},
        {path: 'noticias', component: NoticiasComponent, canActivate: [AuthGuard]},
        {path: 'auth', component: AuthComponent},
        {path: 'denied', component: DeniedComponent},
        {path: 'alter', component: AlterComponent},
        {path: 'checkin', component: CheckinComponent},
        {path: 'treinoscalendario', component: TreinoscalendarioComponent},
        {path: 'sugestoes', component: SugestoesComponent},
        {path: 'sugestoesinit', component: SugestoesinitComponent},
        {path: 'quizlista', component: QuizlistaComponent},
        {path: 'quiz2lista', component: Quiz2listaComponent},
        {path: 'quizresp', component: QuizrespComponent},
        {path: 'quiz2resp', component: Quiz2respComponent},
        {path: 'quizinit', component: QuizinitComponent},        
        {path: 'questoeslista', component: QuestoeslistaComponent},
        {path: 'questoes', component: QuestoesComponent},
        {path: 'quizalterlista', component: QuizalterlistaComponent},
        {path: 'quizalter', component: QuizalternativasComponent},
        {path: 'mantercardlista', component: MantercardlistaComponent},
        {path: 'mantercard', component: MantercardComponent},
        {path: 'cardgame', component: CardgameComponent},
        {path: 'quizresplist', component: QuizresplistComponent},
        {path: 'judolista', component: JudolistaComponent},
        {path: 'judo', component: JudoComponent},
        {path: 'placar', component: PlacarComponent},
        {path: 'respcard', component: RespcardComponent},
        {path: 'respcardlista', component: RespcardlistaComponent},
        {path: 'tabimagens', component: TabimagensComponent},
        {path: 'tabimagenslista', component: TabimagenslistaComponent},

        {path: 'teste', component: TesteComponent},
        //{path: 'testepdf', component: TestepdfComponent},
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