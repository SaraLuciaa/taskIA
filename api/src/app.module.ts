import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/controllers/auth.controller';
import { AuthService } from './modules/auth/services/auth.service';
import { SupabaseService } from './modules/auth/services/supabase.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, SupabaseService],
})
export class AppModule {}
