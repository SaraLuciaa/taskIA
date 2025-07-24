import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

function isValidEmail(email: string): boolean {
  // Validación básica de email
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(email: string, password: string) {
    if (!isValidEmail(email)) {
      throw new BadRequestException('El correo electrónico no es válido.');
    }
    if (!isStrongPassword(password)) {
      throw new BadRequestException('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
    }
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });
    console.log('Supabase signUp response:', { data, error });
    // Manejar caso donde Supabase no retorna error pero el usuario ya existe
    if (!error && data && data.user && data.session === null && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new ConflictException('El correo electrónico ya está registrado y pendiente de confirmación. Revisa tu correo.');
    }
    if (error) {
      if (
        error.message &&
        (error.message.toLowerCase().includes('already registered') ||
         error.message.toLowerCase().includes('user already registered') ||
         error.status === 400)
      ) {
        throw new ConflictException('El correo electrónico ya está registrado.');
      }
      throw new BadRequestException(error.message);
    }
    // Respuesta restringida para registro
    return {
      message: 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.',
      email: data.user?.email,
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
        throw new BadRequestException('El correo o la contraseña son incorrectos.');
      }
      if (msg.includes('user not found')) {
        throw new BadRequestException('No se puede iniciar sesión porque el usuario no está registrado.');
      }
      if (msg.includes('email not confirmed') || msg.includes('email not confirmed')) {
        throw new BadRequestException('No se puede iniciar sesión porque el correo no ha sido confirmado. Revisa tu bandeja de entrada.');
      }
      throw new BadRequestException(error.message);
    }
    // Respuesta restringida para login
    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    };
  }
} 