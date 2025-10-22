export interface Dancer {
  id: string;
  name: string;
  type: "salsa" | "bachata";
  location: string;
  latitude: number;
  longitude: number;
  profilePic: string;
  instagram: string | null;
  tiktok: string | null;
}
