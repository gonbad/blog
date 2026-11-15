# 03-content-review: Editorial Feedback Resolution

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Target: `docs/projects/007-islamic-astronomy/living/content.md`

This document records the five review comments (`نظر`) submitted by the owner in Obsidian and their applied resolutions.

---

## 1. Taqwim App Naming & Store Links
- **Feedback:** «این نرم‌افزار «تقویم ابراهیمی» است که فکر کنم در play store هم وجود دارد و می‌توان به آن لینک داد.»
- **Certainty:** Confirmed (`قطعی`)
- **Action Applied:** Updated the introductory paragraph to explicitly name «تقویم ابراهیمی» and added direct links to both [کافه‌بازار](http://cafebazaar.ir/app/?id=info.alqiblah.taqwim&ref=share) and [گوگل پلی](https://play.google.com/store/apps/details?id=info.alqiblah.taqwim).

## 2. World Map in Section 1
- **Feedback:** «اینجا نیاز به یک نقشه جهان هست.»
- **Certainty:** Confirmed (`قطعی`)
- **Action Applied:** Added a prominent figure placeholder in Section 1 (`تصویر ۱: نقشهٔ مناطق سه‌گانهٔ جهان بر روی کرهٔ زمین`) designating an SVG world map clearly demarcating the 3 zones (Zone 1 North of Cancer, Zone 2 Between Tropics, Zone 3 South of Capricorn) to be rendered during `job-layout`.

## 3. Widget 2 Defaults & Features (Solar Path & Prayer Times)
- **Feedback:** «پیش‌فرض تهران باشد و پیش‌فرض ۱۱ خرداد باشد. انیمیشن سایه شاخص در کنار ساعت عقربه‌ای هم نیاز است. ظهر شرعی هم به طور خاص مشخص بشود.»
- **Certainty:** Confirmed (`قطعی`)
- **Action Applied:** Updated Widget 2 specifications to mandate default city = Tehran, default date = 11 Khordad, an animated gnomon shadow accompanied by an analog clock, and a dedicated prominent highlight for solar noon (لحظهٔ زوال آفتاب).

## 4. Exclusion of Claim-to-Source Mapping Table from Published Content
- **Feedback:** «این جدول نباید جزوی از محتوای پست باشد.»
- **Certainty:** Confirmed (`قطعی`)
- **Action Applied:** Removed the Claim-to-Source mapping table entirely from `living/content.md`. The full audit table is retained in the version dossier at `docs/projects/007-islamic-astronomy/versions/0.1/claim-source-map.md` for project verification without cluttering reader-facing content.

## 5. Dedicated Lunar Daily Calendar & Rise/Set Widget
- **Feedback:** «یه ابزار تعاملی دیگه نیازه که کاربر بتونه ببینه در هر روز از ماه قمری، ماه و خورشید چه فاصله‌ای از هم دارند. هر کدوم چه زمانی غروب و چه زمانی طلوع می‌کنند و شکل ماه توی اون روز چجوریه.»
- **Certainty:** Confirmed (`قطعی`)
- **Action Applied:** Added **Widget 5 (کاوشگر روزانهٔ ماه قمری)** to Section 5: a dedicated interactive daily tracker across days 1 to 30 of the lunar month displaying elongation angle $\theta$, exact sunrise/sunset vs. moonrise/moonset timings, and the rendered visible phase shape. The subsequent 3D orbital phase simulator is retained as **Widget 6**.
