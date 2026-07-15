import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowUpRight, Bell, Boxes, BrainCircuit, Check, ChevronRight, CircleAlert, Clock3, FilePlus2, Gauge, History, PackageSearch, PanelLeft, Plus, Search, Settings, Sparkles, Truck, X } from 'lucide-react';
import './styles.css';
import { supabase } from './supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Local backup datasets as required by implementation plan (Section 6 & 8)
const BACKUP_PRODUCTS = [
  { id: 1, producto: 'Chaqueta Denim Classic', categoria: 'Outerwear', talla: 'L', stock_actual: 5, consumo_diario_promedio: 2.5, imagen: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=700&q=85' },
  { id: 2, producto: 'Blazer Sastrero Arena', categoria: 'Sastrería', talla: 'M', stock_actual: 8, consumo_diario_promedio: 2.66, imagen: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85' },
  { id: 3, producto: 'Pantalón Cargo Olive', categoria: 'Bottoms', talla: '32', stock_actual: 11, consumo_diario_promedio: 2.2, imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85' },
  { id: 4, producto: 'Camisa Oxford Blanca', categoria: 'Camisas', talla: 'M', stock_actual: 35, consumo_diario_promedio: 1.2, imagen: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=85' },
  { id: 5, producto: 'Vestido Midi Lino', categoria: 'Vestidos', talla: 'S', stock_actual: 2, consumo_diario_promedio: 0.0, imagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85' },
  { id: 6, producto: 'Camiseta Básica Algodón', categoria: 'Camisetas', talla: 'M', stock_actual: 15, consumo_diario_promedio: 4.0, imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=85' },
  { id: 7, producto: 'Jeans Slim Fit Indigo', categoria: 'Jeans', talla: '32', stock_actual: 50, consumo_diario_promedio: 1.5, imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85' },
  { id: 8, producto: 'Tenis Urban Retro', categoria: 'Zapatos', talla: '42', stock_actual: 4, consumo_diario_promedio: 1.0, imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85' },
  { id: 9, producto: 'Gorra Deportiva Active', categoria: 'Gorras', talla: 'Única', stock_actual: 12, consumo_diario_promedio: 3.0, imagen: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85' }
];

const BACKUP_SUPPLIERS = [
  { id: 1, producto_id: 1, nombre: 'ModaExpress', costo_unitario: 28.50, plazo_entrega_dias: 4 },
  { id: 2, producto_id: 1, nombre: 'Confecciones Express', costo_unitario: 32.00, plazo_entrega_dias: 2 },
  { id: 3, producto_id: 2, nombre: 'Textil Andino', costo_unitario: 45.00, plazo_entrega_dias: 3 },
  { id: 4, producto_id: 3, nombre: 'Distrito 9', costo_unitario: 18.00, plazo_entrega_dias: 5 },
  { id: 5, producto_id: 4, nombre: 'Camisas del Norte', costo_unitario: 15.00, plazo_entrega_dias: 6 },
  { id: 6, producto_id: 5, nombre: 'Lino Real', costo_unitario: 35.00, plazo_entrega_dias: 4 },
  { id: 7, producto_id: 6, nombre: 'CottonStyle', costo_unitario: 8.00, plazo_entrega_dias: 3 },
  { id: 8, producto_id: 7, nombre: 'DenimFactory', costo_unitario: 22.00, plazo_entrega_dias: 5 },
  { id: 9, producto_id: 8, nombre: 'Calzado Express', costo_unitario: 30.00, plazo_entrega_dias: 2 },
  { id: 10, producto_id: 8, nombre: 'Calzado Premium', costo_unitario: 35.00, plazo_entrega_dias: 1 },
  { id: 11, producto_id: 9, nombre: 'Accesorios Sport', costo_unitario: 6.00, plazo_entrega_dias: 5 }
];

const BACKUP_REQUESTS = [
  { id: 1, producto_id: 4, proveedor_id: 5, cantidad: 40, costo_estimado: 600.00, estado: 'aprobada', fecha_creacion: new Date(Date.now() - 86400000).toISOString(), producto: { producto: 'Camisa Oxford Blanca', categoria: 'Camisas', talla: 'M', imagen: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=85' }, proveedor: { nombre: 'Camisas del Norte' } },
  { id: 2, producto_id: 3, proveedor_id: 4, cantidad: 25, costo_estimado: 450.00, estado: 'en tránsito', fecha_creacion: new Date(Date.now() - 14400000).toISOString(), producto: { producto: 'Pantalón Cargo Olive', categoria: 'Bottoms', talla: '32', imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85' }, proveedor: { nombre: 'Distrito 9' } }
];

const BACKUP_HISTORY = [
  { id: 1, producto_id: 4, decision: 'Compra de 40 unidades', explicacion: 'Se aprobó la reposición automática sugerida por el sistema para evitar riesgo en fin de semana.', fecha: new Date(Date.now() - 86400000).toISOString(), producto: { producto: 'Camisa Oxford Blanca' } },
  { id: 2, producto_id: 3, decision: 'Compra de 25 unidades', explicacion: 'Solicitud pendiente de aprobación para reponer inventario del Pantalón Cargo Olive.', fecha: new Date(Date.now() - 14400000).toISOString(), producto: { producto: 'Pantalón Cargo Olive' } }
];

// Calculation of inventory risk and selection of suppliers (Section 5)
function runInventoryAnalysis(productsList, suppliersList) {
  return productsList.map(prod => {
    const prodSuppliers = suppliersList.filter(s => s.producto_id === prod.id);
    const dailyCons = parseFloat(prod.consumo_diario_promedio);
    let daysRemaining = dailyCons > 0 ? (prod.stock_actual / dailyCons) : Infinity;

    if (prodSuppliers.length === 0) {
      return {
        id: prod.id,
        name: prod.producto,
        category: prod.categoria,
        size: prod.talla,
        stock: prod.stock_actual,
        image: prod.imagen,
        days: daysRemaining === Infinity ? 'N/A' : Math.round(daysRemaining),
        daysVal: daysRemaining,
        risk: 'Bajo',
        units: 0,
        supplier: 'No disponible',
        costo_estimado: 0,
        explicacion: 'No hay proveedores registrados para este producto.',
        selectedSupplier: null,
        warning: false,
      };
    }

    const evaluatedSuppliers = prodSuppliers.map(sup => {
      const deliveryDays = sup.plazo_entrega_dias;
      const coverageObjective = deliveryDays + 10; // 7 operation days + 3 safety days
      const suggestedQty = dailyCons > 0 ? Math.max(0, Math.ceil(dailyCons * coverageObjective - prod.stock_actual)) : 0;
      const estCost = suggestedQty * parseFloat(sup.costo_unitario);
      const canDeliverInTime = deliveryDays < daysRemaining;

      return {
        ...sup,
        suggestedQty,
        estCost,
        canDeliverInTime
      };
    });

    const matchingSuppliers = evaluatedSuppliers.filter(s => s.suggestedQty > 0);

    if (matchingSuppliers.length === 0) {
      return {
        id: prod.id,
        name: prod.producto,
        category: prod.categoria,
        size: prod.talla,
        stock: prod.stock_actual,
        image: prod.imagen,
        days: daysRemaining === Infinity ? 'N/A' : Math.round(daysRemaining),
        daysVal: daysRemaining,
        risk: 'Bajo',
        units: 0,
        supplier: prodSuppliers[0].nombre,
        costo_estimado: 0,
        explicacion: `El inventario actual de ${prod.stock_actual} unidades es suficiente para cubrir la operación.`,
        selectedSupplier: prodSuppliers[0],
        warning: false
      };
    }

    // Selection rules (Section 5.2):
    // 1. Prioritize suppliers who can deliver in time.
    const eligibleSuppliers = matchingSuppliers.filter(s => s.canDeliverInTime);
    let bestSupplier;
    let warning = false;

    if (eligibleSuppliers.length > 0) {
      // 2. Lowest cost.
      // 3. Lowest delivery days (tie breaker).
      eligibleSuppliers.sort((a, b) => {
        if (a.estCost !== b.estCost) return a.estCost - b.estCost;
        return a.plazo_entrega_dias - b.plazo_entrega_dias;
      });
      bestSupplier = eligibleSuppliers[0];
    } else {
      // 4. If none can deliver in time, select the one with shortest delivery days and warn.
      matchingSuppliers.sort((a, b) => a.plazo_entrega_dias - b.plazo_entrega_dias);
      bestSupplier = matchingSuppliers[0];
      warning = true;
    }

    // Risk classification (Section 5.1 & Section 9):
    // "Un producto está en riesgo cuando sus días restantes son menores o iguales al plazo de entrega del proveedor más 3 días de seguridad."
    let risk = 'Bajo';
    if (daysRemaining <= bestSupplier.plazo_entrega_dias + 3) {
      risk = daysRemaining <= 2 ? 'Crítico' : 'Alto';
    }

    // Explanation string (Section 5.3):
    let explicacion = `El producto dispone de ${daysRemaining.toFixed(1)} días de inventario y el proveedor entrega en ${bestSupplier.plazo_entrega_dias} días. Se recomiendan ${bestSupplier.suggestedQty} unidades para cubrir la entrega, 7 días de operación y 3 días de seguridad.`;
    if (warning) {
      explicacion += ` ¡Advertencia! Ningún proveedor puede entregar a tiempo. Se seleccionó ${bestSupplier.nombre} por tener la entrega más rápida (${bestSupplier.plazo_entrega_dias} días).`;
    }

    return {
      id: prod.id,
      name: prod.producto,
      category: prod.categoria,
      size: prod.talla,
      stock: prod.stock_actual,
      image: prod.imagen,
      days: daysRemaining === Infinity ? 'N/A' : Math.round(daysRemaining),
      daysVal: daysRemaining,
      risk,
      units: bestSupplier.suggestedQty,
      supplier: bestSupplier.nombre,
      costo_estimado: bestSupplier.estCost,
      explicacion,
      selectedSupplier: bestSupplier,
      warning
    };
  });
}

function App() {
  const [view, setView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [analyzedProducts, setAnalyzedProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usingBackup, setUsingBackup] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [modal, setModal] = useState(false);
  const [requestActionProcessingId, setRequestActionProcessingId] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Generate PDF report utilizing jsPDF and jspdf-autotable
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      
      // Color Palette matching StockFlow AI styles
      const primaryColor = [117, 159, 126]; // Sage green #759f7e
      const secondaryColor = [74, 85, 104]; // Slate gray #4a5568
      const lightColor = [247, 250, 252]; // Off-white #f7fafc
      const textColor = [45, 55, 72]; // Charcoal #2d3748
      const alertColor = [224, 130, 130]; // Pastel red #e08282

      // Header and Footer decoration helper
      const addHeaderAndFooter = (pageNumber, pageCount) => {
        // Top header band
        doc.setFillColor(117, 159, 126);
        doc.rect(0, 0, 210, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('StockFlow AI — Reporte Ejecutivo de Inventario', 15, 9);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Página ${pageNumber} de ${pageCount}`, 180, 9);

        // Bottom footer line and text
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 282, 195, 282);
        doc.setFontSize(7);
        doc.setTextColor(160, 174, 192);
        doc.text('StockFlow AI · Optimización de Inventario Multiagente en tiempo real · Confidencial', 15, 287);
      };

      // Document Title & Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(74, 85, 104);
      doc.text('REPORTE DE INVENTARIO Y PLAN DE REPOSICIÓN', 15, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 128, 150);
      const now = new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' });
      doc.text(`Fecha de Generación: ${now} | Sucursal Evaluada: Bodega Central (Venta de Ropa)`, 15, 36);
      doc.setDrawColor(117, 159, 126);
      doc.setLineWidth(0.5);
      doc.line(15, 39, 195, 39);

      // Section 1: Resumen Ejecutivo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(74, 85, 104);
      doc.text('1. Resumen Ejecutivo', 15, 48);

      const activeRecommendations = analyzedProducts.filter(p => p.units > 0);
      const totalProposedInvestment = activeRecommendations.reduce((acc, curr) => acc + (curr.costo_estimado || 0), 0);

      // Draw background panel for metrics
      doc.setFillColor(247, 250, 252);
      doc.roundedRect(15, 53, 180, 28, 3, 3, 'F');
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 128, 150);
      doc.text('Total Productos Analizados', 20, 60);
      doc.text('Prendas Críticas/Atención', 70, 60);
      doc.text('Propuestas de Compra', 120, 60);
      doc.text('Inversión Total Propuesta', 160, 60);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 55, 72);
      doc.text(`${products.length}`, 20, 71);
      
      const criticalCount = analyzedProducts.filter(p => p.risk === 'Crítico' || p.risk === 'Alto').length;
      if (criticalCount > 0) {
        doc.setTextColor(224, 130, 130); // Alert red
      } else {
        doc.setTextColor(117, 159, 126); // Sage green
      }
      doc.text(`${criticalCount}`, 70, 71);
      
      doc.setTextColor(45, 55, 72);
      doc.text(`${activeRecommendations.length}`, 120, 71);
      
      doc.setTextColor(117, 159, 126); // Sage green
      doc.text(`$${totalProposedInvestment.toFixed(2)} USD`, 160, 71);

      // Section 2: Análisis de Criticidad (Días de Cobertura)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(74, 85, 104);
      doc.text('2. Análisis de Criticidad de Inventario', 15, 92);
      
      // Sort items by coverage days ascending (criticidad)
      const sortedItems = [...analyzedProducts].sort((a, b) => {
        const covA = typeof a.daysVal === 'number' ? a.daysVal : 999;
        const covB = typeof b.daysVal === 'number' ? b.daysVal : 999;
        return covA - covB;
      });

      const criticidadHeaders = [['ID', 'Producto', 'Categoría', 'Talla', 'Stock', 'Consumo Diarios', 'Cobertura (Días)', 'Riesgo']];
      const criticidadBody = sortedItems.map(p => {
        const coverage = typeof p.daysVal === 'number' && p.daysVal !== Infinity ? p.daysVal.toFixed(1) : '∞';
        return [
          p.id,
          p.name || p.producto,
          p.category || p.categoria,
          p.size || p.talla,
          p.stock !== undefined ? p.stock : p.stock_actual,
          p.consumo_diario_promedio !== undefined ? p.consumo_diario_promedio.toFixed(2) : '0.00',
          coverage,
          p.risk || 'Bajo'
        ];
      });

      autoTable(doc, {
        startY: 97,
        head: criticidadHeaders,
        body: criticidadBody,
        theme: 'striped',
        headStyles: { fillColor: [74, 85, 104], fontSize: 9 },
        bodyStyles: { fontSize: 8.5 },
        alternateRowStyles: { fillColor: [247, 250, 252] },
        columnStyles: {
          7: { fontStyle: 'bold' }
        },
        didParseCell: function (data) {
          if (data.column.index === 7) {
            const val = data.cell.text[0];
            if (val === 'Crítico') {
              data.cell.styles.textColor = [224, 130, 130];
            } else if (val === 'Alto') {
              data.cell.styles.textColor = [224, 170, 100];
            } else if (val === 'Bajo' || val === 'Normal') {
              data.cell.styles.textColor = [117, 159, 126];
            }
          }
        }
      });

      // Section 3: Plan de Reposición Implementado
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(74, 85, 104);
      doc.text('3. Plan de Reposición Implementado', 15, 25);

      if (activeRecommendations.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(113, 128, 150);
        doc.text('No se requieren compras en este ciclo de análisis. Todos los productos disponen de stock suficiente.', 15, 33);
      } else {
        const reposicionHeaders = [['Producto', 'Talla', 'Proveedor Seleccionado', 'Cantidad a Pedir', 'Costo Unitario', 'Plazo (Días)', 'Costo Total']];
        const reposicionBody = activeRecommendations.map(p => {
          return [
            p.name || p.producto,
            p.size || p.talla,
            p.supplier || 'N/A',
            `${p.units} uds.`,
            `$${(p.selectedSupplier?.costo_unitario || 0).toFixed(2)}`,
            `${p.selectedSupplier?.plazo_entrega_dias || 0} días`,
            `$${(p.costo_estimado || 0).toFixed(2)}`
          ];
        });

        autoTable(doc, {
          startY: 30,
          head: reposicionHeaders,
          body: reposicionBody,
          theme: 'striped',
          headStyles: { fillColor: [117, 159, 126], fontSize: 9 },
          bodyStyles: { fontSize: 8.5 },
          alternateRowStyles: { fillColor: [247, 250, 252] }
        });

        // Section 4: Historial de Decisiones Inteligentes
        const lastY = doc.lastAutoTable.finalY + 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(74, 85, 104);
        doc.text('4. Justificaciones de Decisiones Inteligentes (IA)', 15, lastY);

        let currentY = lastY + 8;
        activeRecommendations.forEach((p, idx) => {
          if (currentY > 260) {
            doc.addPage();
            currentY = 25;
          }
          
          doc.setFontSize(9.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(45, 55, 72);
          doc.text(`${idx + 1}. ${p.name || p.producto} (Talla ${p.size || p.talla})`, 15, currentY);
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(113, 128, 150);
          
          const explanationText = p.explicacion || 'No hay explicación adicional.';
          const splitText = doc.splitTextToSize(explanationText, 180);
          
          currentY += 4.5;
          doc.text(splitText, 15, currentY);
          currentY += (splitText.length * 4) + 6;
        });
      }

      // Add headers/footers to all pages
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        addHeaderAndFooter(i, pages);
      }

      // Save the PDF
      doc.save('reporte_gestion_inventario.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el reporte en PDF: ' + error.message);
    }
  };

  // Load datasets on mount
  const loadData = async () => {
    try {
      // 1. Fetch inventory
      const { data: pData, error: pErr } = await supabase.from('inventario').select('*').order('id', { ascending: true });
      if (pErr) throw pErr;

      // 2. Fetch suppliers
      const { data: sData, error: sErr } = await supabase.from('proveedores').select('*').order('id', { ascending: true });
      if (sErr) throw sErr;

      // 3. Fetch purchase requests
      const { data: rData, error: rErr } = await supabase
        .from('solicitudes_reposicion')
        .select('*, producto:inventario(producto, categoria, talla, imagen), proveedor:proveedores(nombre)')
        .order('fecha_creacion', { ascending: false });
      if (rErr) throw rErr;

      // 4. Fetch history
      const { data: hData, error: hErr } = await supabase
        .from('historial_decisiones')
        .select('*, producto:inventario(producto)')
        .order('fecha', { ascending: false });
      if (hErr) throw hErr;

      setProducts(pData);
      setSuppliers(sData);
      setRequests(rData || []);
      setHistory(hData || []);

      const analysis = runInventoryAnalysis(pData, sData);
      setAnalyzedProducts(analysis);
      
      // Default select first item
      if (analysis.length > 0) {
        setSelected(analysis[0]);
      }
      setUsingBackup(false);
      setSupabaseError(null);
    } catch (err) {
      console.warn('Fallback to local backup data. Supabase error:', err);
      setProducts(BACKUP_PRODUCTS);
      setSuppliers(BACKUP_SUPPLIERS);
      setRequests(BACKUP_REQUESTS);
      setHistory(BACKUP_HISTORY);

      const analysis = runInventoryAnalysis(BACKUP_PRODUCTS, BACKUP_SUPPLIERS);
      setAnalyzedProducts(analysis);

      if (analysis.length > 0) {
        setSelected(analysis[0]);
      }
      setUsingBackup(true);
      setSupabaseError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const runAnalysis = () => {
    setView('analysis');
    setAnalysisPhase(0);
    setProcessing(true);
  };

  useEffect(() => {
    if (!processing) return undefined;
    const timers = [
      setTimeout(() => setAnalysisPhase(1), 1100),
      setTimeout(() => setAnalysisPhase(2), 2300),
      setTimeout(() => { setAnalysisPhase(3); setProcessing(false); }, 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [processing]);

  const goDetail = (product) => {
    setSelected(product);
    setView('detail');
  };

  // Create a purchase request & add to history
  const handleCreateRequest = async (product) => {
    if (usingBackup) {
      // Local storage fallback
      const newReq = {
        id: Date.now(),
        producto_id: product.id,
        proveedor_id: product.selectedSupplier?.id || 1,
        cantidad: product.units,
        costo_estimado: product.costo_estimado,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString(),
        producto: { producto: product.name, categoria: product.category, talla: product.size, imagen: product.image },
        proveedor: { nombre: product.supplier }
      };
      const newHist = {
        id: Date.now() + 1,
        producto_id: product.id,
        decision: `Compra de ${product.units} unidades`,
        explicacion: product.explicacion,
        fecha: new Date().toISOString(),
        producto: { producto: product.name }
      };
      setRequests([newReq, ...requests]);
      setHistory([newHist, ...history]);
    } else {
      try {
        const { error: reqErr } = await supabase.from('solicitudes_reposicion').insert({
          producto_id: product.id,
          proveedor_id: product.selectedSupplier?.id,
          cantidad: product.units,
          costo_estimado: product.costo_estimado,
          estado: 'pendiente'
        });
        if (reqErr) throw reqErr;

        const { error: histErr } = await supabase.from('historial_decisiones').insert({
          producto_id: product.id,
          decision: `Compra de ${product.units} unidades`,
          explicacion: product.explicacion
        });
        if (histErr) throw histErr;

        await loadData();
      } catch (err) {
        alert('Error al guardar en Supabase: ' + err.message);
      }
    }
  };

  // Approve a request from the requests view
  const handleApproveRequest = async (id, productId, quantity, supplierName) => {
    setRequestActionProcessingId(id);
    if (usingBackup) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, estado: 'aprobada' } : r));
      const newHist = {
        id: Date.now(),
        producto_id: productId,
        decision: `Aprobación de compra de ${quantity} unidades`,
        explicacion: `Se aprobó la reposición de ${quantity} unidades con el proveedor ${supplierName || 'seleccionado'}.`,
        fecha: new Date().toISOString(),
        producto: { producto: products.find(p => p.id === productId)?.producto || 'Producto' }
      };
      setHistory([newHist, ...history]);
      setRequestActionProcessingId(null);
    } else {
      try {
        const { error: reqErr } = await supabase
          .from('solicitudes_reposicion')
          .update({ estado: 'aprobada' })
          .eq('id', id);
        if (reqErr) throw reqErr;

        const { error: histErr } = await supabase.from('historial_decisiones').insert({
          producto_id: productId,
          decision: `Aprobación de compra de ${quantity} unidades`,
          explicacion: `Aprobación manual de la solicitud pendiente de ${quantity} unidades con el proveedor ${supplierName}.`
        });
        if (histErr) throw histErr;

        await loadData();
      } catch (err) {
        alert('Error al aprobar solicitud: ' + err.message);
      } finally {
        setRequestActionProcessingId(null);
      }
    }
  };

  // Reject a request from the requests view
  const handleRejectRequest = async (id) => {
    setRequestActionProcessingId(id);
    if (usingBackup) {
      setRequests(prev => prev.filter(r => r.id !== id));
      setRequestActionProcessingId(null);
    } else {
      try {
        const { error: reqErr } = await supabase
          .from('solicitudes_reposicion')
          .delete()
          .eq('id', id);
        if (reqErr) throw reqErr;

        await loadData();
      } catch (err) {
        alert('Error al rechazar solicitud: ' + err.message);
      } finally {
        setRequestActionProcessingId(null);
      }
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'Manrope, sans-serif' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3.5px', borderTopColor: 'var(--ink)' }}></div>
      <p style={{ marginTop: '20px', fontWeight: '700', fontSize: '15px', letterSpacing: '-0.3px' }}>Cargando StockFlow AI...</p>
    </div>;
  }

  // Filter alerts for the control panel (only Critical/High risk)
  const inRiskProducts = analyzedProducts.filter(p => p.risk === 'Crítico' || p.risk === 'Alto');
  
  // Pending requests count
  const pendingRequests = requests.filter(r => r.estado === 'pendiente');

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Boxes size={20}/></div><span>stockflow<span>ai</span></span></div>
      <div className="workspace"><span>OPERACIONES</span><ChevronRight size={13}/></div>
      <nav>
        <Nav icon={<Gauge/>} label="Centro de control" active={view === 'dashboard'} onClick={() => setView('dashboard')}/>
        <Nav icon={<PackageSearch/>} label="Inventario" active={view === 'results'} onClick={() => setView('results')}/>
        <Nav icon={<FilePlus2/>} label="Solicitudes" active={view === 'requests'} badge={pendingRequests.length > 0 ? String(pendingRequests.length) : null} onClick={() => setView('requests')}/>
        <Nav icon={<History/>} label="Historial" active={view === 'history'} onClick={() => setView('history')}/>
      </nav>
      <div className="agent-card"><div className="agent-glow"></div><div className="agent-icon"><BrainCircuit size={18}/></div><strong>IA disponible</strong><p>3 agentes listos para analizar tu operación.</p><div><i></i> Sistema en línea</div></div>
      <div className="side-bottom">
        <Nav icon={<Settings/>} label="Configuración" active={view === 'settings'} onClick={() => setView('settings')}/>
        <div className="user"><div className="avatar">EM</div><div><strong>Elena Mora</strong><small>Inventario</small></div><ChevronRight size={15}/></div>
      </div>
    </aside>
    
    <section className="content">
      {usingBackup && (
        <div style={{ background: '#fef3f2', border: '1px solid #f8d7da', color: '#b02a37', padding: '12px 18px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '500', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
          <CircleAlert size={16} />
          <span><strong>Modo de Simulación Local Activo:</strong> No se pudo conectar con Supabase ({supabaseError}). Utilizando datos mock de respaldo.</span>
        </div>
      )}

      <header>
        <div>
          <p className="eyebrow">MARTES, 15 JULIO 2026</p>
          <h1>
            {view === 'dashboard' ? 'Buenos días, Elena.' : 
             view === 'analysis' ? 'Orquestando inventario' : 
             view === 'detail' ? 'Recomendación de reposición' : 
             view === 'history' ? 'Historial de decisiones' : 
             view === 'requests' ? 'Solicitudes de compra' : 
             view === 'settings' ? 'Configuración de operación' :
             'Inventario en riesgo'}
          </h1>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Search size={19}/></button>
          <div className="notifications-wrap">
            <button className="icon-btn notification" aria-label="Ver notificaciones" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <Bell size={19}/><b></b>
            </button>
            {notificationsOpen && (
              <Notifications 
                products={analyzedProducts} 
                onSelect={(product) => {
                  if (product) {
                    setSelected(product);
                    setView('detail');
                  }
                  setNotificationsOpen(false);
                }}
              />
            )}
          </div>
          <button className="action-button" onClick={runAnalysis}><Sparkles size={17}/> Analizar inventario</button>
        </div>
      </header>
      
      {view === 'dashboard' && <Dashboard items={inRiskProducts} totalItemsCount={products.length} pendingRequestsCount={pendingRequests.length} onRun={runAnalysis} onDetail={goDetail}/>} 
      {view === 'analysis' && <Analysis processing={processing} phase={analysisPhase} onFinish={() => setView('results')}/>} 
      {view === 'results' && <Results items={analyzedProducts} onDetail={goDetail} onGeneratePDF={generatePDFReport}/>} 
      {view === 'detail' && <Detail product={selected} onRequest={() => setModal(true)} onBack={() => setView('results')}/>} 
      {view === 'requests' && <RequestsView requests={requests} onApprove={handleApproveRequest} onReject={handleRejectRequest} processingId={requestActionProcessingId}/>}
      {view === 'history' && <HistoryView history={history}/>}
      {view === 'settings' && <SettingsView/>}
    </section>
    
    {modal && <RequestModal product={selected} onConfirm={handleCreateRequest} close={() => setModal(false)} />}
  </main>;
}

function Nav({icon,label,active,badge,onClick}) { 
  return <button className={'nav-item '+(active?'active':'')} onClick={onClick}>
    {icon}
    <span>{label}</span>
    {badge && <em>{badge}</em>}
  </button>;
}

function Notifications({ products, onSelect }) {
  const notices = [
    {
      product: products.find(p => p.name === 'Chaqueta Denim Classic' || p.id === 1),
      title: 'Stock crítico detectado',
      detail: 'Chaqueta Denim Classic · 5 unidades',
      time: 'Hace 12 min',
      kind: 'critical'
    },
    {
      product: products.find(p => p.name === 'Blazer Sastrero Arena' || p.id === 2),
      title: 'Reposición recomendada',
      detail: 'Blazer Sastrero Arena · cobertura de 3 días',
      time: 'Hace 38 min',
      kind: 'warning'
    },
    {
      product: products.find(p => p.name === 'Pantalón Cargo Olive' || p.id === 3),
      title: 'Riesgo de cobertura',
      detail: 'Pantalón Cargo Olive · revisa el pedido',
      time: 'Hace 1 h',
      kind: 'info'
    }
  ];
  return (
    <div className="notifications-panel">
      <div className="notifications-title">
        <div>
          <p className="eyebrow">INVENTARIO</p>
          <strong>Últimas alertas</strong>
        </div>
        <span>3 nuevas</span>
      </div>
      {notices.map(note => (
        <button className="notice" key={note.title} onClick={() => onSelect(note.product)}>
          <i className={note.kind}></i>
          <div>
            <strong>{note.title}</strong>
            <p>{note.detail}</p>
            <small>{note.time}</small>
          </div>
          <ChevronRight size={15} />
        </button>
      ))}
      <div className="notifications-footer">Selecciona una alerta para ver la recomendación</div>
    </div>
  );
}

function Dashboard({items,totalItemsCount,pendingRequestsCount,onRun,onDetail}) { 
  return <div className="page-enter">
    <section className="hero">
      <div className="hero-copy">
        <div className="pill"><Sparkles size={13}/> Inteligencia de inventario</div>
        <h2>Tu inventario habla.<br/><i>StockFlow escucha.</i></h2>
        <p>Detectamos el riesgo antes de que se convierta en una venta perdida.</p>
        <button className="primary" onClick={onRun}>Iniciar análisis ahora <ArrowUpRight size={17}/></button>
      </div>
      <div className="orbital">
        <div className="orbit o1"></div>
        <div className="orbit o2"></div>
        <div className="core">
          <BrainCircuit size={38}/>
          <small>AGENTES<br/>ACTIVOS</small>
        </div>
        <span className="node n1">A</span>
        <span className="node n2">P</span>
        <span className="node n3">R</span>
      </div>
    </section>
    
    <div className="stats">
      <Stat icon={<Boxes/>} num={String(totalItemsCount)} label="Productos monitoreados" change="En tiempo real"/>
      <Stat icon={<CircleAlert/>} num={String(items.length)} label="Requieren atención" change={`${items.filter(i=>i.risk==='Crítico').length} críticos`} urgent={items.length > 0}/>
      <Stat icon={<FilePlus2/>} num={pendingRequestsCount < 10 ? `0${pendingRequestsCount}` : String(pendingRequestsCount)} label="Solicitudes por aprobar" change="Espera validación"/>
    </div>
    
    <section className="section-head">
      <div>
        <p className="eyebrow">REQUIERE ACCIÓN</p>
        <h2>Alertas de reposición</h2>
      </div>
      <button className="text-button" onClick={() => onDetail(items[0] || null)}>
        Ver todos <ChevronRight size={17}/>
      </button>
    </section>
    
    <div className="alerts">
      {items.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>
          <Check size={28} style={{ color: '#759f7e', marginBottom: '8px' }}/>
          <p style={{ margin: 0, fontWeight: '600' }}>¡Buen trabajo! Todo tu inventario está en niveles óptimos.</p>
        </div>
      ) : (
        items.map(p => <ProductRow product={p} key={p.id} onClick={() => onDetail(p)}/>)
      )}
    </div>
  </div>;
}

function Stat({icon,num,label,change,urgent}) { 
  return <article className={'stat '+(urgent?'urgent':'')}>
    <div className="stat-icon">{icon}</div>
    <div>
      <strong>{num}</strong>
      <p>{label}</p>
      <small>{change}</small>
    </div>
  </article>;
}

function ProductRow({product,onClick}) { 
  return <article className="product-row" onClick={onClick}>
    <img src={product.image} alt=""/>
    <div className="product-name">
      <strong>{product.name}</strong>
      <span>{product.category} · Talla {product.size}</span>
    </div>
    <div className="metric">
      <small>STOCK ACTUAL</small>
      <b>{product.stock} <i>uds.</i></b>
    </div>
    <div className="metric">
      <small>COBERTURA</small>
      <b>{product.days === 'N/A' ? 'N/A' : `${product.days} días`}</b>
    </div>
    <div className="risk">
      <span className={product.risk === 'Crítico' ? 'critical' : ''}>{product.risk}</span>
    </div>
    <button className="round"><ChevronRight size={19}/></button>
  </article>;
}

function Analysis({processing,phase,onFinish}) { 
  const steps = [
    ['Inventory Analysis Agent', 'Analizando niveles, rotación y cobertura', 'Consulta de referencias en base de datos'],
    ['Replenishment Planning Agent', 'Calculando cantidades y proveedores', 'Optimizando decisiones de reabastecimiento'],
    ['Recommendation Agent', 'Traduciendo datos en acciones claras', 'Preparando resumen inteligente']
  ]; 
  const progress = processing ? Math.round(((phase + 1) / 3) * 100) : 100; 
  return <div className="analysis page-enter">
    <div className="analysis-top">
      <div className={'pulse-orb ' + (!processing ? 'done' : '')}><BrainCircuit size={42}/></div>
      <p className="eyebrow">INVENTORY SUPERVISOR AGENT</p>
      <h2>{processing ? 'Los agentes están en movimiento' : 'Análisis completo'}</h2>
      <p>{processing ? 'Cada especialista está construyendo la recomendación más segura para tu inventario.' : 'Encontramos referencias que requieren de tu atención inmediata.'}</p>
    </div>
    <div className="analysis-progress">
      <span>PROGRESO DEL ANÁLISIS</span>
      <div><i style={{width:`${progress}%`}}></i></div>
      <b>{progress}%</b>
    </div>
    <div className="agent-flow">
      {steps.map((s, i) => {
        const complete = !processing || i < phase;
        const current = processing && i === phase;
        return <React.Fragment key={s[0]}>
          <div className={'agent-step ' + (complete ? 'complete ' : '') + (current ? 'running' : '')}>
            <div className="check">
              {complete ? <Check size={18}/> : current ? <span className="spinner"></span> : <span>{i + 1}</span>}
            </div>
            <div>
              <strong>{s[0]}</strong>
              <p>{s[1]}</p>
              <small>{s[2]}</small>
            </div>
            <div className="status">{complete ? 'LISTO' : current ? 'ANALIZANDO' : 'EN ESPERA'}</div>
          </div>
          {i < 2 && <div className={'connector ' + (complete ? 'lit' : '')}></div>}
        </React.Fragment>;
      })}
    </div>
    {!processing && <button className="primary result-btn" onClick={onFinish}>Ver recomendaciones <ArrowUpRight size={17}/></button>}
  </div>;
}

function Results({items,onDetail,onGeneratePDF}) { 
  // Display only products that have suggestions
  const activeRecommendations = items.filter(p => p.units > 0);
  
  return <div className="page-enter">
    <div className="result-summary">
      <div>
        <p className="eyebrow">RESULTADO DEL ANÁLISIS</p>
        <h2>{activeRecommendations.length} productos necesitan atención.</h2>
        <p>La IA priorizó las acciones según riesgo de quiebre, impacto y tiempo de entrega.</p>
      </div>
      <button className="ghost" onClick={onGeneratePDF}><Activity size={16}/> Descargar Reporte PDF</button>
    </div>
    
    {activeRecommendations.length === 0 ? (
      <div className="empty" style={{ padding: '80px 20px' }}>
        <Check size={42} style={{ color: '#759f7e' }}/>
        <h2>¡No se requieren compras!</h2>
        <p>El análisis determinó que cuentas con stock suficiente para cubrir la demanda y tiempos de entrega de tus proveedores.</p>
      </div>
    ) : (
      <div className="results-grid">
        {activeRecommendations.map(p => (
          <article className="product-card" key={p.id}>
            <img src={p.image} alt=""/>
            <div className="card-body">
              <span className={'risk-tag ' + (p.risk === 'Crítico' ? 'critical' : '')}>{p.risk}</span>
              <h3>{p.name}</h3>
              <p>{p.category} · Talla {p.size}</p>
              <div className="card-numbers">
                <div>
                  <small>STOCK</small>
                  <b>{p.stock} uds.</b>
                </div>
                <div>
                  <small>COBERTURA</small>
                  <b>{p.days === 'N/A' ? 'N/A' : `${p.days} días`}</b>
                </div>
              </div>
              <button onClick={() => onDetail(p)}>Ver recomendación <ArrowUpRight size={16}/></button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>;
}

function Detail({product,onRequest,onBack}) { 
  if (!product) return null;
  return <div className="detail page-enter">
    <button className="back" onClick={onBack}>← Volver a resultados</button>
    <div className="detail-grid">
      <div className="detail-product">
        <img src={product.image} alt=""/>
        <p className="eyebrow">{product.category.toUpperCase()} · TALLA {product.size}</p>
        <h2>{product.name}</h2>
        <div className="stock-line">
          <div>
            <small>STOCK ACTUAL</small>
            <b>{product.stock} unidades</b>
          </div>
          <div>
            <small>COBERTURA ESTIMADA</small>
            <b className={product.risk === 'Crítico' || product.risk === 'Alto' ? 'danger' : ''}>
              {product.days === 'N/A' ? 'N/A' : `${product.days} días`}
            </b>
          </div>
        </div>
      </div>
      
      <div className="recommendation">
        <div className="rec-head">
          <div className="mini-brain"><Sparkles size={18}/></div>
          <span>RECOMENDACIÓN IA</span>
        </div>
        <h3>
          {product.units > 0 ? 'Actúa hoy para evitar\nun quiebre de stock.' : 'Inventario bajo control.'}
        </h3>
        <p>{product.explicacion}</p>
        
        {product.units > 0 && (
          <>
            <div className="rec-data">
              <div><Truck size={17}/><span>PROVEEDOR RECOMMENDED<br/><b>{product.supplier}</b></span></div>
              <div><Plus size={17}/><span>CANTIDAD SUGERIDA<br/><b>{product.units} unidades</b></span></div>
              <div><Clock3 size={17}/><span>TIEMPO DE ENTREGA<br/><b>{product.selectedSupplier?.plazo_entrega_dias || 4} días hábiles</b></span></div>
            </div>
            <button className="primary full" onClick={onRequest}>Generar solicitud <FilePlus2 size={17}/></button>
          </>
        )}
      </div>
    </div>
  </div>;
}

function RequestsView({ requests, onApprove, onReject, processingId }) {
  const pending = requests.filter(r => r.estado === 'pendiente');
  const processed = requests.filter(r => r.estado !== 'pendiente');

  return <div className="requests-page page-enter">
    <div className="requests-section">
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)', marginBottom: '14px' }}>Solicitudes Pendientes ({pending.length})</h2>
      {pending.length === 0 ? (
        <div className="empty" style={{ padding: '50px 20px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px' }}>
          <Check size={36} style={{ color: '#759f7e', marginBottom: '8px' }}/>
          <h3>No hay solicitudes pendientes</h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>Todas las recomendaciones sugeridas por el motor de IA han sido procesadas.</p>
        </div>
      ) : (
        <div className="history-table">
          <div className="table-head" style={{ gridTemplateColumns: '1.2fr 2fr 1.2fr 1.2fr 1.5fr 1.8fr' }}>
            <span>FECHA</span>
            <span>PRODUCTO</span>
            <span>CANTIDAD</span>
            <span>INVERSIÓN</span>
            <span>PROVEEDOR</span>
            <span>ACCIONES</span>
          </div>
          {pending.map(r => (
            <div className="table-row" key={r.id} style={{ gridTemplateColumns: '1.2fr 2fr 1.2fr 1.2fr 1.5fr 1.8fr' }}>
              <span>{new Date(r.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <strong>{r.producto?.producto || 'Producto'} <small style={{ fontWeight: 'normal', color: 'var(--muted)' }}>({r.producto?.categoria})</small></strong>
              <span>{r.cantidad} uds</span>
              <strong style={{ color: 'var(--ink)' }}>${parseFloat(r.costo_estimado).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              <span>{r.proveedor?.nombre || 'Proveedor'}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{ background: '#d7eacf', color: '#3d6333', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', flex: 1 }}
                  disabled={processingId === r.id}
                  onClick={() => onApprove(r.id, r.producto_id, r.cantidad, r.proveedor?.nombre || r.proveedores?.nombre)}
                >
                  {processingId === r.id ? 'Aprobando...' : 'Aprobar'}
                </button>
                <button 
                  style={{ background: '#fcdfdc', color: '#883121', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', flex: 1 }}
                  disabled={processingId === r.id}
                  onClick={() => onReject(r.id)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="requests-section" style={{ marginTop: '35px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)', marginBottom: '14px' }}>Solicitudes Procesadas ({processed.length})</h2>
      {processed.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', background: 'var(--paper)', border: '1px dashed var(--line)', borderRadius: '12px', fontSize: '12px' }}>
          No hay solicitudes procesadas registradas.
        </div>
      ) : (
        <div className="history-table">
          <div className="table-head" style={{ gridTemplateColumns: '1.2fr 2fr 1.2fr 1.2fr 1.5fr 1.2fr' }}>
            <span>FECHA</span>
            <span>PRODUCTO</span>
            <span>CANTIDAD</span>
            <span>INVERSIÓN</span>
            <span>PROVEEDOR</span>
            <span>ESTADO</span>
          </div>
          {processed.map(r => (
            <div className="table-row" key={r.id} style={{ gridTemplateColumns: '1.2fr 2fr 1.2fr 1.2fr 1.5fr 1.2fr' }}>
              <span>{new Date(r.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
              <span>{r.producto?.producto || 'Producto'}</span>
              <span>{r.cantidad} uds</span>
              <span>${parseFloat(r.costo_estimado).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span>{r.proveedor?.nombre || 'Proveedor'}</span>
              <span className="state-badge">
                <span className={r.estado === 'aprobada' ? 'state approved' : r.estado === 'en tránsito' ? 'state transit' : r.estado === 'rechazada' ? 'state critical' : 'state closed'} style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
                  {r.estado}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>;
}

function HistoryView({ history }) {
  return <div className="history page-enter">
    <div className="history-table">
      <div className="table-head" style={{ gridTemplateColumns: '1.2fr 1.6fr 2.5fr 1fr' }}>
        <span>FECHA</span>
        <span>PRODUCTO</span>
        <span>ACCIÓN / DECISIÓN</span>
        <span>ESTADO</span>
      </div>
      {history.length === 0 ? (
        <div className="empty" style={{ padding: '50px' }}>
          <p style={{ margin: 0 }}>No hay registro de decisiones en el historial.</p>
        </div>
      ) : (
        history.map(r => (
          <div className="table-row" key={r.id} style={{ gridTemplateColumns: '1.2fr 1.6fr 2.5fr 1fr' }}>
            <span>{new Date(r.fecha || r.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            <strong>{r.producto?.producto || 'Producto general'}</strong>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)' }}>{r.decision}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.4' }}>{r.explicacion}</p>
            </div>
            <span className="state">COMPLETADA</span>
          </div>
        ))
      )}
    </div>
  </div>;
}

function SettingsView() {
  const [alerts, setAlerts] = useState(true);
  const [summary, setSummary] = useState(true);
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div className="settings-page page-enter">
      <div className="settings-intro">
        <div>
          <p className="eyebrow">PREFERENCIAS DEL SISTEMA</p>
          <h2>Una operación a tu medida.</h2>
          <p>Define cuándo StockFlow debe avisarte y cómo debe trabajar el equipo de agentes.</p>
        </div>
        <div className="settings-orb"><Settings size={28}/></div>
      </div>
      <div className="settings-grid">
        <section className="settings-panel">
          <div className="settings-head">
            <div>
              <span className="setting-icon"><Bell size={18}/></span>
              <h3>Alertas de inventario</h3>
            </div>
            <p>Controla los avisos importantes para tu operación.</p>
          </div>
          <Setting label="Alertas de reposición" text="Recibe un aviso al detectar cobertura inferior a 7 días." checked={alerts} onChange={() => setAlerts(!alerts)}/>
          <Setting label="Resumen diario" text="Envía el estado del inventario a las 08:00." checked={summary} onChange={() => setSummary(!summary)}/>
          <div className="threshold">
            <div>
              <strong>Sensibilidad de riesgo</strong>
              <p>Anticipar quiebre con</p>
            </div>
            <select defaultValue="7">
              <option value="5">5 días</option>
              <option value="7">7 días</option>
              <option value="10">10 días</option>
            </select>
          </div>
        </section>
        <section className="settings-panel">
          <div className="settings-head">
            <div>
              <span className="setting-icon"><BrainCircuit size={18}/></span>
              <h3>Agentes inteligentes</h3>
            </div>
            <p>Estado actual de los especialistas que componen StockFlow.</p>
          </div>
          <div className="integration">
            <div className="integration-dot"></div>
            <div>
              <strong>Inventory Analysis Agent</strong>
              <p>Conectado · Análisis de existencias</p>
            </div>
            <span>ACTIVO</span>
          </div>
          <div className="integration">
            <div className="integration-dot"></div>
            <div>
              <strong>Replenishment Planning Agent</strong>
              <p>Conectado · Estrategia de compra</p>
            </div>
            <span>ACTIVO</span>
          </div>
          <div className="integration">
            <div className="integration-dot"></div>
            <div>
              <strong>Recommendation Agent</strong>
              <p>Conectado · Communication operativa</p>
            </div>
            <span>ACTIVO</span>
          </div>
        </section>
      </div>
      <button className={'primary settings-save ' + (saved ? 'saved' : '')} onClick={save}>
        {saved ? <><Check size={17}/> Cambios guardados</> : <><Settings size={17}/> Guardar preferencias</>}
      </button>
    </div>
  );
}

function Setting({label,text,checked,onChange}){
  return <div className="setting-row">
    <div>
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
    <button className={'toggle '+(checked?'on':'')} onClick={onChange} aria-label={label}><i></i></button>
  </div>;
}

function RequestModal({product,onConfirm,close}){
  const [done,setDone]=useState(false); 
  const handleConfirmClick = async () => {
    await onConfirm(product);
    setDone(true);
  };
  
  return <div className="overlay">
    <div className="modal">
      <button className="modal-close" onClick={close}><X/></button>
      {done ? (
        <div className="success">
          <div><Check size={34}/></div>
          <h2>Solicitud creada</h2>
          <p>La compra de {product.units} unidades fue enviada a {product.supplier}.</p>
          <button className="primary" onClick={close}>Entendido</button>
        </div>
      ) : (
        <>
          <p className="eyebrow">NUEVA SOLICITUD</p>
          <h2>Confirma la reposición</h2>
          <div className="confirm-row">
            <img src={product.image} alt=""/>
            <div>
              <strong>{product.name}</strong>
              <p>{product.units} unidades · {product.supplier}</p>
            </div>
          </div>
          <div className="modal-total">
            <span>Inversión estimada</span>
            <b>${product.costo_estimado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
          </div>
          <button className="primary full" onClick={handleConfirmClick}>Confirmar solicitud <Check size={17}/></button>
        </>
      )}
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
