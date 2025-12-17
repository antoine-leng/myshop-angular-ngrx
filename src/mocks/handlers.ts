/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 }
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json(
      { access: 'mock-access-token-refreshed' },
      { status: 200 }
    );
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort(
      (a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign
    );

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json(
      { count, next: null, previous: null, results },
      { status: 200 }
    );
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      {
        product_id: id,
        avg_rating: avgRating(p.ratings),
        count: p.ratings.length,
      },
      { status: 200 }
    );
  }),

  // ===== NOUVEAUX ENDPOINTS EXERCICE 2 =====

  // Product details: GET /api/products/:id/
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });

    // Enrichir avec des données supplémentaires
    return HttpResponse.json(
      {
        ...p,
        description: `Description détaillée du produit ${p.name}. Excellent rapport qualité/prix, parfait pour tous vos besoins quotidiens.`,
        stock: Math.floor(Math.random() * 50) + 10,
        category: 'Fournitures',
        images: [`/assets/product-${id}.jpg`],
      },
      { status: 200 }
    );
  }),

  // Cart validation: POST /api/cart/validate/
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    // Calculer le total des items
    const itemsTotal = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    // Simuler des frais et taxes
    const shipping = itemsTotal > 50 ? 0 : 5.99;
    const discount = itemsTotal > 100 ? itemsTotal * 0.1 : 0;
    const taxes = (itemsTotal - discount) * 0.2;
    const grandTotal = itemsTotal - discount + shipping + taxes;

    return HttpResponse.json(
      {
        itemsTotal: Number(itemsTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        taxes: Number(taxes.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
      },
      { status: 200 }
    );
  }),

  // Order creation: POST /api/order/
  http.post(`${API}/order/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Simuler une petite latence
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json(
      {
        orderId,
        status: 'confirmed',
        total: body.items.reduce(
          (sum: number, item: any) => sum + item.product.price * item.quantity,
          0
        ),
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];