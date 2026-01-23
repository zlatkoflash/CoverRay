import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { IOrder, IProfile } from "../Interfaces.ts";
import { IStripeCustomer, IStripePaymentIntent, IStripePaymentMethod } from "../InterfacesStripe.ts";
import { CrudService } from "../ZCrud.ts";
import { IOrderFile, ISupabaseUser } from "../interfaceSupabase.ts";
import { ZResend } from "../ZResend.ts";
import { ZOrderEmailTemplates } from "./ZOrderEmailTemplates.ts";

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

export class ZOrder {

  private ordersDb: CrudService<IOrder>;
  private orderFilesDb: CrudService<IOrderFile>;
  private userDb: CrudService<IProfile>;
  private zresend: ZResend;

  constructor() {
    this.ordersDb = new CrudService<IOrder>(supabaseAdmin, "orders");
    this.orderFilesDb = new CrudService<IOrderFile>(supabaseAdmin, "orders_files");
    this.userDb = new CrudService<IProfile>(supabaseAdmin, "profiles");
    this.zresend = new ZResend();
  }

  public async createOrder(loggedUser: ISupabaseUser, payload: {
    image: { publicUrl: string, filePath: string }, //publicUrl is private don't work
    pdf: { publicUrl: string, filePath: string }, //publicUrl is private don't work
    paymentIntent: IStripePaymentIntent,
    paymentMethod: IStripePaymentMethod,
    stripeCustomer: IStripeCustomer,

    templateId: string
  }) {

    const profileUser = await this.userDb.getOneByField<IProfile>("email", loggedUser.email);
    const user_id = profileUser?.id;

    const orderCreated = await this.ordersDb.insert({
      amount: payload.paymentIntent.amount,
      currency: payload.paymentIntent.currency,
      stripe_payment_intent_id: payload.paymentIntent.id,
      stripe_checkout_session_id: payload.paymentIntent.client_secret,
      user_id: user_id as string,
      metadata: payload.paymentIntent.metadata,
      created_at: new Date(), //timestamptz
      updated_at: new Date(),
      template_id: payload.templateId,
      download_count: 0,
      download_url: "", // for pdf
      status: "completed" // pending, completed, failed, if payment don't pass order will not be created at all.
    });
    console.log("orderCreated:", orderCreated);

    const movingImageFileFeedback = await this.moveFileToProductionFolder(
      payload.image.filePath,
      "image",
      orderCreated.id
    );
    const movingPDFFileFeedback = await this.moveFileToProductionFolder(
      payload.pdf.filePath,
      "pdf",
      orderCreated.id
    );


    const emaiLBodyForOrder = await ZOrderEmailTemplates.getTemplate(
      movingImageFileFeedback.url as string,
      movingPDFFileFeedback.url as string
    );
    await this.zresend.sendEmail(
      loggedUser.email,
      `Design Assets: Magazine Cover (Order #${orderCreated.id})`,
      emaiLBodyForOrder
    );

    const emailTemplateForVendor1 = await ZOrderEmailTemplates.getTemplateForVendorForImage(
      movingImageFileFeedback.url as string
    );
    await this.zresend.sendEmail(
      loggedUser.email,
      `Design Assets: Magazine Cover (Order #${orderCreated.id})`,
      emailTemplateForVendor1
    );

    const emailTemplateForVendor2 = await ZOrderEmailTemplates.getTemplateForVendorForPDF(
      movingPDFFileFeedback.url as string
    );
    await this.zresend.sendEmail(
      loggedUser.email,
      `Design Assets: Magazine Cover (Order #${orderCreated.id})`,
      emailTemplateForVendor2
    );

    return {
      orderCreated,
      movingImageFileFeedback,
      movingPDFFileFeedback
    }

  }

  private async moveFileToProductionFolder(
    temporaryFileName: string,
    type: "image" | "pdf" = "image",
    orderId: string
  ) {
    const tempBucket = "temporary";
    const prodBucket = "final-products";

    // Structured path for a scalable architecture
    const destinationPath = `orders/${orderId}/${type}s/${temporaryFileName}`;

    // 1. Move the file using supabaseAdmin (Service Role)
    const { data: moveData, error: moveError } = await supabaseAdmin
      .storage
      .from(tempBucket)
      .move(temporaryFileName, destinationPath, {
        destinationBucket: prodBucket,
      });

    if (moveError) {
      console.error(`[Storage Error] Move failed:`, moveError.message);
      return { error: true, message: moveError.message };
    }

    // 2. Generate a Signed URL that lasts for 1 year (31,536,000 seconds)
    const ONE_YEAR_IN_SECONDS = 31536000;

    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from(prodBucket)
      .createSignedUrl(destinationPath, ONE_YEAR_IN_SECONDS);

    if (signedError) {
      console.error(`[Storage Error] Signed URL failed:`, signedError.message);
      return { error: true, message: signedError.message };
    }

    console.log(`Successfully moved and signed: ${destinationPath}`);
    const dbFile = await this.orderFilesDb.insert({
      order_id: orderId,
      file_type: type as string,
      file_path: destinationPath,
      created_at: new Date().toISOString(),
      // updated_at: new Date()
    });


    // Returns the signed URL to the client
    return {
      success: true,
      url: signedData.signedUrl,
      path: destinationPath,
      dbFile
    };
  }

}