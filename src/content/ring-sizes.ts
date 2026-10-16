// Tabla de talles de anillo (numeración argentina, aproximada).
// TODO: validar con la tabla que usa la marca.
export const ringSizes = {
  intro: "Con un hilo y una regla encontrás tu talle en un minuto.",
  steps: [
    "Rodeá la base de tu dedo con un hilo o una tira de papel, sin apretar.",
    "Marcá el punto donde se junta y medí el largo con una regla, en milímetros.",
    "Buscá esa medida en la tabla. Si quedás entre dos talles, elegí el más grande.",
  ],
  table: [
    { size: "14", circumference: 54, diameter: 17.2 },
    { size: "15", circumference: 55, diameter: 17.5 },
    { size: "16", circumference: 56, diameter: 17.8 },
    { size: "17", circumference: 57, diameter: 18.1 },
    { size: "18", circumference: 58, diameter: 18.5 },
    { size: "19", circumference: 59, diameter: 18.8 },
    { size: "20", circumference: 60, diameter: 19.1 },
  ],
  tip: "Medí a la tarde: los dedos se hinchan un poco a lo largo del día.",
};
