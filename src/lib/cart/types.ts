export type CartLine = {
  key: string; // slug + variantes elegidas: misma pieza con otra variante = otra línea
  slug: string;
  name: string;
  image: string; // URL de la miniatura
  variants: string[]; // ["Talle 14", "Color dorado"]
  unitPrice: number | null;
  qty: number;
};

export type CartState = {
  lines: CartLine[];
  gift: boolean;
  giftMessage: string;
  customerName: string;
};

export type CartAction =
  | { type: "add"; line: Omit<CartLine, "key"> }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "setGift"; gift: boolean }
  | { type: "setGiftMessage"; message: string }
  | { type: "setCustomerName"; name: string };

export const GIFT_MESSAGE_MAX = 150;
export const MAX_QTY = 20;
