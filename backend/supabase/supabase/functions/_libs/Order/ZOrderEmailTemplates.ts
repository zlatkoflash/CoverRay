export class ZOrderEmailTemplates {

  public static async getTemplate(DOWNLOAD_URL: string, DOWNLOAD_URL_PDF: string) {
    return `<p>Hello,</p>

<p>Great news—your magazine cover has been finalized and is ready for the spotlight.</p>

<p><strong>Order Summary:</strong></p>
<ul>
  <li>Product: Magazine Cover Created</li>
  <li>Quantity: 1</li>
  <li>Total Price: $PRICE_HERE</li>
</ul>

<p>You can view and download your high-resolution files here:</p>
<p><a href="${DOWNLOAD_URL}">Download Your Magazine Cover</a></p>
<p><a href="${DOWNLOAD_URL_PDF}">Download Your Magazine Cover PDF</a></p>

<p>Thank you for trusting us with your vision. We don't take it lightly.</p>

<p>Best,<br>
The Team</p>`;
  }



  public static async getTemplateForVendorForImage(DOWNLOAD_URL: string) {
    return `<p>Hello,</p>

<p>A new print order is ready for processing.</p>

<p><strong>Order Details:</strong></p>
<ul>
  <li><strong>Order ID:</strong> $ORDER_ID</li>
  <li><strong>Asset Type:</strong> High-Resolution Magazine Cover (Image)</li>
  <li><strong>Total Paid:</strong> $TOTAL_PRICE</li>
</ul>

<p><strong>Print File:</strong></p>
<p><a href="${DOWNLOAD_URL}">Download High-Res Image for Printing</a></p>

<p>Please confirm once this has been sent to the queue.</p>

<p>Thanks,<br>
Production Team</p>`;
  }

  public static async getTemplateForVendorForPDF(DOWNLOAD_URL: string) {
    return `<p>Hello,</p>

<p>Please find the PDF document ready for production below.</p>

<p><strong>Production Specifications:</strong></p>
<ul>
  <li><strong>Order ID:</strong> $ORDER_ID</li>
  <li><strong>Format:</strong> PDF Document</li>
  <li><strong>Generated:</strong> $DATE</li>
</ul>

<p><strong>Production File:</strong></p>
<p><a href="${DOWNLOAD_URL}">Download Print-Ready PDF</a></p>

<p>Please check the bleed and trim settings before final output.</p>

<p>Best,<br>
Operations</p>`;
  } //function  getTemplateForVendorForImage

}