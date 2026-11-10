import React, { useMemo } from 'react';

// Tabla oficial de 107 patrones Code 128 (B)
// Cada dígito representa el grosor alternado de barras y espacios
const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

interface Barcode128Props {
  value: string;
  height?: number;
  moduleWidth?: number;
  className?: string;
}

export const Barcode128: React.FC<Barcode128Props> = ({
  value,
  height = 48,
  moduleWidth = 2,
  className = '',
}) => {
  const cleanValue = (value || 'SKU-000').trim().toUpperCase();

  const { bars, totalWidth } = useMemo(() => {
    // Código de Inicio B (104)
    const codes: number[] = [104];
    let checksumSum = 104;

    for (let i = 0; i < cleanValue.length; i++) {
      const ascii = cleanValue.charCodeAt(i);
      const val = ascii - 32;
      const safeVal = val >= 0 && val <= 95 ? val : 0;
      codes.push(safeVal);
      checksumSum += (i + 1) * safeVal;
    }

    const checksum = checksumSum % 103;
    codes.push(checksum);
    codes.push(106); // Carácter de Parada Stop (106)

    // Convertir a secuencia de anchos
    let patternStr = '';
    for (const c of codes) {
      patternStr += CODE128_PATTERNS[c] || '212222';
    }

    // Convertir anchos alternados a barras negras
    const barRects: { x: number; width: number }[] = [];
    const quietZone = moduleWidth * 10; // Zona de silencio a los lados
    let currentX = quietZone;
    let isBlack = true;

    for (let i = 0; i < patternStr.length; i++) {
      const w = Number(patternStr[i]) * moduleWidth;
      if (isBlack) {
        barRects.push({ x: currentX, width: w });
      }
      currentX += w;
      isBlack = !isBlack;
    }

    const calculatedTotalWidth = currentX + quietZone;

    return { bars: barRects, totalWidth: calculatedTotalWidth };
  }, [cleanValue, moduleWidth]);

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className={`w-full max-w-full h-auto select-none ${className}`}
      style={{ display: 'block' }}
      aria-label={`Código de barras Code 128: ${cleanValue}`}
    >
      <rect x="0" y="0" width={totalWidth} height={height} fill="#FFFFFF" />
      {bars.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y="0"
          width={bar.width}
          height={height}
          fill="#000000"
        />
      ))}
    </svg>
  );
};
