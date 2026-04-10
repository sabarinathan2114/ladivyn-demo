import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  try {
    const payload = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Convert payload → HTML
    const htmlContent = `
      <h2>New Order Received</h2>
      <p><b>Product:</b> ${payload["Product Name"]}</p>
      <p><b>Quantity:</b> ${payload.Quantity}</p>
      <p><b>Total Price:</b> ₹${payload["Total Price"]}</p>

      <hr/>

      <h3>Customer Details</h3>
      <p><b>Name:</b> ${payload["Customer Name"]}</p>
      <p><b>Email:</b> ${payload["Email Address"]}</p>
      <p><b>Mobile:</b> ${payload["Mobile Number"]}</p>
      <p><b>Address:</b> ${payload["Shipping Address"]}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: payload["Email Address"], // user email
      subject: "Order Confirmation",
      html: "<h3>Your order received ✅</h3>",
    });

    res.status(200).json({
      success: true,
      message: "Order email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
