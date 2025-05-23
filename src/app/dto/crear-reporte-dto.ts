export interface CrearReporteDTO {
  description: string;
  userId: string;
  title: string;
  categoryId: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
    description: string;
  };
  photos?: File[]; // o photo?: File si solo es una
}
