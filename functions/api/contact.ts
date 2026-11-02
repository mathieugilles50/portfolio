/**
 * Cloudflare Pages Function : POST /api/contact
 * Reçoit le formulaire de contact et l'envoie par e-mail via l'API Resend.
 *
 * Variables à définir dans Cloudflare Pages (voir DEPLOIEMENT.md) :
 *   RESEND_API_KEY        clé API Resend (secret)
 *   CONTACT_TO_EMAIL      adresse qui reçoit les messages
 *   CONTACT_FROM_EMAIL    expéditeur vérifié chez Resend, ex. "Portfolio <contact@mathieu-gilles.fr>"
 *   TURNSTILE_SECRET_KEY  (facultatif) clé secrète Cloudflare Turnstile
 */
interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max);
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Requête invalide.' }, 400);
  }

  // Pot de miel anti-robots : ce champ invisible doit rester vide.
  if (clean(form.get('website'), 200)) return json({ ok: true });

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const subject = clean(form.get('subject'), 60) || 'Message';
  const message = clean(form.get('message'), 5000);

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 10) {
    return json({ ok: false, error: 'Vérifiez le nom, l’adresse e-mail et le message.' }, 422);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(form.get('cf-turnstile-response'), 2048);
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') ?? '' }),
    }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
    if (!check.success) return json({ ok: false, error: 'La vérification anti-spam a échoué. Réessayez.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ ok: false, error: 'L’envoi n’est pas encore configuré.' }, 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[Portfolio] ${subject} — ${name}`,
      text: `Nom : ${name}\nE-mail : ${email}\nObjet : ${subject}\n\n${message}`,
      html: `<p><strong>Nom :</strong> ${escapeHtml(name)}<br><strong>E-mail :</strong> ${escapeHtml(email)}<br><strong>Objet :</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    }),
  });

  if (!res.ok) return json({ ok: false, error: 'L’envoi a échoué. Écrivez-moi directement par e-mail.' }, 502);
  return json({ ok: true });
};
