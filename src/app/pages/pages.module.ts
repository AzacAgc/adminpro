import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Modulos
import { SharedModule } from '../shared/shared.module';
// Rutas
import { PAGES_ROUTES } from './pages.routes';
// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
// ng2-charts
import { ChartsModule } from 'ng2-charts';
// Temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        RxjsComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        FormsModule,
        SharedModule,
        PAGES_ROUTES,
        ChartsModule
    ]
})
export class PagesModule { }
