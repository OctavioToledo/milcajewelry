import { describe, expect, it } from "vitest";
import { buildOrderMessage, whatsappLink } from "./whatsapp";
import { cartReducer, initialCart } from "./cart/reducer";
import type { CartAction, CartState } from "./cart/types";

const apply = (actions: CartAction[], start: CartState = initialCart) => actions.reduce(cartReducer, start);

const anillo = { slug: "anillo-luna", name: "Anillo Luna", image: "", variants: ["Talle 14"], unitPrice: 18000, qty: 1 };
const aros = { slug: "aros-perla", name: "Aros Perla Gota", image: "", variants: ["Baño dorado"], unitPrice: 12000, qty: 2 };

describe("buildOrderMessage", () => {
  it("arma el pedido del ejemplo con variantes, regalo y nombre", () => {
    const cart = apply([
      { type: "add", line: anillo },
      { type: "add", line: aros },
      { type: "setGift", gift: true },
      { type: "setGiftMessage", message: "Feliz cumple, ma" },
      { type: "setCustomerName", name: "Sofía" },
    ]);
    expect(buildOrderMessage(cart)).toBe(
      [
        "¡Hola Milca! 👋 Quiero hacer este pedido:",
        "",
        "• 1 x Anillo Luna — Talle 14 — $18.000",
        "• 2 x Aros Perla Gota — Baño dorado — $24.000",
        "",
        "Total: $42.000",
        '🎁 Es para regalo. Mensaje para la tarjeta: "Feliz cumple, ma"',
        "",
        "Mi nombre es Sofía.",
        "¿Me confirmás disponibilidad y cómo seguimos con el pago y el envío?",
      ].join("\n"),
    );
  });

  it("omite regalo y nombre cuando no están", () => {
    const msg = buildOrderMessage(apply([{ type: "add", line: anillo }]));
    expect(msg).not.toContain("🎁");
    expect(msg).not.toContain("Mi nombre");
    expect(msg).toContain("Total: $18.000");
  });

  it("regalo sin mensaje", () => {
    const msg = buildOrderMessage(apply([{ type: "add", line: anillo }, { type: "setGift", gift: true }]));
    expect(msg).toContain("🎁 Es para regalo.\n");
  });

  it("precio null: muestra a consultar y total parcial", () => {
    const msg = buildOrderMessage(
      apply([
        { type: "add", line: anillo },
        { type: "add", line: { ...aros, slug: "escultura", name: "Anillos Escultura", variants: [], unitPrice: null } },
      ]),
    );
    expect(msg).toContain("• 2 x Anillos Escultura — Precio a consultar");
    expect(msg).toContain("Total parcial: $18.000 (+ piezas a consultar)");
  });

  it("todo a consultar", () => {
    const msg = buildOrderMessage(apply([{ type: "add", line: { ...anillo, unitPrice: null } }]));
    expect(msg).toContain("Total: a consultar");
  });

  it("misma pieza con distinta variante = líneas distintas; misma variante suma cantidad", () => {
    const cart = apply([
      { type: "add", line: anillo },
      { type: "add", line: { ...anillo, variants: ["Talle 16"] } },
      { type: "add", line: anillo },
    ]);
    expect(cart.lines).toHaveLength(2);
    expect(cart.lines[0].qty).toBe(2);
  });

  it("limita el mensaje de la tarjeta a 150 caracteres", () => {
    const cart = apply([{ type: "setGiftMessage", message: "a".repeat(200) }]);
    expect(cart.giftMessage).toHaveLength(150);
  });
});

describe("whatsappLink", () => {
  it("codifica caracteres especiales, saltos de línea y emojis", () => {
    const text = '¡Hola! 👋 & "comillas" #1 ?\nñandú 🎁';
    const url = whatsappLink(text, "+54 9 261 123-4567");
    expect(url.startsWith("https://wa.me/5492611234567?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(text);
    expect(url.split("?text=")[1]).not.toMatch(/[ \n"#&?]/);
  });

  it("sin número abre el selector de contacto", () => {
    expect(whatsappLink("hola", "")).toBe("https://wa.me/?text=hola");
  });
});
