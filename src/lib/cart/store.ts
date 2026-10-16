/**
 * Store del carrito compartido entre islas (header, ficha, drawer).
 * Un único módulo = una única instancia en el bundle del cliente.
 */
import { cartReducer, initialCart } from "./reducer";
import { loadCart, saveCart } from "./persistence";
import type { CartAction, CartState } from "./types";

type Listener = (state: CartState) => void;

let state: CartState = typeof window === "undefined" ? initialCart : loadCart();
const listeners = new Set<Listener>();

export function getCart(): CartState {
  return state;
}

export function dispatch(action: CartAction): void {
  state = cartReducer(state, action);
  saveCart(state);
  listeners.forEach((l) => l(state));
}

/** Se suscribe y llama de inmediato con el estado actual. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

// Sincroniza entre pestañas.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== "milca-cart") return;
    state = loadCart();
    listeners.forEach((l) => l(state));
  });
}

/** Abre el drawer del carrito (lo escucha CartDrawer). */
export function openCart(): void {
  document.dispatchEvent(new CustomEvent("cart:open"));
}
