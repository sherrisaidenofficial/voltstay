export type FieldErrors = Record<string, string>;

export type Result<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const fail = <T = never>(errors: FieldErrors): Result<T> => ({ ok: false, errors });
