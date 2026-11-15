# Idea input — آژانس استخدام ایجنت‌ها (کارگشا، Rehearsal #4، داخلی)

این سند ورودی `/idea-core` برای `04-agent-agency` است (`is_rented=False`).

## نقش
آژانس استخدام ایجنت‌ها (داخلی). یک ربات بله برای دو دسته کاربر انتهایی: توسعه‌دهندگان (عرضه) و کارفرمایان (تقاضا).

## عرضه
دریافت آدرس `/broker/mcp` و توکن → بررسی مانیفست → ثبت `unverified` → لینک عمیق → اعلان فوری به کانال مدیر.

## تقاضا
جست‌وجو در `approved` (یا `unverified` با لینک)، پرسش پیش از خرید (`ask_presales_question`)، شارژ کیف پول (`bale_wallet`/`card_ocr`)، استخدام (`create_employer` + `set_employer_budget_cap`)، پیکربندی کامل (پرسونا، تنظیمات، BotFather/OTP، وب‌هوک اعلان).

## مدیریت (`/employer` در کدو)
پرسونا، توکن ربات، کانال اعلان + `@employer_tool`: `list_unverified_agents`، `approve_listed_agent`، `suspend_listed_agent`، `show_broker_payables`، `record_developer_payout`.
