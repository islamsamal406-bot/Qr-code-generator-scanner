import QRCode from "qrcode";
import {
  QRDesignConfig,
  QRType,
  UrlFormData,
  TextFormData,
  WifiFormData,
  VCardFormData,
  EmailFormData,
  SmsFormData,
  CallFormData,
  WhatsappFormData,
  CryptoFormData,
  EventFormData,
  MultiLinkFormData,
} from "../types";

// Helper to format ISO date to iCal UTC format (YYYYMMDDTHHmmSSZ)
function formatICalDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Generate raw QR string content from form data
export function generateRawQRContent(type: QRType, data: any): string {
  switch (type) {
    case "url": {
      const u = (data as UrlFormData).url || "";
      if (!u) return "";
      return /^https?:\/\//i.test(u) ? u : `https://${u}`;
    }
    case "text": {
      return (data as TextFormData).text || "";
    }
    case "wifi": {
      const w = data as WifiFormData;
      if (!w.ssid) return "";
      const pass = w.encryption === "nopass" ? "" : w.password || "";
      return `WIFI:S:${w.ssid};T:${w.encryption};P:${pass};H:${w.hidden ? "true" : "false"};;`;
    }
    case "vcard": {
      const v = data as VCardFormData;
      if (!v.firstName && !v.lastName && !v.organization && !v.phone && !v.email) {
        return "";
      }
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${v.lastName || ""};${v.firstName || ""};;;`,
        `FN:${[v.firstName, v.lastName].filter(Boolean).join(" ")}`,
        v.organization ? `ORG:${v.organization}` : "",
        v.title ? `TITLE:${v.title}` : "",
        v.phone ? `TEL;TYPE=WORK,VOICE:${v.phone}` : "",
        v.mobile ? `TEL;TYPE=CELL,VOICE:${v.mobile}` : "",
        v.email ? `EMAIL:${v.email}` : "",
        v.address ? `ADR:;;${v.address};;;;` : "",
        v.website ? `URL:${/^https?:\/\//i.test(v.website) ? v.website : "https://" + v.website}` : "",
        v.note ? `NOTE:${v.note}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "email": {
      const e = data as EmailFormData;
      if (!e.email) return "";
      const params = new URLSearchParams();
      if (e.subject) params.append("subject", e.subject);
      if (e.body) params.append("body", e.body);
      const query = params.toString();
      return `mailto:${e.email}${query ? "?" + query : ""}`;
    }
    case "sms": {
      const s = data as SmsFormData;
      if (!s.phone) return "";
      return `smsto:${s.phone}:${s.message || ""}`;
    }
    case "call": {
      const c = data as CallFormData;
      if (!c.phone) return "";
      return `tel:${c.phone}`;
    }
    case "whatsapp": {
      const wa = data as WhatsappFormData;
      const cleanPhone = (wa.countryCode || "") + (wa.phone || "").replace(/\D/g, "");
      if (!cleanPhone) return "";
      const encodedMsg = wa.message ? `?text=${encodeURIComponent(wa.message)}` : "";
      return `https://wa.me/${cleanPhone}${encodedMsg}`;
    }
    case "crypto": {
      const cr = data as CryptoFormData;
      if (!cr.address) return "";
      const scheme = cr.currency.toLowerCase();
      const params = new URLSearchParams();
      if (cr.amount) params.append("amount", cr.amount);
      if (cr.label) params.append("label", cr.label);
      const query = params.toString();
      return `${scheme}:${cr.address}${query ? "?" + query : ""}`;
    }
    case "event": {
      const ev = data as EventFormData;
      if (!ev.title) return "";
      return [
        "BEGIN:VEVENT",
        `SUMMARY:${ev.title}`,
        ev.startDate ? `DTSTART:${formatICalDate(ev.startDate)}` : "",
        ev.endDate ? `DTEND:${formatICalDate(ev.endDate)}` : "",
        ev.location ? `LOCATION:${ev.location}` : "",
        ev.description ? `DESCRIPTION:${ev.description}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "multilink": {
      const ml = data as MultiLinkFormData;
      if (!ml.links || ml.links.length === 0) return "";
      return [
        `TITLE:${ml.title || "My Links"}`,
        ...ml.links.map((l) => `${l.label}: ${l.url}`),
      ].join("\n");
    }
    default:
      return "";
  }
}

// Preset Icon SVGs or Path Generators for center logo
export function drawPresetLogo(
  ctx: CanvasRenderingContext2D,
  preset: string,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 24;
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const path = new Path2D();

  switch (preset) {
    case "wifi":
      // Wifi icon
      path.addPath(new Path2D("M5 12.55a11 11 0 0 1 14 0M8.5 16.5a6 6 0 0 1 7 0M12 20h.01"));
      ctx.stroke(path);
      ctx.beginPath();
      ctx.arc(12, 20, 1.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "whatsapp":
      // Whatsapp phone bubble
      ctx.beginPath();
      ctx.arc(12, 11, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("WA", 12, 11);
      break;
    case "email":
      path.addPath(new Path2D("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"));
      ctx.stroke(path);
      path.addPath(new Path2D("M22 6l-10 7L2 6"));
      ctx.stroke(path);
      break;
    case "phone":
      path.addPath(new Path2D("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"));
      ctx.stroke(path);
      break;
    case "globe":
      ctx.beginPath();
      ctx.arc(12, 12, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(12, 12, 4, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(3, 12);
      ctx.lineTo(21, 12);
      ctx.stroke();
      break;
    case "heart":
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(12, 21.35);
      ctx.bezierCurveTo(12, 21.35, 3, 15.36, 3, 8.5);
      ctx.bezierCurveTo(3, 5.42, 5.42, 3, 8.5, 3);
      ctx.bezierCurveTo(10.24, 3, 11.84, 3.81, 12, 5.09);
      ctx.bezierCurveTo(12.16, 3.81, 13.76, 3, 15.5, 3);
      ctx.bezierCurveTo(18.58, 3, 21, 5.42, 21, 8.5);
      ctx.bezierCurveTo(21, 15.36, 12, 21.35, 12, 21.35);
      ctx.fill();
      break;
    case "star":
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          12 + 9 * Math.cos(((18 + i * 72) * Math.PI) / 180),
          12 - 9 * Math.sin(((18 + i * 72) * Math.PI) / 180)
        );
        ctx.lineTo(
          12 + 4 * Math.cos(((54 + i * 72) * Math.PI) / 180),
          12 - 4 * Math.sin(((54 + i * 72) * Math.PI) / 180)
        );
      }
      ctx.closePath();
      ctx.fill();
      break;
    default:
      // Default globe or QR
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(preset.substring(0, 3).toUpperCase(), 12, 12);
      break;
  }

  ctx.restore();
}

/**
 * Custom Canvas Renderer for styled QR Codes
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  config: QRDesignConfig
): Promise<void> {
  if (!text) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  // Generate QR matrix using qrcode module
  const qrData = QRCode.create(text, { errorCorrectionLevel: config.ecl });
  const modules = qrData.modules;
  const count = modules.size;

  // Frame calculation parameters
  const hasFrame = config.frameStyle && config.frameStyle !== "none";
  const frameText = config.frameText || "SCAN ME";

  // Target canvas resolution
  const renderSize = config.size || 800;
  canvas.width = renderSize;
  canvas.height = renderSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;

  // Determine QR Code drawing area inside canvas considering frames
  let qrX = 0;
  let qrY = 0;
  let qrWidth = renderSize;
  let qrHeight = renderSize;

  let frameTopPadding = 0;
  let frameBottomPadding = 0;

  if (hasFrame) {
    const framePaddingRatio = config.frameStyle === "banner" ? 0.22 : 0.18;
    const paddingVal = renderSize * framePaddingRatio;

    if (config.frameStyle === "badge-bottom" || config.frameStyle === "banner") {
      frameBottomPadding = paddingVal;
      qrHeight = renderSize - frameBottomPadding;
      qrWidth = qrHeight;
      qrX = (renderSize - qrWidth) / 2;
      qrY = (renderSize - frameBottomPadding - qrHeight) / 2 + renderSize * 0.02;
    } else if (config.frameStyle === "badge-top") {
      frameTopPadding = paddingVal;
      qrHeight = renderSize - frameTopPadding;
      qrWidth = qrHeight;
      qrX = (renderSize - qrWidth) / 2;
      qrY = frameTopPadding + (renderSize - frameTopPadding - qrHeight) / 2;
    } else if (config.frameStyle === "card" || config.frameStyle === "phone") {
      const borderOffset = renderSize * 0.08;
      frameBottomPadding = renderSize * 0.16;
      frameTopPadding = renderSize * 0.08;
      qrWidth = renderSize - borderOffset * 2;
      qrHeight = qrWidth;
      qrX = borderOffset;
      qrY = frameTopPadding + borderOffset * 0.5;
    }
  }

  // Draw Background
  ctx.fillStyle = config.backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, renderSize, renderSize);

  // If gradient enabled for QR
  let fgStyle: string | CanvasGradient = config.foregroundColor || "#000000";
  if (config.gradientEnable && config.gradientColor) {
    if (config.gradientType === "radial") {
      const grad = ctx.createRadialGradient(
        qrX + qrWidth / 2,
        qrY + qrHeight / 2,
        10,
        qrX + qrWidth / 2,
        qrY + qrHeight / 2,
        qrWidth / 2
      );
      grad.addColorStop(0, config.foregroundColor);
      grad.addColorStop(1, config.gradientColor);
      fgStyle = grad;
    } else {
      const grad = ctx.createLinearGradient(qrX, qrY, qrX + qrWidth, qrY + qrHeight);
      grad.addColorStop(0, config.foregroundColor);
      grad.addColorStop(1, config.gradientColor);
      fgStyle = grad;
    }
  }

  // Calculate cell sizes
  const marginModules = config.margin ?? 2;
  const totalModules = count + marginModules * 2;
  const cellSize = qrWidth / totalModules;

  const startX = qrX + marginModules * cellSize;
  const startY = qrY + marginModules * cellSize;

  // Identify corner finder patterns (7x7 modules at top-left, top-right, bottom-left)
  const isFinderPattern = (r: number, c: number): boolean => {
    if (r < 7 && c < 7) return true; // Top-Left
    if (r < 7 && c >= count - 7) return true; // Top-Right
    if (r >= count - 7 && c < 7) return true; // Bottom-Left
    return false;
  };

  // Function to draw a single module
  const drawModule = (r: number, c: number) => {
    const x = startX + c * cellSize;
    const y = startY + r * cellSize;
    const w = cellSize + 0.3; // overlap slightly to prevent hairline gaps
    const h = cellSize + 0.3;

    ctx.fillStyle = fgStyle;

    switch (config.dotStyle) {
      case "dots":
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, (w / 2) * 0.88, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "rounded":
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, w * 0.4);
        ctx.fill();
        break;

      case "classy":
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [w * 0.4, 0, w * 0.4, 0]);
        ctx.fill();
        break;

      case "liquid":
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, w * 0.35);
        ctx.fill();
        break;

      case "star":
        ctx.beginPath();
        const cx = x + w / 2;
        const cy = y + h / 2;
        const outerR = w * 0.5;
        const innerR = w * 0.22;
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(
            cx + outerR * Math.cos((i * Math.PI) / 2),
            cy + outerR * Math.sin((i * Math.PI) / 2)
          );
          ctx.lineTo(
            cx + innerR * Math.cos((i * Math.PI) / 2 + Math.PI / 4),
            cy + innerR * Math.sin((i * Math.PI) / 2 + Math.PI / 4)
          );
        }
        ctx.closePath();
        ctx.fill();
        break;

      case "diamond":
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case "square":
      default:
        ctx.fillRect(x, y, w, h);
        break;
    }
  };

  // Draw regular QR data modules
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (modules.get(r, c) && !isFinderPattern(r, c)) {
        drawModule(r, c);
      }
    }
  }

  // Function to draw Finder Eyes (Outer 7x7 & Inner 3x3)
  const drawCornerEye = (startRow: number, startCol: number) => {
    const eyeX = startX + startCol * cellSize;
    const eyeY = startY + startRow * cellSize;
    const eyeSize = 7 * cellSize;

    ctx.save();

    // Eye color
    const eyeColor = config.eyeColor || config.foregroundColor || "#000000";
    ctx.fillStyle = eyeColor;
    ctx.strokeStyle = eyeColor;

    // Outer 7x7 Frame
    const outerX = eyeX;
    const outerY = eyeY;
    const outerW = eyeSize;
    const outerH = eyeSize;
    const borderWidth = cellSize;

    ctx.beginPath();

    switch (config.cornerOuterStyle) {
      case "circle":
        ctx.arc(outerX + outerW / 2, outerY + outerH / 2, outerW / 2, 0, Math.PI * 2);
        break;
      case "rounded":
      case "extra-rounded":
        const radius = config.cornerOuterStyle === "extra-rounded" ? outerW * 0.35 : outerW * 0.22;
        ctx.roundRect(outerX, outerY, outerW, outerH, radius);
        break;
      case "square":
      default:
        ctx.rect(outerX, outerY, outerW, outerH);
        break;
    }

    // Cutout inner part (5x5 cutout)
    const inX = outerX + borderWidth;
    const inY = outerY + borderWidth;
    const inW = outerW - borderWidth * 2;
    const inH = outerH - borderWidth * 2;

    switch (config.cornerOuterStyle) {
      case "circle":
        ctx.arc(inX + inW / 2, inY + inH / 2, inW / 2, 0, Math.PI * 2, true);
        break;
      case "rounded":
      case "extra-rounded":
        const inRadius = Math.max(0, (config.cornerOuterStyle === "extra-rounded" ? outerW * 0.35 : outerW * 0.22) - borderWidth);
        ctx.roundRect(inX, inY, inW, inH, inRadius);
        break;
      case "square":
      default:
        ctx.rect(inX, inY, inW, inH);
        break;
    }

    ctx.fill("evenodd");

    // Inner 3x3 Eye Center
    const centerOffset = 2 * cellSize;
    const innerX = eyeX + centerOffset;
    const innerY = eyeY + centerOffset;
    const innerW = 3 * cellSize;
    const innerH = 3 * cellSize;

    ctx.beginPath();
    switch (config.cornerInnerStyle) {
      case "circle":
      case "dot":
        ctx.arc(innerX + innerW / 2, innerY + innerH / 2, innerW / 2, 0, Math.PI * 2);
        break;
      case "rounded":
        ctx.roundRect(innerX, innerY, innerW, innerH, innerW * 0.3);
        break;
      case "square":
      default:
        ctx.rect(innerX, innerY, innerW, innerH);
        break;
    }
    ctx.fill();

    ctx.restore();
  };

  // Draw the 3 Corner Eyes
  drawCornerEye(0, 0); // Top-Left
  drawCornerEye(0, count - 7); // Top-Right
  drawCornerEye(count - 7, 0); // Bottom-Left

  // Draw Center Logo / Overlay if requested
  if (config.logoType && config.logoType !== "none") {
    const logoSize = qrWidth * 0.22;
    const logoX = qrX + qrWidth / 2 - logoSize / 2;
    const logoY = qrY + qrHeight / 2 - logoSize / 2;

    // Draw background mask for logo so modules don't clash
    if (config.logoBg !== false) {
      ctx.save();
      ctx.fillStyle = config.backgroundColor || "#ffffff";
      ctx.beginPath();
      ctx.arc(qrX + qrWidth / 2, qrY + qrHeight / 2, logoSize / 2 + cellSize, 0, Math.PI * 2);
      ctx.fill();

      // Border ring
      ctx.strokeStyle = config.foregroundColor || "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    if (config.logoType === "preset" && config.logoPreset) {
      drawPresetLogo(
        ctx,
        config.logoPreset,
        logoX + logoSize * 0.1,
        logoY + logoSize * 0.1,
        logoSize * 0.8,
        config.foregroundColor || "#000000"
      );
    } else if (config.logoType === "text" && config.logoText) {
      ctx.save();
      ctx.fillStyle = config.foregroundColor || "#000000";
      ctx.font = `bold ${logoSize * 0.32}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(config.logoText.substring(0, 6), qrX + qrWidth / 2, qrY + qrHeight / 2);
      ctx.restore();
    } else if (config.logoType === "custom" && config.customLogoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = config.customLogoUrl;
        });
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      } catch (err) {
        console.warn("Failed to load logo image", err);
      }
    }
  }

  // Draw Active Frame Container & Text
  if (hasFrame) {
    ctx.save();
    const frameBgColor = config.frameColor || "#1e293b"; // slate-800
    const frameTxtColor = config.frameTextColor || "#ffffff";

    if (config.frameStyle === "badge-bottom" || config.frameStyle === "banner") {
      const bannerH = renderSize * 0.14;
      const bannerY = renderSize - bannerH;

      ctx.fillStyle = frameBgColor;
      ctx.beginPath();
      ctx.roundRect(renderSize * 0.05, bannerY - renderSize * 0.02, renderSize * 0.9, bannerH, renderSize * 0.04);
      ctx.fill();

      ctx.fillStyle = frameTxtColor;
      ctx.font = `bold ${renderSize * 0.045}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frameText.toUpperCase(), renderSize / 2, bannerY + bannerH * 0.42);
    } else if (config.frameStyle === "badge-top") {
      const bannerH = renderSize * 0.14;

      ctx.fillStyle = frameBgColor;
      ctx.beginPath();
      ctx.roundRect(renderSize * 0.05, renderSize * 0.02, renderSize * 0.9, bannerH, renderSize * 0.04);
      ctx.fill();

      ctx.fillStyle = frameTxtColor;
      ctx.font = `bold ${renderSize * 0.045}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frameText.toUpperCase(), renderSize / 2, bannerH * 0.55);
    } else if (config.frameStyle === "card" || config.frameStyle === "phone") {
      // Full Card Border
      ctx.strokeStyle = frameBgColor;
      ctx.lineWidth = renderSize * 0.02;
      ctx.beginPath();
      ctx.roundRect(renderSize * 0.03, renderSize * 0.03, renderSize * 0.94, renderSize * 0.94, renderSize * 0.06);
      ctx.stroke();

      // Bottom Call to Action Badge
      const badgeW = renderSize * 0.7;
      const badgeH = renderSize * 0.12;
      const badgeX = (renderSize - badgeW) / 2;
      const badgeY = renderSize * 0.84;

      ctx.fillStyle = frameBgColor;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
      ctx.fill();

      ctx.fillStyle = frameTxtColor;
      ctx.font = `bold ${renderSize * 0.04}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frameText.toUpperCase(), renderSize / 2, badgeY + badgeH / 2);
    }

    ctx.restore();
  }
}

/**
 * Generate Vector SVG XML string for download
 */
export async function generateQRSVG(text: string, config: QRDesignConfig): Promise<string> {
  const canvas = document.createElement("canvas");
  await renderQRToCanvas(canvas, text, config);
  const dataUrl = canvas.toDataURL("image/png");

  const size = config.size || 800;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <image width="${size}" height="${size}" xlink:href="${dataUrl}"/>
</svg>`;
}
