# Eyvan Kheshti Agent System — Foundation

این پوشه نسخهٔ اول سیستم تولید و انتشار محتوای ایوان خشتی است. هدف آن یک مسیر کم‌هزینه و قابل‌بررسی است:

`موضوع → بررسی Skill و منبع → پیش‌نویس دوزبانه → تأیید انسانی → انتشار`

## وضعیت فعلی

- ساختار، قرارداد ورودی و خروجی، تنظیمات امن و آزمون محلی: آماده
- اتصال زندهٔ Composio، Gemini، Google Drive، Make و GitHub: نیازمند اتصال حساب توسط مالک
- انتشار خودکار: عمداً غیرفعال تا پس از آزمون پیش‌نویس

## فایل‌های مهم

- `config/agent-manager.config.json`: نقش‌ها، مدل، سقف‌ها و اتصال‌های مجاز
- `config/composio-session.template.jsonc`: الگوی Session با کمترین دسترسی
- `schemas/content-job.schema.json`: قرارداد یک سفارش محتوا
- `skills/article-publishing-v1.md`: دستورالعمل اجرایی Writer و Publisher
- `make/eyvan-content-draft-v1.md`: نقشهٔ Scenario در Make
- `scripts/validate-foundation.mjs`: بررسی بدون اتصال حساب

## قانون شروع

هیچ کلید، رمز، کد تأیید یا اطلاعات بانکی در این پوشه ثبت نمی‌شود. متغیرهای محیطی فقط روی Netlify یا محیط امن سرور تنظیم می‌شوند.

## آزمایش محلی

از پوشهٔ اصلی سایت اجرا شود:

```text
node agent-system/scripts/validate-foundation.mjs
```

وقتی اتصال‌ها آماده شدند، Manager فقط یک سفارش آزمایشی با وضعیت `draft` می‌سازد. مرحلهٔ انتشار تنها پس از تأیید مدیر اجرا می‌شود.
