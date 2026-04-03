/**
 * Middleware de autenticación por token.
 * Verifica el header Authorization: Bearer <token>
 * Si TOKEN_SECRETO no está configurado, permite acceso libre (modo desarrollo).
 */
export const verificarToken = (req, res, next) => {
  const tokenSecreto = process.env.TOKEN_SECRETO;

  // Si no hay token configurado, permitir acceso (modo desarrollo)
  if (!tokenSecreto) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      estado: "ERROR",
      mensaje: "Token de autenticación requerido.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token !== tokenSecreto) {
    return res.status(403).json({
      estado: "ERROR",
      mensaje: "Token inválido.",
    });
  }

  next();
};
