/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

// Mock user profile
const mockUser = {
  id: 'user-1',
  username: 'demo',
  email: 'demo@myshop.com',
  fullName: 'Demo User',
  defaultAddress: {
    street: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  },
  preferences: {
    newsletter: true,
    defaultMinRating: 3,
  },
};

// Mock orders
const mockOrders = [
  {
    id: 'ORD-001',
    total: 45.99,
    status: 'delivered',
    createdAt: '2025-01-15T10:00:00Z',
    itemCount: 3,
  },
  {
    id: 'ORD-002',
    total: 78.50,
    status: 'shipped',
    createdAt: '2025-02-10T14:30:00Z',
    itemCount: 5,
  },
  {
    id: 'ORD-003',
    total: 125.00,
    status: 'processing',
    createdAt: '2025-03-05T09:15:00Z',
    itemCount: 7,
  },
];

// Mock reviews database
const mockReviewsDB: { [productId: number]: any[] } = {};

export const handlers = [
  // ========== Auth endpoints ==========
  http.post(`${API}/auth/token/`, async () => {
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 }
    );
  }),

  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json(
      { access: 'mock-access-token-refreshed' },
      { status: 200 }
    );
  }),

  // ========== Products endpoints ==========
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

  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });

    const stock = Math.floor(Math.random() * 50) + 10;
    return HttpResponse.json(
      {
        ...p,
        description: `Description détaillée du produit ${p.name}. Excellent rapport qualité/prix, parfait pour tous vos besoins quotidiens. Fabriqué avec des matériaux de haute qualité.`,
        stock,
        lowStockThreshold: 10,
        category: 'Fournitures',
        images: [`/assets/product-${id}.jpg`],
      },
      { status: 200 }
    );
  }),

  // ========== Cart endpoints ==========
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];
    const promoCode = body.promoCode;  // ← AJOUTER

    // Calculer le total
    const itemsTotal = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    // Appliquer les codes promo
    const appliedPromos: string[] = [];
    let discount = 0;
    let shipping = itemsTotal > 50 ? 0 : 5.99;

    if (promoCode) {
      const upperCode = promoCode.toUpperCase();
      
      if (upperCode === 'WELCOME10') {
        discount = itemsTotal * 0.1;
        appliedPromos.push('WELCOME10');
      } else if (upperCode === 'FREESHIP') {
        shipping = 0;
        appliedPromos.push('FREESHIP');
      } else if (upperCode === 'VIP20' && itemsTotal >= 100) {
        discount = itemsTotal * 0.2;
        appliedPromos.push('VIP20');
      }
    }

    const taxes = (itemsTotal - discount) * 0.2;
    const grandTotal = itemsTotal - discount + shipping + taxes;

    return HttpResponse.json(
      {
        itemsTotal: Number(itemsTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        taxes: Number(taxes.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
        appliedPromos,  // ← AJOUTER
      },
      { status: 200 }
    );
  }),

  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    // Simuler une validation de stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.product.id);
      if (!product) {
        return HttpResponse.json(
          {
            valid: false,
            message: `Produit ${item.product.name} introuvable`,
          },
          { status: 200 }
        );
      }
    }

    return HttpResponse.json({ valid: true }, { status: 200 });
  }),

  http.post(`${API}/order/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

  // ========== User endpoints ==========
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(mockUser, { status: 200 });
  }),

  http.patch(`${API}/me/`, async ({ request }) => {
    const updates = (await request.json()) as any;
    const updatedUser = { ...mockUser, ...updates };
    return HttpResponse.json(updatedUser, { status: 200 });
  }),

  http.get(`${API}/me/orders/`, async () => {
    return HttpResponse.json(mockOrders, { status: 200 });
  }),

  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const orderId = params['id'] as string;
    const order = mockOrders.find((o) => o.id === orderId);
    
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }

    const orderDetails = {
      ...order,
      items: [
        {
          productId: 1,
          productName: 'Stylo Bleu',
          quantity: 2,
          price: 2.5,
        },
        {
          productId: 2,
          productName: 'Cahier A5',
          quantity: 1,
          price: 3.9,
        },
      ],
      subtotal: order.total * 0.8,
      taxes: order.total * 0.2,
      shipping: 5.99,
      address: mockUser.defaultAddress,
    };

    return HttpResponse.json(orderDetails, { status: 200 });
  }),

  // ========== Wishlist endpoints ==========
  http.get(`${API}/me/wishlist/`, async () => {
    return HttpResponse.json({ productIds: [1, 3, 5] }, { status: 200 });
  }),

  http.post(`${API}/me/wishlist/`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({ productIds: body.productIds }, { status: 200 });
  }),

  // ========== Reviews endpoints ==========
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const productId = Number(params['id']);
    
    // Générer des reviews mockées si elles n'existent pas
    if (!mockReviewsDB[productId]) {
      mockReviewsDB[productId] = [
        {
          id: `rev-${productId}-1`,
          productId,
          user: 'Alice',
          rating: 5,
          comment: 'Excellent produit, je recommande !',
          createdAt: '2025-01-20T10:00:00Z',
        },
        {
          id: `rev-${productId}-2`,
          productId,
          user: 'Bob',
          rating: 4,
          comment: 'Très bon rapport qualité/prix.',
          createdAt: '2025-02-15T14:30:00Z',
        },
      ];
    }

    return HttpResponse.json(mockReviewsDB[productId], { status: 200 });
  }),

  http.post(`${API}/products/:id/reviews/`, async ({ params, request }) => {
    const productId = Number(params['id']);
    const body = (await request.json()) as any;

    const newReview = {
      id: `rev-${productId}-${Date.now()}`,
      productId,
      user: mockUser.username,
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };

    if (!mockReviewsDB[productId]) {
      mockReviewsDB[productId] = [];
    }
    mockReviewsDB[productId].push(newReview);

    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json(newReview, { status: 201 });
  }),

  // ========== Admin endpoints ==========
  http.get(`${API}/admin/stats/`, async () => {
    const stats = {
      totalUsers: 1250,
      totalOrders: 3847,
      totalRevenue: 125680.50,
      topProducts: [
        { productId: 1, name: 'Stylo Bleu', sold: 245, revenue: 612.50 },
        { productId: 2, name: 'Cahier A5', sold: 189, revenue: 737.10 },
        { productId: 3, name: 'Classeur Rouge', sold: 156, revenue: 702.00 },
        { productId: 4, name: 'Crayon HB', sold: 312, revenue: 374.40 },
        { productId: 5, name: 'Règle 30cm', sold: 198, revenue: 297.00 },
      ],
      recentOrders: mockOrders.slice(0, 5),
    };

    return HttpResponse.json(stats, { status: 200 });
  }),
];