import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthGuard } from './guards/auth.guard';
import { AskQuestionComponent } from './components/ask-question/ask-question.component';
import { SearchComponent } from './components/search/search.component';
import { ViewQuestionsComponent } from './components/view-questions/view-questions.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';

export const routes: Routes = [
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomepageComponent,canActivate:[AuthGuard]},
    {path:'ask-question',component:AskQuestionComponent,canActivate:[AuthGuard]},
    {path:'search',component:SearchComponent},
    {path:'view-questions',component:ViewQuestionsComponent},
    // {path:'view-details',component:ViewDetailsComponent},
    { path: 'view-details/:id', component: ViewDetailsComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
