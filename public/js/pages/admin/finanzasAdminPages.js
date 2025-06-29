// Cargar la biblioteca de Google Charts
console.log('Cargando Google Charts...');
google.charts.load('current', { packages: ['corechart', 'bar', 'line'] });

import { fetchDataFinanzas, fetchListDataFinanzas } from '../../fetch/pages/admin/finanzasAdminFetch.js';

// Función para obtener datos de la API
// Función para obtener datos de la API con conversión de tipos
async function fetchData(endpoint) {
  console.log(`Fetching data from: /api/admin/${endpoint}`);
  try {
    const response = await fetch(`/api/admin/${endpoint}`);
    console.log(`Response status for ${endpoint}:`, response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Datos recibidos para ${endpoint}:`, data);

    // Convertir valores numéricos que vengan como strings
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

// Función para obtener datos de lista
async function fetchListData(endpoint) {
  console.log(`Fetching list data from: /api/admin/${endpoint}`);
  try {
    const response = await fetch(`/api/admin/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    // Convertir valores numéricos en cada item del array
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

// 1. Gráfico de Ventas del Mes
async function drawVentasMes() {
  const container = document.getElementById('chart-ventas-mes');
  if (!container) return;

  try {
    const data = await fetchDataFinanzas('sales/monthly'); // Usar la nueva función y ruta
    console.log('Datos de ventas:', data);

    const ingresosEsperados = typeof data.ingresos_esperados === 'number'
      ? data.ingresos_esperados
      : Number(data.ingresos_esperados) || 0;

    const ingresosReales = typeof data.ingresos_reales === 'number'
      ? data.ingresos_reales
      : Number(data.ingresos_reales) || 0;

    const chartData = google.visualization.arrayToDataTable([
      ['Tipo', 'Monto'],
      ['Ingresos Esperados', ingresosEsperados],
      ['Ingresos Reales', ingresosReales]
    ]);

    const options = {
      title: 'Ventas del Mes',
      colors: ['#1B4332', '#C9A86A'],
      is3D: true
    };

    const chart = new google.visualization.PieChart(container);
    chart.draw(chartData, options);

  } catch (error) {
    console.error('Error en drawVentasMes:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 2. Pedidos Aprobados vs Entregados
async function drawPedidosAprobadosVsEntregados() {
  const container = document.getElementById('chart-pedidos');
  if (!container) return;

  try {
    const data = await fetchDataFinanzas('sales/approved-vs-delivered'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Estado', 'Cantidad'],
      ['Aprobados', data.pedidos_aprobados || 0],
      ['Entregados', data.pedidos_entregados || 0]
    ]);

    const options = {
      title: 'Pedidos Aprobados vs Entregados',
      colors: ['#1B4332', '#A8A8A8'],
      bar: { groupWidth: '75%' },
      legend: { position: 'none' },
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawPedidosAprobadosVsEntregados:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 3. Pedidos por Método de Pago
async function drawPedidosPorMetodoDePago() {
  const container = document.getElementById('chart-metodo-pago');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/payment-method'); // Usar la nueva función y ruta
    console.log('Datos de método de pago:', data);

    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Método de Pago');
    dataTable.addColumn('number', 'Total');

    data.forEach(item => {
      const valor = typeof item.total_ingresado === 'number'
        ? item.total_ingresado
        : Number(item.total_ingresado) || 0;

      dataTable.addRow([
        item.metodo_pago || 'Desconocido',
        valor
      ]);
    });

    const options = {
      title: 'Pedidos por Método de Pago',
      colors: ['#1B4332', '#C9A86A', '#A8A8A8', '#2D3747'],
      pieSliceText: 'value',
      is3D: true
    };

    const chart = new google.visualization.PieChart(container);
    chart.draw(dataTable, options);
  } catch (error) {
    console.error('Error en drawPedidosPorMetodoDePago:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 4. Historial de Ventas Mensual
async function drawHistorialVentasMensual() {
  const container = document.getElementById('chart-historial');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/history'); // Usar la nueva función y ruta

    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Mes');
    chartData.addColumn('number', 'Ventas');

    data.forEach(item => {
      chartData.addRow([item.mes || 'Mes', item.total_ventas || 0]);
    });

    const options = {
      title: 'Historial de Ventas Mensual',
      colors: ['#1B4332'],
      hAxis: { title: 'Mes' },
      vAxis: { title: 'Ventas' },
      curveType: 'function',
      legend: { position: 'none' }
    };

    const chart = new google.visualization.LineChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawHistorialVentasMensual:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 5. Pedidos Vencidos
async function drawPedidosVencidos() {
  const container = document.getElementById('chart-pedidos-vencidos');
  if (!container) return;

  try {
    const data = await fetchDataFinanzas('sales/overdue-orders'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Estado', 'Cantidad'],
      ['Vencidos', data.pedidos_vencidos || 0],
      ['No Vencidos', data.pedidos_no_vencidos || 0]
    ]);

    const options = {
      title: 'Pedidos Vencidos',
      colors: ['#D64045', '#1B4332'],
      pieSliceText: 'value',
    };

    const chart = new google.visualization.PieChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawPedidosVencidos:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 6. Tiempo Promedio de Pago
async function drawTiempoPromedioPago() {
  const container = document.getElementById('chart-tiempo-promedio-pago');
  if (!container) return;

  try {
    const data = await fetchDataFinanzas('sales/average-payment-time'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Métrica', 'Días'],
      ['Tiempo Promedio', data.tiempo_promedio || 0]
    ]);

    const options = {
      title: 'Tiempo Promedio de Pago',
      colors: ['#C9A86A'],
      legend: { position: 'none' },
      hAxis: { minValue: 0 }
    };

    const chart = new google.visualization.BarChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawTiempoPromedioPago:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 7. Producto Más y Menos Vendido
async function drawProductoMasYMenosVendido() {
  const container = document.getElementById('chart-producto-ventas');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/products-sales-performance'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Producto', 'Cantidad Vendida'],
      ...(data || []).map(item => [item.nombre, item.cantidad_vendida])
    ]);

    const options = {
      title: 'Producto Más y Menos Vendido',
      colors: ['#1B4332', '#A8A8A8'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawProductoMasYMenosVendido:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 8. Inventario Actual
async function drawInventarioActual() {
  const container = document.getElementById('chart-inventario-actual');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/current-inventory'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Producto', 'Cantidad en Stock'],
      ...(data || []).map(item => [item.nombre, item.cantidad_actual])
    ]);

    const options = {
      title: 'Inventario Actual',
      colors: ['#1B4332'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawInventarioActual:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 9. Productos Sin Ventas
async function drawProductosSinVentas() {
  const container = document.getElementById('chart-productos-sin-ventas');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/products-without-sales'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Producto', 'Veces sin vender'],
      ...(data || []).map(item => [item.nombre, item.veces_sin_vender])
    ]);

    const options = {
      title: 'Productos Sin Ventas',
      colors: ['#D64045'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawProductosSinVentas:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 10. Utilidad Bruta del Mes
async function drawUtilidadBrutaDelMes() {
  const container = document.getElementById('chart-utilidad-bruta');
  if (!container) return;

  try {
    const data = await fetchDataFinanzas('sales/gross-profit'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Métrica', 'Monto'],
      ['Utilidad Bruta', data.utilidad_bruta || 0]
    ]);

    const options = {
      title: 'Utilidad Bruta del Mes',
      colors: ['#1B4332'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.BarChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawUtilidadBrutaDelMes:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 11. Top Clientes con Más Deuda
async function drawTopClientesConMasDeuda() {
  const container = document.getElementById('chart-top-clientes-deuda');
  if (!container) return;

  try {
    const data = await fetchListDataFinanzas('sales/top-debt-clients'); // Usar la nueva función y ruta

    const chartData = google.visualization.arrayToDataTable([
      ['Cliente', 'Deuda'],
      ...(data || []).map(item => [item.nombre_cliente, item.deuda_total])
    ]);

    const options = {
      title: 'Top Clientes con Más Deuda',
      colors: ['#D64045'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    console.error('Error en drawTopClientesConMasDeuda:', error);
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Función principal para dibujar todos los gráficos
async function drawAllCharts() {
  await Promise.all([
    drawVentasMes(),
    drawPedidosAprobadosVsEntregados(),
    drawPedidosPorMetodoDePago(),
    drawHistorialVentasMensual(),
    drawPedidosVencidos(),
    drawTiempoPromedioPago(),
    drawProductoMasYMenosVendido(),
    drawInventarioActual(),
    drawProductosSinVentas(),
    drawUtilidadBrutaDelMes(),
    drawTopClientesConMasDeuda()
  ]);
}

// Llamar a la función drawAllCharts cuando Google Charts esté cargado
google.charts.setOnLoadCallback(drawAllCharts);

// Manejar redimensionamiento de la ventana
window.addEventListener('resize', function () {
  drawAllCharts();
});