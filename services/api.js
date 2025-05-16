const BASE_PATH = "/assets/data/";

export async function getData(file) {
  const response = await fetch(`${BASE_PATH}${file}.json`);
  if (!response.ok) throw new Error(`No pude cargar ${file}.json`);
  return response.json();
}
