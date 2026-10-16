import { initialCart } from "./reducer";
import type { CartState } from "./types";

const STORAGE_KEY = "milca-cart";
const SCHEMA_VERSION = 1;

type Stored = { v: number; state: CartState };

export function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCart;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed?.v !== SCHEMA_VERSION || !Array.isArray(parsed.state?.lines)) return initialCart;
    return { ...initialCart, ...parsed.state };
  } catch {
    return initialCart;
  }
}

export function saveCart(state: CartState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_VERSION, state } satisfies Stored));
  } catch {
    // Modo privado o storage lleno: el carrito sigue funcionando en memoria.
  }
}
