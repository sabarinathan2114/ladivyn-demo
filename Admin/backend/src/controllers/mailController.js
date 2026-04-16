import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: false,
  logger: false,
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter connection error:", error.message);
  } else {
    console.log("Unified Mail Service is live and ready");
  }
});

/**
 * Internal function to send Order Confirmation to Customer & Admin
 */
export const sendOrderMailInternal = async (orderData) => {
  const { customer_name, email, mobile, address, items, total_amount } =
    orderData;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${item.product_name || "Product"}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.price}</td>
    </tr>
  `,
    )
    .join("");

  const htmlContent = `
    <div style="font-family: serif; color: #1a0a0e; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 20px;">
      <h1 style="text-align: center; color: #d4af37; text-transform: uppercase;">LaDivyn Order Confirmation</h1>
      <p>Dear ${customer_name},</p>
      <p>Thank you for choosing LaDivyn. We have received your order and it is currently being prepared with the utmost care.</p>
      
      <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead style="background-color: #f8f8f8;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: right;">Total Amount</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: right; color: #d4af37;">${total_amount}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px;">Shipping Details</h3>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      
      <p style="margin-top: 30px; font-style: italic; text-align: center; color: #beaca4;">✦ Nature's Masterpiece • Refined by Design ✦</p>
    </div>
  `;

  // 1. Send to Customer
  await transporter.sendMail({
    from: `"LaDivyn Concierge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Order Received - LaDivyn",
    html: htmlContent,
  });

  // 2. Send Alert to Admin
  await transporter.sendMail({
    from: `"Store Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Order from ${customer_name}`,
    html: `<h3>New order placed on the website</h3><p>Check the admin panel for details.</p>${htmlContent}`,
  });

  return { success: true };
};

/**
 * Route Handler: POST /api/mail/contact
 */
export const sendContactMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #d4af37;">New Inquiry from Contact Form</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Regarding:</strong> ${subject}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Inquiry: ${subject}`,
      html: htmlContent,
    });

    res.status(200).json({ success: true, message: "Inquiry sent to admin" });
  } catch (error) {
    console.error("Contact Mail Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Route Handler: POST /api/mail/order (for external fallback if needed)
 */
export const sendOrderMail = async (req, res) => {
  try {
    const result = await sendOrderMailInternal(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Order Mail Route Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
