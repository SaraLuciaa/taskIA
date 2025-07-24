import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data?.user) throw new UnauthorizedException('Invalid token');

    request.user = data.user;
    return true;
  }
} 