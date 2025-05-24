export interface LocationDTO {
  latitude: number;
  longitude: number;
  name: string;
  description: string;
}

export interface CrearReporteDTO {
  description: string;
  userId: string;
  title: string;
  categoryId: string;
  location: LocationDTO;
  isImportant?: boolean;  // <-- agregar este campo opcional
}

export interface RespuestaDTO {
  error: boolean;
  contenido: any;
}