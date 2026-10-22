
const MODEL = "gemini-3.8-flash";
const MAX_MESSAGES = 20;
const MAX_CHARS = 8000;

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "طريقة الطلب غير مدعومة." }, { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({
      error: "لم يتم إعداد مفتاح Gemini بعد."
    }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "صيغة الطلب غير صحيحة." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 ||
      body.messages.length > MAX_MESSAGES) {
    return Response.json({ error: "عدد الرسائل غير صالح." }, { status: 400 });
  }

  const contents = [];
  for (const item of body.messages) {
    if (!item || !["user", "model"].includes(item.role) ||
        typeof item.content !== "string" ||
        item.content.length === 0 || item.content.length > MAX_CHARS) {
      return Response.json({ error: "إحدى الرسائل غير صالحة." }, { status: 400 });
    }
    contents.push({
      role: item.role,
      parts: [{ text: item.content }]
    });
  }

  if (contents[contents.length - 1].role !== "user") {
    return Response.json({ error: "يجب أن تنتهي المحادثة برسالة من المستخدم." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "أنت NOVA AI، مساعد ذكي وودود. أجب بلغة المستخدم، واستخدم العربية المصرية عندما يكتب بها. كن واضحًا ودقيقًا."
            }]
          },
          contents,
          generationConfig: { maxOutputTokens: 2048 }
        })
      }
    );

    const result = await upstream.json();
    if (!upstream.ok) {
      return Response.json({
        error: "خدمة Gemini لم تقبل الطلب. راجع المفتاح وإعدادات Google AI Studio."
      }, { status: 502 });
    }

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return Response.json({ error: "لم يرجع النموذج إجابة نصية." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch {
    return Response.json({ error: "تعذر الوصول إلى خدمة الذكاء الاصطناعي." }, { status: 502 });
  }
};
