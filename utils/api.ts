// /utils/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchFromAPI = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
