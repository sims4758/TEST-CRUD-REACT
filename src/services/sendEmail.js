const API_URL = "http://localhost:3000";

export const sendEmail = async (recipient, subject, html, text) => {
  const token = localStorage.getItem("accessToken");

  const bodyData = {
    recipient: recipient,
    subject: subject,
    html: html,
    text: text,
  };

  try {
    const response = await fetch(`${API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send email: ${errorData.message || response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};
