export const saveLS = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const loadLS = (key) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};
