import { test, expect } from '@playwright/test';

test('Debe completar el flujo completo de análisis, recomendación, solicitud y registro', async ({ page }) => {
  // 1. Navigate to dashboard
  await page.goto('/');
  await expect(page.locator('.brand')).toContainText('stockflowai', { ignoreCase: true });
  
  // Verify main statistics exist
  await expect(page.locator('.stats')).toBeVisible();
  
  // Verify that there are products in the inventory alerts list
  const alertItems = page.locator('.product-row');
  await expect(alertItems.first()).toBeVisible();
  const alertCount = await alertItems.count();
  console.log(`\n[Info] Encontrados ${alertCount} productos en alerta de inventario.`);
  
  // 2. Start Inventory Analysis
  const analyzeBtn = page.getByRole('button', { name: 'Analizar inventario' });
  await expect(analyzeBtn).toBeVisible();
  await analyzeBtn.click();
  
  // 3. Wait for multi-agent analysis steps to complete
  console.log('[Info] Esperando a que los agentes terminen el análisis...');
  
  // The Analysis component shows progress and agent steps
  await expect(page.locator('.analysis')).toBeVisible();
  
  // Wait for the "Ver recomendaciones" button to become visible (which indicates processing is false)
  const viewRecsBtn = page.locator('button.result-btn', { hasText: 'Ver recomendaciones' });
  await expect(viewRecsBtn).toBeVisible({ timeout: 10000 });
  await viewRecsBtn.click();
  
  // 4. Verify results page
  await expect(page.locator('.result-summary h2')).toContainText('necesitan atención');
  
  const productCards = page.locator('.product-card');
  const cardsCount = await productCards.count();
  expect(cardsCount).toBeGreaterThan(0);
  console.log(`[Info] Encontradas ${cardsCount} tarjetas de recomendaciones.`);
  
  // 5. Select the first recommendation
  const firstCard = productCards.first();
  await expect(firstCard.locator('h3')).toBeVisible();
  const productName = await firstCard.locator('h3').innerText();
  console.log(`[Info] Seleccionando recomendación para: ${productName}`);
  
  await firstCard.getByRole('button', { name: 'Ver recomendación' }).click();
  
  // 6. Verify details page
  await expect(page.locator('.detail-product h2')).toHaveText(productName);
  await expect(page.locator('.recommendation')).toBeVisible();
  await expect(page.locator('.recommendation button.primary')).toBeVisible();
  
  // 7. Click to generate request
  await page.locator('.recommendation button.primary', { hasText: 'Generar solicitud' }).click();
  
  // 8. Verify request modal is open and confirm
  const modal = page.locator('.modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('h2')).toContainText('Confirma la reposición');
  
  // Click confirm
  await modal.getByRole('button', { name: 'Confirmar solicitud' }).click();
  
  // 9. Verify success screen
  await expect(modal.locator('h2')).toContainText('Solicitud creada');
  await modal.getByRole('button', { name: 'Entendido' }).click();
  
  // 10. Verify modal is closed
  await expect(modal).not.toBeVisible();
  
  // 11. Navigate to Solicitudes (Requests) view
  await page.locator('button.nav-item:has-text("Solicitudes")').click();
  await expect(page.locator('.requests-page')).toBeVisible();
  
  // Check that the new request is visible under pending
  const pendingRequests = page.locator('.requests-section .table-row');
  const pendingCount = await pendingRequests.count();
  expect(pendingCount).toBeGreaterThan(0);
  console.log(`[Info] Encontradas ${pendingCount} solicitudes pendientes.`);
  
  // Click "Aprobar" on the pending request
  const firstRequestRow = pendingRequests.first();
  const approveBtn = firstRequestRow.getByRole('button', { name: 'Aprobar' });
  await expect(approveBtn).toBeVisible();
  await approveBtn.click();
  
  // 12. Navigate to Historial (History) view
  await page.locator('button.nav-item:has-text("Historial")').click();
  await expect(page.locator('.history-table')).toBeVisible();
  
  // Verify that the decision is listed
  const historyRows = page.locator('.table-row');
  const historyCount = await historyRows.count();
  expect(historyCount).toBeGreaterThan(0);
  
  const firstHistoryText = await historyRows.first().innerText();
  console.log(`[Info] Último registro en historial: ${firstHistoryText.replace(/\n/g, ' ')}\n`);
});
