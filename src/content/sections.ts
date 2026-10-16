/**
 * Textos de las secciones de la landing.
 * DEMO: textos generales; ajustar con la voz de la marca.
 */
export const sections = {
  novedades: {
    title: "Novedades",
    text: "Lo último que llegó. Algunas piezas vienen en pocas unidades.",
  },
  catalogo: {
    title: "Catálogo",
    text: "Filtrá por tipo de pieza y tocá la que te guste para ver todos los detalles.",
    all: "Todo",
    empty: "No hay piezas en esta categoría por ahora.",
  },
  regalo: {
    title: "Para regalo",
    statement: "Cada pieza sale lista para regalar.",
    text: "Marcá “Es para regalo” en tu pedido y la preparamos en su packaging con una tarjeta escrita con tu mensaje.",
  },
  materiales: {
    title: "Materiales y garantía",
    items: [
      {
        name: "Acero quirúrgico",
        text: "No se oxida, no se pone negro y es apto para el uso diario.", // TODO: confirmar líneas y materiales
      },
      {
        name: "Acero con baño de oro",
        text: "La resistencia del acero con el brillo cálido del oro. Con buenos cuidados, el baño dura mucho más.",
      },
    ],
    warranty: {
      title: "Garantía",
      text: "Todas las piezas tienen garantía por fallas de fabricación. Si algo no está bien, escribinos y lo resolvemos.", // TODO: plazo y alcance reales
    },
  },
  comoComprar: {
    title: "Cómo comprar",
    steps: [
      { title: "Elegí", text: "Recorré el catálogo y elegí talle, largo o color." },
      { title: "Agregá", text: "Sumá las piezas a tu pedido. Podés marcarlo para regalo." },
      { title: "Enviá", text: "Tocá “Enviar pedido por WhatsApp”: el mensaje sale armado." },
      { title: "Coordinamos", text: "Te confirmamos disponibilidad, pago y envío." },
    ],
  },
  envios: { title: "Envíos y pagos" },
  guias: {
    title: "Guías",
    items: [
      { title: "Guía de talles", text: "Medí tu dedo en casa y encontrá tu talle de anillo.", href: "/guia-de-talles" },
      { title: "Cuidados", text: "Cómo cuidar tus joyas para que duren y brillen.", href: "/cuidados" },
    ],
  },
  nosotros: {
    title: "Quiénes somos",
    statement: "Joyas esenciales, elegidas una por una.",
    // TODO: historia real de la marca
    text: [
      "Milca nace en San Martín, Mendoza, con una idea simple: joyas lindas, de buena calidad y fáciles de usar todos los días.",
      "Elegimos cada pieza pensando en cómo se ve puesta y en cómo se siente regalarla. Te atendemos de forma personal, por WhatsApp, de principio a fin.",
    ],
  },
  faq: { title: "Preguntas frecuentes" },
  instagram: {
    title: "Seguinos en Instagram",
    text: "Novedades, piezas nuevas y cómo combinarlas.",
    cta: "Seguinos en Instagram",
  },
  contacto: {
    title: "Contacto",
    text: "¿Tenés una duda o buscás algo en particular? Escribinos.",
    whatsappCta: "Escribinos por WhatsApp",
  },
} as const;
