export async function onRequest(context) {
  const { request, next } = context;

  const url = new URL(request.url);
  const path = url.pathname;

  // تجاهل ملفات الأصول + مسارات خاصة
  const isAsset =
    path.startsWith("/assets/") ||
    path.startsWith("/images/") ||
    path.startsWith("/css/") ||
    path.startsWith("/js/") ||
    path.includes("."); // أي ملف بامتداد

  if (isAsset) return next();

  // لو المستخدم اختار لغة قبل كده (كوكي)
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)lang=(ar|en)\b/);
  const preferred = m?.[1];

  if (preferred) {
    // لو اختار ar وهو في / => وده أول مرة بعد تنظيف اللينك، نوديه للعربي
    if (preferred === "ar" && !path.startsWith("/ar/")) {
      return Response.redirect(new URL("/ar/", url.origin), 302);
    }
    if (preferred === "en" && path.startsWith("/ar/")) {
      return Response.redirect(new URL("/", url.origin), 302);
    }
    return next();
  }

  // Option A: أول لغة فقط
  const al = request.headers.get("Accept-Language") || "";
  const first = al.split(",")[0]?.trim().toLowerCase() || "";
  const firstIsArabic = first.startsWith("ar");

  // Default English هو /
  if (firstIsArabic && !path.startsWith("/ar/")) {
    return Response.redirect(new URL("/ar/", url.origin), 302);
  }

  return next();
}