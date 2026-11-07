/**
 * FEREST: Configuración central de la tienda.
 *
 * IMPORTANTE: Esta es la ÚNICA fuente de verdad para el correo del administrador.
 * Si tu correo de admin es distinto, cámbialo AQUÍ y se aplicará en
 * AuthContext, Login y el panel Admin.
 */
export const ADMIN_EMAIL = 'leninzumaran0@gmail.com';

export const ADMIN_EMAILS: string[] = [ADMIN_EMAIL];

export const isAdminEmail = (email?: string | null) =>
    !!email && ADMIN_EMAILS.includes(email);

/** Umbral de monto (S/) a partir del cual el envío es gratis. */
export const FREE_DELIVERY_THRESHOLD = 100;

/** Costo por kilómetro de envío. */
export const DELIVERY_COST_PER_KM = 2;
