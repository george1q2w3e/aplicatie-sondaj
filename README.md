## Aplicație Sondaj

Această aplicație web full-stack permite utilizatorilor să creeze, gestioneze și analizeze sondaje. Aplicația este construită cu un framework web modern pentru experiențe front-end rapide și fiabile.

![Arhitectura Software](./arhitectura%20software.png)

## Caracteristici:

- Crearea de sondaje cu o varietate de tipuri de întrebări (întrebări cu răspuns unic, cu mai multe opțiuni, grilă, deschise)
- Personalizarea sondajelor cu imagini, videoclipuri și formatare bogată
- Participarea la sondaje de pe orice dispozitiv
- Colectarea și stocarea automată a răspunsurilor
- Analiza detaliată a rezultatelor sondajelor cu grafice și diagrame
- Securitate și confidențialitate a datelor

## Beneficii:

- O modalitate ușoară și eficientă de a colecta feedback
- Obțineți informații valoroase pentru a lua decizii mai bune
- Creșteți implicarea și satisfacția utilizatorilor
- Urmăriți tendințele și evoluțiile în timp

## Tehnologie Utilizată

- **[Express](https://expressjs.com/)**: Un framework minimalist și flexibil pentru aplicații web Node.js care oferă un set robust de caracteristici pentru aplicații web și mobile.
- **[JWT](https://jwt.io/)**: JSON Web Tokens (JWT) reprezintă o metodă standard deschisă din industrie (RFC 7519) pentru a reprezenta revendicările în siguranță între două părți.
- **[PostgreSQL](https://www.postgresql.org/)**: Un sistem puternic de baze de date relaționale obiect open source.
- **[Astro](https://astro.build/)**: Un framework web modern pentru experiențe front-end rapide și fiabile.
- **[Svelte](https://svelte.dev/)**: Un mod nou de a construi aplicații web.

### Instalare pe Windows:

Instalează Node.js, recomand să foloești [NVM](https://github.com/coreybutler/nvm-windows).

Instalează pnpm:
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```
Instalează [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Rulează Docker pentru a porni o bază de date PostgreSQL:
```powershell
docker run --env=POSTGRES_PASSWORD=password -p 5432:5432 --restart=no --runtime=runc --name postgres -d postgres
```

Instalează pachetele necesare:
```
pnpm install
```

### Rularea aplicației:

Creează un fișier `.env` în directorul `/src-astro` și adaugă JWT_SECRET_KEY:

Obține secretul rulând următoarea comandă în REPL Node:

```node
require('crypto').randomBytes(64).toString('hex')
```

Mergi la Run and Debug [Ctrl+Shift+D] în VSCode și selectează `Full Stack` pentru a rula aplicația.