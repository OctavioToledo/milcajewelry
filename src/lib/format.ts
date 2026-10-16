const ars = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** 42000 → "$42.000" */
export function formatPrice(value: number): string {
  return `$${ars.format(value)}`;
}
