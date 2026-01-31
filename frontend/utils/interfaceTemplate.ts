export interface IKonvaTemplate {
  width: number;
  height: number;
  pages: IKonvaTemplatePage[];
  audios: any[]; // Define specific audio interface if needed later
  unit: "px" | "in" | "mm" | "cm";
  dpi: number;
}

export interface IKonvaTemplatePage {
  id: string;
  width: number;
  height: number;
  background: string;
  bleed: number;
  duration: number;
  children: (IKonvaBaseCanvasItem | IKonvaTemplateImageItem | IKonvaTemplateTextItem)[];
}

/** * Shared properties for every item on the canvas 
 */
export interface IKonvaBaseCanvasItem {
  id: string;
  type: "text" | "image";
  name: string;
  opacity: number;
  visible: boolean;
  selectable: boolean;
  removable: boolean;
  alwaysOnTop: boolean;
  showInExport: boolean;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
  rotation: number;
  animations: any[];
  draggable: boolean;
  resizable: boolean;
  contentEditable: boolean;
  styleEditable: boolean;

  // Filters & Effects
  blurEnabled: boolean;
  blurRadius: number;
  brightnessEnabled: boolean;
  brightness: number;
  sepiaEnabled: boolean;
  grayscaleEnabled: boolean;
  filters: Record<string, any>;

  // Shadow
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowOffset: { x: number; y: number };
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  shadowOpacity: number;

  fill: string;
}

/** * Type-specific for 'image' items
 */
export interface IKonvaTemplateImageItem extends IKonvaBaseCanvasItem {
  // type: "image";
  src: string;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  cornerRadius: number;
  flipX: boolean;
  flipY: boolean;
  clipSrc: string;
  borderColor: string;
  borderSize: number;
  keepRatio: boolean;
  stretchEnabled: boolean;
}


/** * Type-specific for 'text' items
 */
export interface IKonvaTemplateTextItem extends IKonvaBaseCanvasItem {
  // type: "text";
  text: string;
  placeholder: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: "normal" | "italic" | string;
  fontWeight: "normal" | "bold" | number;
  textDecoration: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  fill: string;
  align: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
  strokeWidth: number;
  stroke: string;
  lineHeight: number;
  letterSpacing: number;

  // Background/Box styling
  backgroundEnabled: boolean;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundCornerRadius: number;
  backgroundPadding: number;

  // Text Path / Curve
  curveEnabled: boolean;
  curvePower: number;
}