// Cargar la biblioteca de Google Charts
console.log('Cargando Google Charts...');
google.charts.load('current', { packages: ['corechart', 'bar', 'line'] });

// Función para obtener datos de la API
// Función para obtener datos de la API con conversión de tipos
async function fetchData(endpoint) {
    console.log(`Fetching data from: /sesion/admin/${endpoint}`);
    try {
      const response = await fetch(`/sesion/admin/${endpoint}`);
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
    console.log(`Fetching list data from: /sesion/admin/${endpoint}`);
    try {
      const response = await fetch(`/sesion/admin/${endpoint}`);
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
      const data = await fetchData('ventas-mes');
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
  
      // Resto del código...
    } catch (error) {
      console.error('Error en drawVentasMes:', error);
      container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  }

// 2. Pedidos Aprobados vs Entregados
async function drawPedidosAprobadosVsEntregados() {
  const container = document.getElementById('chart-pedidos');
  if (!container) return;

  const data = await fetchData('pedidos-aprobados-vs-entregados');
  
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

  try {
    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 3. Pedidos por Método de Pago
async function drawPedidosPorMetodoDePago() {
    const container = document.getElementById('chart-metodo-pago');
    if (!container) return;
  
    try {
      const data = await fetchListData('pedidos-metodo-pago');
      console.log('Datos de método de pago:', data);
      
      // Crear DataTable directamente
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'Método de Pago');
      dataTable.addColumn('number', 'Total');
      
      // Asegurarse de que los valores sean numéricos
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

  const data = await fetchListData('historial-ventas');
  
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

  try {
    const chart = new google.visualization.LineChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 5. Pedidos Vencidos
async function drawPedidosVencidos() {
  const container = document.getElementById('chart-pedidos-vencidos');
  if (!container) return;

  const data = await fetchData('pedidos-vencidos');
  
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

  try {
    const chart = new google.visualization.PieChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 6. Tiempo Promedio de Pago
async function drawTiempoPromedioPago() {
  const container = document.getElementById('chart-tiempo-promedio-pago');
  if (!container) return;

  const data = await fetchData('tiempo-promedio-pago');
  
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

  try {
    const chart = new google.visualization.BarChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 7. Producto Más y Menos Vendido
async function drawProductoMasYMenosVendido() {
  const container = document.getElementById('chart-producto-mas-menos-vendido');
  if (!container) return;

  const data = await fetchData('productos-mas-menos-vendido');
  
  const masVendido = data?.producto_mas_vendido || { nombre: 'N/A', cantidad: 0 };
  const menosVendido = data?.producto_menos_vendido || { nombre: 'N/A', cantidad: 0 };

  const chartData = google.visualization.arrayToDataTable([
    ['Producto', 'Cantidad Vendida'],
    [`Más: ${masVendido.nombre}`, masVendido.cantidad],
    [`Menos: ${menosVendido.nombre}`, menosVendido.cantidad]
  ]);

  const options = {
    title: 'Producto Más y Menos Vendido',
    colors: ['#1B4332', '#A8A8A8'],
    legend: { position: 'none' },
  };

  try {
    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 8. Inventario Actual
async function drawInventarioActual() {
  const container = document.getElementById('chart-inventario-actual');
  if (!container) return;

  const data = await fetchListData('inventario-actual');
  
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Producto');
  chartData.addColumn('number', 'Cantidad');
  
  // Mostrar solo los top 10 productos para mejor visualización
  data.slice(0, 10).forEach(item => {
    chartData.addRow([item.nombre || 'Producto', item.cantidad || 0]);
  });

  const options = {
    title: 'Inventario Actual (Top 10)',
    colors: ['#1B4332'],
    legend: { position: 'none' },
    hAxis: { title: 'Cantidad' },
    vAxis: { title: 'Producto' }
  };

  try {
    const chart = new google.visualization.BarChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 9. Productos sin Ventas
async function drawProductosSinVentas() {
  const container = document.getElementById('chart-productos-sin-ventas');
  if (!container) return;

  const data = await fetchListData('productos-sin-ventas');
  
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Producto');
  chartData.addColumn('number', 'Días sin ventas');
  
  // Mostrar solo los top 10 productos para mejor visualización
  data.slice(0, 10).forEach(item => {
    chartData.addRow([item.nombre || 'Producto', item.dias_sin_ventas || 0]);
  });

  const options = {
    title: 'Productos sin Ventas (Top 10)',
    colors: ['#D64045'],
    legend: { position: 'none' }
  };

  try {
    const chart = new google.visualization.ColumnChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 10. Utilidad Bruta del Mes
async function drawUtilidadBrutaDelMes() {
  const container = document.getElementById('chart-utilidad-bruta');
  if (!container) return;

  const data = await fetchData('utilidad-bruta');
  
  const chartData = google.visualization.arrayToDataTable([
    ['Concepto', 'Monto'],
    ['Utilidad Bruta', data.utilidad_bruta || 0],
    ['Costos', data.costos || 0]
  ]);

  const options = {
    title: 'Utilidad Bruta del Mes',
    colors: ['#1B4332', '#A8A8A8'],
    pieHole: 0.4,
  };

  try {
    const chart = new google.visualization.PieChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// 11. Top Clientes con Más Deuda
async function drawTopClientesConMasDeuda() {
  const container = document.getElementById('chart-top-clientes-deuda');
  if (!container) return;

  const data = await fetchListData('top-clientes-deuda');
  
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Cliente');
  chartData.addColumn('number', 'Deuda');
  
  // Mostrar solo los top 5 clientes para mejor visualización
  data.slice(0, 5).forEach(item => {
    chartData.addRow([item.nombre || 'Cliente', item.deuda || 0]);
  });

  const options = {
    title: 'Top 5 Clientes con Mayor Deuda',
    colors: ['#D64045'],
    legend: { position: 'none' }
  };

  try {
    const chart = new google.visualization.BarChart(container);
    chart.draw(chartData, options);
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Función principal que coordina todo
async function drawAllCharts() {
  try {
    await drawVentasMes();
    await drawPedidosAprobadosVsEntregados();
    await drawPedidosPorMetodoDePago();
    await drawHistorialVentasMensual();
    await drawPedidosVencidos();
    await drawTiempoPromedioPago();
    await drawProductoMasYMenosVendido();
    await drawInventarioActual();
    await drawProductosSinVentas();
    await drawUtilidadBrutaDelMes();
    await drawTopClientesConMasDeuda();
    console.log('Todos los gráficos dibujados correctamente');
  } catch (error) {
    console.error('Error al dibujar gráficos:', error);
  }
}

// Inicialización cuando Google Charts esté listo
google.charts.setOnLoadCallback(drawAllCharts);

// Manejar redimensionamiento de la ventana
window.addEventListener('resize', function() {
  drawAllCharts();
});