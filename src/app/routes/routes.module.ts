import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
// dashboard pages
import { UserComponent } from './user/user.component';
// single pages
import { CallbackComponent } from './passport/callback.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { RouteRoutingModule } from './routes-routing.module';
import { AuthComponent } from './auth/auth.component';

const COMPONENTS: Type<void>[] = [
  UserComponent,
  // passport pages
  UserLoginComponent,
  // single pages
  CallbackComponent,
  AuthComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
})
export class RoutesModule { }
