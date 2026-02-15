/**
 * 
 * @param htmlString 
 * @param holderRef 
 * @param TARGET_WIDTH 
 * @returns 
 * Status of the script:
 * it generate the texts.
 * but, it need to have also background color related to the template
 */


export const generateJSON = async (
  htmlString: string,
  holderRef: React.RefObject<HTMLDivElement>,
  TARGET_WIDTH: number
) => {
  if (!holderRef.current) return;

  // 1. Setup the Stage
  holderRef.current.innerHTML = htmlString;
  await document.fonts.ready;

  const wrapper = holderRef.current.querySelector('.block-wrapper') as HTMLElement;
  if (!wrapper) {
    console.error("Missing .block-wrapper");
    return;
  }

  // RESET STYLES for accurate measurement
  wrapper.style.transform = 'none';
  wrapper.style.position = 'relative';
  wrapper.style.display = 'block';

  const originalWidth = wrapper.getBoundingClientRect().width || 1;
  const SCALE_COEFF = TARGET_WIDTH / originalWidth;
  const wrapperRect = wrapper.getBoundingClientRect();

  // We only care about Images and the Containers that hold our text paragraphs
  const selector = 'div, img, h1, h2, h3, h4, h5, h6';
  const elements = Array.from(wrapper.querySelectorAll(selector));

  const children = elements.map((element, index) => {
    const el = element as HTMLElement;
    const type = el.tagName.toLowerCase();

    // Check if this specific div has DIRECT <p> children
    // This prevents parent divs from re-collecting text already handled by child divs
    const immediatePChildren = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'p');
    const isImage = type === 'img';

    // LOGIC: We process this element if:
    // 1. It's an image
    // 2. It's an H1-H6 (standard text headers)
    // 3. It's a DIV that is the DIRECT parent of <p> tags
    const isTextContainer = immediatePChildren.length > 0;
    const isHeader = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type);

    if (!isImage && !isTextContainer && !isHeader) return null;

    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // --- COORDINATES ---
    const base = {
      id: el.id || `${type}-${index}`,
      x: (rect.left - wrapperRect.left) * SCALE_COEFF,
      y: (rect.top - wrapperRect.top) * SCALE_COEFF,
      width: rect.width * SCALE_COEFF,
      height: rect.height * SCALE_COEFF,
      opacity: parseFloat(styles.opacity) || 1,
      visible: styles.display !== 'none' && styles.visibility !== 'hidden',
      draggable: true,
      selectable: true,
    };

    if (isImage) {
      return { ...base, type: 'image', src: (el as HTMLImageElement).src, rotation: 0 };
    }

    // --- TEXT HANDLING ---
    let textContent = "";

    if (isTextContainer) {
      // Collect text from all paragraphs inside this div. 
      // .innerText will automatically include <span> content inside the <p>.
      textContent = immediatePChildren
        .map(p => (p as HTMLElement).innerText.trim())
        .filter(Boolean)
        .join('\n');
    } else {
      // Standard header or single block
      textContent = el.innerText.trim();
    }

    if (!textContent) return null;

    // Apply CSS Text Transforms
    if (styles.textTransform === 'uppercase') textContent = textContent.toUpperCase();
    if (styles.textTransform === 'lowercase') textContent = textContent.toLowerCase();

    return {
      ...base,
      type: 'text',
      text: textContent,
      fill: styles.color,
      fontSize: parseFloat(styles.fontSize) * SCALE_COEFF,
      fontFamily: styles.fontFamily.replace(/['"]/g, ""),
      fontWeight: isNaN(parseInt(styles.fontWeight)) ? styles.fontWeight : parseInt(styles.fontWeight),
      fontStyle: styles.fontStyle,
      textDecoration: styles.textDecoration,
      align: styles.textAlign === 'center' ? 'center' : (styles.textAlign === 'right' ? 'right' : 'left'),
      verticalAlign: "top",
      lineHeight: parseFloat(styles.lineHeight) / parseFloat(styles.fontSize) || 1.2
    };
  }).filter(Boolean);

  const finalJson = {
    width: TARGET_WIDTH,
    height: wrapperRect.height * SCALE_COEFF,
    scaleUsed: SCALE_COEFF,
    pages: [{
      id: "page1",
      width: TARGET_WIDTH,
      height: wrapperRect.height * SCALE_COEFF,
      children: children,
      background: "#ffffff"
    }]
  };

  holderRef.current.innerHTML = '';
  return finalJson;
};