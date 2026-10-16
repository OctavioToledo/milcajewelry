import { GIFT_MESSAGE_MAX, MAX_QTY, type CartAction, type CartLine, type CartState } from "./types";

export const initialCart: CartState = { lines: [], gift: false, giftMessage: "", customerName: "" };

export function lineKey(slug: string, variants: string[]): string {
  return [slug, ...variants].join("|");
}

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n) || 1));

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.line.slug, action.line.variants);
      const existing = state.lines.find((l) => l.key === key);
      const lines = existing
        ? state.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + action.line.qty) } : l))
        : [...state.lines, { ...action.line, key, qty: clampQty(action.line.qty) }];
      return { ...state, lines };
    }
    case "setQty":
      return { ...state, lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty: clampQty(action.qty) } : l)) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return initialCart;
    case "setGift":
      return { ...state, gift: action.gift };
    case "setGiftMessage":
      return { ...state, giftMessage: action.message.slice(0, GIFT_MESSAGE_MAX) };
    case "setCustomerName":
      return { ...state, customerName: action.name.slice(0, 80) };
  }
}

export function itemCount(state: CartState): number {
  return state.lines.reduce((n, l) => n + l.qty, 0);
}

export function lineSubtotal(line: CartLine): number | null {
  return line.unitPrice === null ? null : line.unitPrice * line.qty;
}

/** Total de las líneas con precio; `partial` indica que hay piezas a consultar. */
export function cartTotal(state: CartState): { total: number; partial: boolean } {
  let total = 0;
  let partial = false;
  for (const l of state.lines) {
    const sub = lineSubtotal(l);
    if (sub === null) partial = true;
    else total += sub;
  }
  return { total, partial };
}
