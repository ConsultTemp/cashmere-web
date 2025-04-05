// Rimuoviamo completamente il middleware per evitare reindirizzamenti automatici
// Gestiremo l'autenticazione solo nei layout

export function middleware() {
  // Non facciamo nulla qui, lasciamo che siano i layout a gestire l'autenticazione
  return Response.next()
}

export const config = {
  matcher: [], // Non facciamo match su nessuna route
}

