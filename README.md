# My Shop – Angular / NgRx / Storybook

Projet réalisé à partir du dépôt d’exercice https://github.com/ByteElegance/456(My Shop).

L’objectif du projet est de construire une petite application Angular
avec :

- **Routing** et pages `/login`, `/shop/products`, `/shop/rating`
- **Mock API** avec **MSW** (Mock Service Worker)
- **State management** avec **NgRx** (`auth` & `products`)
- **UI** avec **Angular Material**
- **Storybook** pour les composants de présentation

---

## 1. Installation

```bash
npm install
```

> 💡 Le projet est prévu pour Node 20+.
> Une version impaire (ex : Node 25) fonctionne pour l’exercice
> mais n’est pas recommandée pour la production.

---

## 2. Lancer l’application

```bash
npm start
```

Puis ouvrir :
👉 [http://localhost:4200/](http://localhost:4200/)

### Routes principales

- `/` : page d’accueil
- `/app` : **AppPlaceholder** (point d’entrée de l’app)
- `/login` : **page de login**
- `/shop/products` : **liste des produits** avec filtres
- `/shop/rating` : **page de note** d’un produit
- `/dev/*` : zone de test fournie par l’énoncé (MSW / produits / rating)

### Login

La page `/login` envoie une requête à l’API mockée :

- `POST /api/auth/token/`

Les identifiants de test sont visibles dans la zone `/dev/auth`
(par exemple `demo / demo` selon la configuration MSW).

Après login, un badge dans `/app` affiche :

- **Logged in** si un access token est présent dans le store
- **Logged out** sinon

---

## 3. Lancer Storybook

```bash
npm run storybook
```

Storybook est disponible sur :
👉 [http://localhost:6006/](http://localhost:6006/)

Stories importantes :

- **Auth / Login Form**
  - Composant formulaire de login, avec états _Default_, _Loading_, _With Error_
  - L’action `submit` est traquée dans le panneau **Actions**

- **Shop / Product Card**
  - Affiche un produit (nom, prix, date, note moyenne)

- **Shop / Products List**
  - Grappe de `ProductCard` pour afficher une liste de produits

---

## 4. Fonctionnalités

### 4.1 Authentification

- **Slice NgRx** `auth` :
  - actions : `login`, `loginSuccess`, `loginFailure`, `refreshToken`, …
  - reducer : stockage du token `access`, `refresh`, `loading`, `error`
  - selectors : `selectAccessToken`, `selectAuthLoading`, `selectAuthError`, …

- **Effect** `AuthEffects` :
  - `login$` → `POST /api/auth/token/` via `ShopApiService`

La page `/login` :

- utilise un formulaire Material
- dispatch `login({ username, password })`
- affiche :
  - un spinner quand `auth.loading === true`
  - les erreurs éventuelles via `auth.error`

### 4.2 Produits

- **Slice NgRx** `products` :
  - actions : `loadProducts`, `loadProductsSuccess`, `loadProductsFailure`
  - reducer : `items`, `totalCount`, `loading`, `error`, dernière requête
  - selectors : `selectProducts`, `selectProductsCount`, `selectProductsLoading`, …

- **Effect** `ProductsEffects` :
  - `loadProducts$` → `GET /api/products/` avec `URLSearchParams`

La page `/shop/products` :

- formulaire de filtres :
  - `page`, `pageSize`, `minRating`, `ordering`

- dispatch `loadProducts(...)`
- table Material affichant :
  - ID, name, price, created_at

- gestion des états :
  - spinner pendant le chargement
  - message en cas d’erreur

### 4.3 Rating d’un produit

La page `/shop/rating` :

- petit formulaire pour saisir un `productId`
- appel direct au service `ShopApiService.getProductRating(id)` :
  - `GET /api/products/:id/rating/`

- affiche :
  - l’ID produit
  - la note moyenne (`avg_rating`)
  - le nombre d’avis (`count`)

- gestion du `loading` et des erreurs (ID invalide, etc.)

---

## 5. Scripts NPM

Principaux scripts (définis dans `package.json`) :

- `npm start` – lancer l’application Angular (`ng serve`)
- `npm run build` – build de production
- `npm run test` – tests unitaires (si configurés)
- `npm run storybook` – lancer Storybook
- `npm run build-storybook` – build statique de Storybook

---

## 6. Notes diverses

- MSW (**Mock Service Worker**) est activé en dev via `environment.useMsw`
  et `main.ts` qui démarre le worker.
- Les reducers NgRx restent volontairement simples :
  - gestion des flags `loading`
  - stockage des données et de la dernière requête

- Le code privilégie des composants de page (containers) qui utilisent NgRx
  et des composants de présentation (dans `ui/`) testés via Storybook.
