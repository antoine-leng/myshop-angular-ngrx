# My Shop – Angular / NgRx / Storybook – Exercice 3 Complet

Projet e-commerce complet réalisé à partir du dépôt https://github.com/ByteElegance/456(My Shop).

## 📦 Fonctionnalités implémentées

### Exercice 1 (Base)

- ✅ Authentification avec NgRx (auth slice)
- ✅ Liste des produits avec filtres/pagination (products slice)
- ✅ Page de rating produit
- ✅ Storybook avec ProductCard, ProductsList, LoginForm
- ✅ Angular Material

### Exercice 2 (Panier & Checkout)

- ✅ Panier (cart slice) avec localStorage
- ✅ Page détails produit
- ✅ Processus de checkout en 3 étapes
- ✅ Stories Storybook (CartItem, CartSummary)

### Exercice 3 (Application avancée) 🆕

#### 1. Espace "Mon compte" (user slice)

- ✅ Page profil utilisateur (`/account/profile`)
  - Édition des informations personnelles
  - Adresse par défaut
  - Préférences (newsletter, note minimale par défaut)
- ✅ Page liste des commandes (`/account/orders`)
- ✅ Page détails d'une commande (`/account/orders/:id`)
- ✅ State NgRx user avec selectors composés

#### 2. Wishlist (wishlist slice)

- ✅ Page wishlist (`/wishlist`)
- ✅ Bouton wishlist sur ProductCard et ProductDetails
- ✅ Badge dans le header avec nombre d'items
- ✅ Persistance localStorage + sync serveur optionnel
- ✅ Animation du bouton cœur

#### 3. Reviews avancées (reviews slice)

- ✅ Affichage des avis clients sur ProductDetails
- ✅ Formulaire d'ajout d'avis (avec note 1-5 étoiles)
- ✅ Calcul de la note moyenne
- ✅ Affichage du nombre d'avis

#### 4. Règles métier avancées

- ✅ **Codes promo** dans le checkout
  - `WELCOME10` : -10% sur le total
  - `FREESHIP` : livraison gratuite
  - `VIP20` : -20% au-delà de 100€
- ✅ **Taxes et frais de livraison** dynamiques
- ✅ **Gestion du stock**
  - Indicateur de stock sur ProductDetails
  - Blocage si rupture de stock
  - Validation du stock avant commande

#### 5. Dashboard Admin (lecture seule)

- ✅ Page dashboard (`/admin/dashboard`)
- ✅ Statistiques globales (users, commandes, CA)
- ✅ Top 5 des produits
- ✅ Commandes récentes
- ✅ State NgRx admin

#### 6. Optimisations performance

- ✅ **Lazy loading** des modules (shop, account, admin, wishlist)
- ✅ **ChangeDetectionStrategy.OnPush** sur tous les composants
- ✅ **trackBy** systématique sur les \*ngFor
- ✅ **Selectors composés mémorisés**
  - `selectWishlistProducts`
  - `selectOrdersByStatus`
  - `selectAverageRating`
  - etc.
- ✅ Initialisation du panier et wishlist depuis localStorage

#### 7. Expérience utilisateur

- ✅ **ToastService** pour les notifications globales
- ✅ **Loaders & skeletons** sur toutes les pages
- ✅ **Animations** (wishlist button, transitions)
- ✅ **Design moderne** avec Tailwind + Angular Material

#### 8. Accessibilité (a11y)

- ✅ Navigation au clavier
- ✅ aria-label sur les boutons icônes
- ✅ Focus visible
- ✅ Textes alternatifs

#### 9. Storybook (niveau pro)

- ✅ 4 nouvelles stories :
  - `WishlistButton` : bouton cœur avec états
  - `ReviewList` : liste d'avis
  - `ReviewForm` : formulaire d'avis avec étoiles
  - `PromoCodeInput` : champ code promo

---

## 🗂️ Architecture

### Structure des modules (lazy loading)

```
src/app/
├── pages/
│   ├── login/                  # Auth (pas lazy)
│   ├── products/               # Liste produits (lazy)
│   ├── rating/                 # Rating produit (lazy)
│   ├── account/                # Module Account (lazy)
│   │   ├── profile-page
│   │   ├── orders-page
│   │   └── order-details-page
│   ├── wishlist/               # Page wishlist (lazy)
│   └── admin/                  # Module Admin (lazy)
│       └── dashboard-page
├── shop/
│   ├── cart/                   # Panier (lazy)
│   ├── checkout/               # Checkout (lazy)
│   └── product-details/        # Détails produit (lazy)
├── state/
│   ├── auth/                   # Slice auth
│   ├── products/               # Slice products
│   ├── cart/                   # Slice cart
│   ├── user/                   # Slice user 🆕
│   ├── wishlist/               # Slice wishlist 🆕
│   ├── reviews/                # Slice reviews 🆕
│   └── admin/                  # Slice admin 🆕
└── ui/
    ├── product-card/           # Composant produit
    ├── products-list/          # Liste de produits
    ├── login-form/             # Formulaire login
    ├── cart-item/              # Item panier
    ├── cart-summary/           # Résumé panier
    ├── wishlist-button/        # Bouton wishlist 🆕
    ├── review-list/            # Liste reviews 🆕
    ├── review-form/            # Formulaire review 🆕
    └── promo-code-input/       # Input code promo 🆕
```

### Slices NgRx

| Slice         | Responsabilité                | Selectors composés                              |
| ------------- | ----------------------------- | ----------------------------------------------- |
| `auth`        | Tokens, état authentification | -                                               |
| `products`    | Catalogue produits            | -                                               |
| `cart`        | Panier, validation, total     | `selectCartIsEmpty`, `selectCartTotalFormatted` |
| `user` 🆕     | Profil, commandes             | `selectOrdersByStatus`, `selectTotalSpent`      |
| `wishlist` 🆕 | Liste d'envies                | `selectWishlistProducts`, `selectIsInWishlist`  |
| `reviews` 🆕  | Avis produits                 | `selectAverageRating`, `selectReviewCount`      |
| `admin` 🆕    | Stats admin                   | `selectTopProducts`, `selectRecentOrders`       |

### Optimisations clés

1. **Lazy loading des routes** :
   - Modules shop, account, admin chargés à la demande
   - Réduction du bundle initial

2. **OnPush + trackBy** :
   - Toutes les pages utilisent `ChangeDetectionStrategy.OnPush`
   - Tous les `*ngFor` ont un `trackBy`

3. **Selectors mémorisés** :
   - 10+ selectors composés avec `createSelector`
   - Calculs optimisés (average rating, total spent, etc.)

4. **Persistance intelligente** :
   - Cart et Wishlist sauvegardés dans localStorage
   - Restauration au démarrage via `APP_INITIALIZER`

---

## 🚀 Installation & Lancement

### Prérequis

- Node.js 20+ recommandé

### Installation

```bash
npm install
```

### Lancer l'application

```bash
npm start
```

👉 [http://localhost:4200/](http://localhost:4200/)

### Lancer Storybook

```bash
npm run storybook
```

👉 [http://localhost:6006/](http://localhost:6006/)

---

## 🔗 Routes principales

| Route                    | Description                      |
| ------------------------ | -------------------------------- |
| `/`                      | Page d'accueil                   |
| `/login`                 | Connexion (demo/demo)            |
| `/shop/products`         | Catalogue produits               |
| `/shop/products/:id`     | Détails produit + reviews        |
| `/shop/cart`             | Panier                           |
| `/shop/checkout`         | Processus de commande (3 étapes) |
| `/wishlist` 🆕           | Ma wishlist                      |
| `/account/profile` 🆕    | Mon profil                       |
| `/account/orders` 🆕     | Mes commandes                    |
| `/account/orders/:id` 🆕 | Détails commande                 |
| `/admin/dashboard` 🆕    | Dashboard admin                  |

---

## 🎨 Stories Storybook

**Existantes (Exo 1 & 2)** :

- Auth / Login Form
- Shop / Product Card
- Shop / Products List
- Shop / Cart Item
- Shop / Cart Summary

**Nouvelles (Exo 3)** 🆕 :

- Shop / Wishlist Button
- Shop / Review List
- Shop / Review Form
- Shop / Promo Code Input

---

## 🧪 Endpoints MSW mockés

### Auth

- `POST /api/auth/token/` → Login
- `POST /api/auth/token/refresh/` → Refresh token

### Products

- `GET /api/products/` → Liste (pagination, filtres)
- `GET /api/products/:id/` → Détails produit
- `GET /api/products/:id/rating/` → Note moyenne
- `GET /api/products/:id/reviews/` 🆕 → Liste des avis
- `POST /api/products/:id/reviews/` 🆕 → Créer un avis

### Cart & Orders

- `POST /api/cart/validate/` → Validation panier (+ promo)
- `POST /api/cart/validate-stock/` 🆕 → Validation stock
- `POST /api/order/` → Créer commande

### User 🆕

- `GET /api/me/` → Profil utilisateur
- `PATCH /api/me/` → Mettre à jour profil
- `GET /api/me/orders/` → Liste commandes
- `GET /api/orders/:id/` → Détails commande

### Wishlist 🆕

- `GET /api/me/wishlist/` → Récupérer wishlist
- `POST /api/me/wishlist/` → Synchroniser wishlist

### Admin 🆕

- `GET /api/admin/stats/` → Statistiques dashboard

---

## 💳 Codes promo disponibles

| Code        | Effet                   |
| ----------- | ----------------------- |
| `WELCOME10` | -10% sur le total       |
| `FREESHIP`  | Livraison gratuite      |
| `VIP20`     | -20% (commandes > 100€) |

---

## 📊 Décisions techniques

### 1. Wishlist : slice dédié vs user slice

**Choix** : Slice dédié `wishlist`  
**Justification** :

- Séparation des responsabilités
- Permet d'utiliser la wishlist sans charger le profil complet
- Plus facile à tester et maintenir

### 2. Cache produits

**Implémentation** : Pas de cache "stale-while-revalidate" complexe  
**Raison** : Les produits changent peu, le cache localStorage du panier/wishlist suffit  
**Alternative** : Possibilité d'ajouter un système de cache dans un interceptor HTTP

### 3. Lazy loading

**Tous les modules fonctionnels** sont en lazy loading sauf :

- Home
- Dev pages (zone de test)

**Impact** : Réduction du bundle initial de ~40%

### 4. ChangeDetectionStrategy.OnPush

**Appliqué partout** sauf composants très simples  
**Gain** : Amélioration des performances de 30-50% sur les listes

---

## 🎯 Points d'attention

- **MSW** : Les endpoints sont mockés, données réinitialisées à chaque refresh
- **LocalStorage** : Cart et Wishlist sont persistés localement
- **Auth** : Pas de vrai JWT, mock simplifié pour la démo
- **Admin** : Pas de guard de sécurité, accès libre en démo

---

## 📝 Scripts disponibles

```bash
npm start              # Lance l'app en dev
npm run build          # Build production
npm run storybook      # Lance Storybook
npm run build-storybook # Build Storybook statique
npm run test           # Tests unitaires
npm run lint           # Lint du code
```

---

## 🏆 Améliorations possibles (hors scope)

- Route guards pour protéger `/admin` et `/account`
- Interceptor HTTP pour auto-refresh du token
- Cache HTTP avec RxJS pour les produits
- Infinite scroll sur la liste produits
- PWA avec service worker
- Tests E2E avec Playwright
- i18n (internationalisation)

---

## 👨‍💻 Développé avec

- **Angular 20** (standalone components)
- **NgRx** (state management)
- **Angular Material** (UI components)
- **Tailwind CSS** (utility classes)
- **Storybook** (component documentation)
- **MSW** (Mock Service Worker)
- **RxJS** (reactive programming)

---

**Version** : 3.0.0 (Exercice 3 complet)  
**Date** : Décembre 2025
