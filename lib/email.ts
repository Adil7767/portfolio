type ContactPayload = {
  name: string;
  email: string;
  message: string;
  toEmail: string;
};

/**
 * EmailJS — Gmail service `service_hqkafwb`.
 * Templates:
 * - template_26faq7k ("My Default Template"): {{name}}, {{email}}, {{message}}, {{reply_to}}
 * - template_vi2ry3t ("Adil Mustafa"): {{from_name}}, {{reply_to}}
 * Set template "To Email" to {{to_email}} in the EmailJS dashboard for admin-configurable recipient.
 */
export async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return false;
  }

  const templateParams = {
    name: payload.name,
    from_name: payload.name,
    email: payload.email,
    message: payload.message,
    to_email: payload.toEmail,
    reply_to: payload.email,
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[emailjs] send failed:", res.status, detail);
  }

  return res.ok;
}
