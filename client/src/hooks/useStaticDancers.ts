import { useQuery } from "@tanstack/react-query";
import type { Dancer } from "@/types/schema";

export function useStaticDancers() {
  return useQuery<Dancer[]>({
    queryKey: ["static-dancers"],
    queryFn: async () => {
      // For static deployment, we fetch from the public data folder
      // Use import.meta.env.BASE_URL to handle GitHub Pages base path
      const base = import.meta.env.BASE_URL;
      const response = await fetch(`${base}data/dancers.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch dancers: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: Infinity, // Data never changes in static deployment
    refetchOnWindowFocus: false,
  });
}