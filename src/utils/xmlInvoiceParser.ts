import { IncomingEmailOrder, SupplierOrderItem } from '../types';

const extractTag = (xml: string, tag: string): string => {
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
};

const extractNestedTag = (xml: string, parentTag: string, childTag: string): string => {
  const parentContent = extractTag(xml, parentTag);
  return parentContent ? extractTag(parentContent, childTag) : '';
};

const parseNum = (val: string): number => {
  const n = parseFloat(val);
  return Number.isFinite(n) && n > 0 ? Number(n.toFixed(2)) : 0;
};

export const parseXmlInvoice = (xmlContent: string, emailMeta?: { from?: string; subject?: string }): Partial<IncomingEmailOrder> => {
  const emisorBlock = extractTag(xmlContent, 'Emisor');
  const supplierName = extractTag(emisorBlock, 'Nombre') || extractTag(emisorBlock, 'NombreComercial') || extractTag(xmlContent, 'Proveedor') || 'Proveedor por Correo';
  const supplierLegalId = extractNestedTag(emisorBlock, 'Identificacion', 'Numero') || extractTag(xmlContent, 'Cedula') || '';
  const supplierPhone = extractNestedTag(emisorBlock, 'Telefono', 'NumTelefono') || '';
  const supplierEmail = extractTag(emisorBlock, 'CorreoElectronico') || emailMeta?.from || '';

  const invoiceNumber = extractTag(xmlContent, 'NumeroConsecutivo') || extractTag(xmlContent, 'Clave') || extractTag(xmlContent, 'NumeroFactura') || `FAC-MAIL-${Date.now().toString().slice(-6)}`;
  const rawDate = extractTag(xmlContent, 'FechaEmision') || new Date().toISOString();
  const entryDate = rawDate.slice(0, 10);

  const resumenBlock = extractTag(xmlContent, 'ResumenFactura') || xmlContent;
  const subtotalAmount = parseNum(extractTag(resumenBlock, 'TotalVentaNeta') || extractTag(resumenBlock, 'TotalSubtotal') || extractTag(resumenBlock, 'SubTotal'));
  const taxAmount = parseNum(extractTag(resumenBlock, 'TotalImpuesto') || extractTag(resumenBlock, 'TotalImpuestos'));
  const discountAmount = parseNum(extractTag(resumenBlock, 'TotalDescuentos') || extractTag(resumenBlock, 'Descuento'));
  const totalCost = parseNum(extractTag(resumenBlock, 'TotalComprobante') || extractTag(resumenBlock, 'Total')) || (subtotalAmount + taxAmount - discountAmount);

  // Line items extraction
  const items: SupplierOrderItem[] = [];
  const lineRegex = /<LineaDetalle[^>]*>([\s\S]*?)<\/LineaDetalle>/gi;
  let match: RegExpExecArray | null;

  while ((match = lineRegex.exec(xmlContent)) !== null) {
    const lineXml = match[1];
    const name = extractTag(lineXml, 'Detalle') || extractTag(lineXml, 'Descripcion') || `Producto Línea #${items.length + 1}`;
    const sku = extractNestedTag(lineXml, 'CodigoComercial', 'Codigo') || extractTag(lineXml, 'Codigo') || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const qty = Math.max(1, Math.round(parseFloat(extractTag(lineXml, 'Cantidad') || '1')));
    const cost = parseNum(extractTag(lineXml, 'PrecioUnitario') || extractTag(lineXml, 'MontoUnitario'));
    const lineTotal = parseNum(extractTag(lineXml, 'MontoTotalLinea') || extractTag(lineXml, 'SubTotal')) || (qty * cost);

    items.push({
      sku,
      name,
      category: 'Insumos',
      currentStock: 0,
      minStock: 5,
      orderQty: qty,
      cost,
      subtotal: lineTotal,
    });
  }

  return {
    emailFrom: emailMeta?.from || supplierEmail || 'facturacion@proveedor.com',
    emailSubject: emailMeta?.subject || `Factura Electrónica ${invoiceNumber} - ${supplierName}`,
    supplierName,
    supplierLegalId,
    supplierPhone,
    supplierEmail,
    invoiceNumber,
    entryDate,
    subtotalAmount: subtotalAmount || items.reduce((s, it) => s + it.subtotal, 0),
    taxAmount,
    discountAmount,
    totalCost: totalCost || items.reduce((s, it) => s + it.subtotal, 0),
    items,
    status: 'pending',
  };
};

export const generateSampleXmlInvoice = (supplierName = 'Distribuidora Fio Express S.A.', invoiceNum = '00100001010000009842'): string => {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="utf-8"?>
<FacturaElectronica xmlns="https://tribunet.hacienda.go.cr/docs/esquemas/2017/v4.3/facturaElectronica">
  <Clave>50624000310112345678900100001010000009842100000001</Clave>
  <NumeroConsecutivo>${invoiceNum}</NumeroConsecutivo>
  <FechaEmision>${today}T10:30:00-06:00</FechaEmision>
  <Emisor>
    <Nombre>${supplierName}</Nombre>
    <Identificacion>
      <Tipo>02</Tipo>
      <Numero>3101889922</Numero>
    </Identificacion>
    <Telefono>
      <CodigoPais>506</CodigoPais>
      <NumTelefono>88887766</NumTelefono>
    </Telefono>
    <CorreoElectronico>ventas@proveedorexpress.cr</CorreoElectronico>
  </Emisor>
  <DetalleServicio>
    <LineaDetalle>
      <NumeroLinea>1</NumeroLinea>
      <Codigo>MAT-CER-01</Codigo>
      <Detalle>Arcilla Polimérica Blanca 500g</Detalle>
      <Cantidad>20</Cantidad>
      <PrecioUnitario>4500.00</PrecioUnitario>
      <MontoTotal>90000.00</MontoTotal>
      <SubTotal>90000.00</SubTotal>
      <MontoTotalLinea>101700.00</MontoTotalLinea>
    </LineaDetalle>
    <LineaDetalle>
      <NumeroLinea>2</NumeroLinea>
      <Codigo>PIG-RES-05</Codigo>
      <Detalle>Pigmento para Resina Epóxica Pastel</Detalle>
      <Cantidad>15</Cantidad>
      <PrecioUnitario>3200.00</PrecioUnitario>
      <MontoTotal>48000.00</MontoTotal>
      <SubTotal>48000.00</SubTotal>
      <MontoTotalLinea>54240.00</MontoTotalLinea>
    </LineaDetalle>
    <LineaDetalle>
      <NumeroLinea>3</NumeroLinea>
      <Codigo>ACC-LLA-10</Codigo>
      <Detalle>Herrajes de Llavero Dorado Reforzado</Detalle>
      <Cantidad>50</Cantidad>
      <PrecioUnitario>850.00</PrecioUnitario>
      <MontoTotal>42500.00</MontoTotal>
      <SubTotal>42500.00</SubTotal>
      <MontoTotalLinea>48025.00</MontoTotalLinea>
    </LineaDetalle>
  </DetalleServicio>
  <ResumenFactura>
    <TotalVentaNeta>180500.00</TotalVentaNeta>
    <TotalSubtotal>180500.00</TotalSubtotal>
    <TotalDescuentos>0.00</TotalDescuentos>
    <TotalImpuesto>23465.00</TotalImpuesto>
    <TotalComprobante>203965.00</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`;
};
