import { site } from "../content/site";
import { formatPrice } from "./format";
import { cartTotal, lineSubtotal } from "./cart/reducer";
import type { CartState } from "./cart/types";

/**
 * Link de WhatsApp con texto prearmado. Sin número configurado usa
 * https://wa.me/?text=… (WhatsApp deja elegir el contacto).
 */
export function whatsappLink(text: string, phone: string = site.whatsapp): string {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const GENERAL_MESSAGE = "¡Hola Milca! 👋 Tengo una consulta:";

export function productInquiryMessage(name: string, url: string): string {
  return `¡Hola Milca! 👋 Quería consultar por ${name}: ${url}`;
}

export function backInStockMessage(name: string, url: string): string {
  return `¡Hola Milca! 👋 Vi que ${name} está agotado. ¿Me avisás si vuelve? ${url}`;
}

/** Mensaje del pedido. Se usa desde el carrito y está cubierto por tests. */
export function buildOrderMessage(cart: CartState): string {
  const lines = cart.lines.map((l) => {
    const parts = [`${l.qty} x ${l.name}`, ...l.variants];
    const sub = lineSubtotal(l);
    parts.push(sub === null ? "Precio a consultar" : formatPrice(sub));
    return `• ${parts.join(" — ")}`;
  });

  const { total, partial } = cartTotal(cart);
  const out = ["¡Hola Milca! 👋 Quiero hacer este pedido:", "", ...lines, ""];

  if (cart.lines.every((l) => l.unitPrice === null)) out.push("Total: a consultar");
  else if (partial) out.push(`Total parcial: ${formatPrice(total)} (+ piezas a consultar)`);
  else out.push(`Total: ${formatPrice(total)}`);

  if (cart.gift) {
    const msg = cart.giftMessage.trim();
    out.push(msg ? `🎁 Es para regalo. Mensaje para la tarjeta: "${msg}"` : "🎁 Es para regalo.");
  }

  out.push("");
  const name = cart.customerName.trim();
  if (name) out.push(`Mi nombre es ${name}.`);
  out.push("¿Me confirmás disponibilidad y cómo seguimos con el pago y el envío?");
  return out.join("\n");
}
