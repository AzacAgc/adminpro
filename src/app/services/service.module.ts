import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsService, SidebarService, SharedService } from '../services/service.index';

@NgModule({
  imports: [CommonModule],
  providers: [SettingsService, SidebarService, SharedService],
  declarations: []
})
export class ServiceModule {}
