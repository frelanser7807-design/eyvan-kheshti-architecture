# Make Scenario — Eyvan Content Draft v1

## هدف

یک ردیف دارای وضعیت `ready` از Google Sheet به پیش‌نویس قابل‌بررسی تبدیل شود.

## ماژول‌ها

1. **Google Sheets / Watch rows** — فقط Sheet صف محتوا و ستون `status=ready`.
2. **Filter** — `job_id` خالی نباشد و آخرین اجرا برای همان `job_id` وجود نداشته باشد.
3. **HTTP / Make a request** — ارسال Job به آدرس امن Agent Manager.
4. **Google Sheets / Update row** — در موفقیت: `status=needs_review`؛ در خطا: `status=paused` و `error_summary`.

## زمان‌بندی رایگان

هفته‌ای یک بار. این Scenario فقط پس از ثبت یک موضوع آماده اجرا شود.

## کنترل مصرف

- حداکثر دو Job در هفته.
- اگر دو Job پی‌درپی خطا داشتند، Scenario خاموش شود.
- هر Job با `job_id` یکتا ثبت شود تا دوباره‌کاری نداشته باشیم.

## داده‌هایی که نباید در Sheet باشند

API key، رمز، کد تأیید، اطلاعات بانکی یا متن خصوصی مشتری.
