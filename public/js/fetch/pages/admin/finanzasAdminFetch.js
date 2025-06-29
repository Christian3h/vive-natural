export async function fetchDataFinanzas(endpoint) {
  console.log(`Fetching data from: /api/sales/${endpoint}`);
  try {
    const response = await fetch(`/api/sales/${endpoint}`);
    console.log(`Response status for ${endpoint}:`, response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Datos recibidos para ${endpoint}:`, data);

    const convertNumbers = (obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
            obj[key] = Number(obj[key]);
          } else if (typeof obj[key] === 'object') {
            convertNumbers(obj[key]);
          }
        });
      }
      return obj;
    };

    return Array.isArray(data)
      ? data.map(item => convertNumbers(item))
      : convertNumbers(data[0] || data);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {};
  }
}

export async function fetchListDataFinanzas(endpoint) {
  console.log(`Fetching list data from: /api/sales/${endpoint}`);
  try {
    const response = await fetch(`/api/sales/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map(item => {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'string' && !isNaN(item[key])) {
          item[key] = Number(item[key]);
        }
      });
      return item;
    });
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
} 