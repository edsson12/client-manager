import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { ClientsModule } from './clients/clients.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [UserModule, ClientsModule, AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
