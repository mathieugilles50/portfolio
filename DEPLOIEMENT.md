# Déploiement : GitHub → Cloudflare Pages → domaine .fr

Durée totale : environ 30 minutes, plus le délai de propagation DNS (de quelques minutes à quelques heures).

## 1. Le code sur GitHub

1. Créez un dépôt **vide** sur GitHub (par exemple `portfolio`), sans README.
2. Depuis le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Portfolio : première version"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/portfolio.git
   git push -u origin main
   ```

## 2. Le site sur Cloudflare Pages

1. Créez un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Workers & Pages → Create → Pages → Connect to Git**, autorisez GitHub et choisissez le dépôt.
3. Réglages de build :
   | Champ | Valeur |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | (vide) |
4. **Environment variables** (Production) :
   | Nom | Valeur |
   |---|---|
   | `NODE_VERSION` | `22` |
   | `SITE_URL` | `https://www.votre-domaine.fr` |
5. **Save and Deploy.** Le site est en ligne sur `https://portfolio-xxx.pages.dev`.

À chaque `git push` sur `main`, Cloudflare reconstruit et republie le site. Chaque autre branche obtient une adresse de prévisualisation.

Le dossier `functions/` est détecté automatiquement : il fournit l'adresse `/api/contact` utilisée par le formulaire.

## 3. Le formulaire de contact (envoi des emails)

Le formulaire passe par [Resend](https://resend.com) (gratuit jusqu'à 3 000 emails par mois).

1. Créez un compte Resend, puis **Domains → Add domain** avec votre domaine `.fr`. Resend affiche 3 ou 4 enregistrements DNS (SPF, DKIM) : ajoutez-les dans Cloudflare (**DNS → Records**), une fois le domaine géré par Cloudflare (étape 4).
2. **API Keys → Create API key** (permission « Sending access »).
3. Dans Cloudflare Pages → votre projet → **Settings → Variables and Secrets**, ajoutez :
   | Nom | Type | Valeur |
   |---|---|---|
   | `RESEND_API_KEY` | Secret | la clé Resend |
   | `CONTACT_TO_EMAIL` | Texte | `mathieu.gilles50@gmail.com` |
   | `CONTACT_FROM_EMAIL` | Texte | `Portfolio <contact@votre-domaine.fr>` |
4. Redéployez (**Deployments → … → Retry deployment**).

Tant que ces variables manquent, le formulaire affiche un message invitant à écrire directement par email : rien n'est perdu.

**Anti-spam (facultatif).** Un champ piège invisible bloque déjà les robots simples. Pour plus de protection, activez Cloudflare Turnstile : **Turnstile → Add widget** avec votre domaine, puis ajoutez `PUBLIC_TURNSTILE_SITE_KEY` (clé du site, variable de build) et `TURNSTILE_SECRET_KEY` (clé secrète, secret), et redéployez.

## 4. Le nom de domaine .fr

### Acheter le domaine
Chez un registraire français (OVHcloud, Gandi, Infomaniak…) ou directement chez Cloudflare Registrar (prix coûtant, mais vérifiez qu'il accepte le `.fr` au moment de l'achat). Comptez 7 à 15 € par an.

### Option recommandée : confier le DNS à Cloudflare
1. Cloudflare → **Add a domain** → saisissez `votre-domaine.fr` → offre Free.
2. Cloudflare donne deux serveurs de noms (ex. `ana.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
3. Chez votre registraire, remplacez les serveurs DNS du domaine par ces deux-là (chez OVHcloud : **Domaines → votre domaine → Serveurs DNS → Modifier**).
4. Attendez l'email « votre domaine est actif sur Cloudflare » (de quelques minutes à 24 h).
5. Pages → votre projet → **Custom domains → Set up a custom domain** : ajoutez `www.votre-domaine.fr`, puis `votre-domaine.fr`. Cloudflare crée les enregistrements DNS tout seul.

### Option sans changer de DNS
Chez votre registraire, ajoutez un enregistrement :
| Type | Nom | Valeur |
|---|---|---|
| CNAME | `www` | `portfolio-xxx.pages.dev` |

puis déclarez `www.votre-domaine.fr` dans **Custom domains**. Le domaine nu (`votre-domaine.fr` sans www) ne peut pas pointer vers Pages sans DNS Cloudflare : configurez chez le registraire une redirection web vers `https://www.votre-domaine.fr`.

### Rediriger vers une seule adresse
Avec le DNS chez Cloudflare : **Rules → Redirect Rules → Create rule → modèle « Redirect from root to WWW »**. Ainsi `votre-domaine.fr` redirige vers `https://www.votre-domaine.fr`.

### HTTPS
Le certificat est automatique et gratuit. Dans **SSL/TLS → Edge Certificates**, activez **Always Use HTTPS**.

## 5. Après la mise en ligne

1. Vérifiez que `SITE_URL` contient bien l'adresse finale (elle sert au sitemap, aux balises de partage et au `robots.txt`), puis redéployez si vous l'avez changée.
2. [Google Search Console](https://search.google.com/search-console) : ajoutez le domaine et soumettez `https://www.votre-domaine.fr/sitemap-index.xml`.
3. Testez l'aperçu de partage avec le [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
4. Envoyez-vous un message via le formulaire.
