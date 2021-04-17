import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mapas',
    pathMatch: 'full'
  },
  {
    path: 'mapas',
    loadChildren: () => import('./mapas/mapas.module').then(m => m.MapasModule)
  },
  {
    path: '**',
    redirectTo: 'mapas',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
