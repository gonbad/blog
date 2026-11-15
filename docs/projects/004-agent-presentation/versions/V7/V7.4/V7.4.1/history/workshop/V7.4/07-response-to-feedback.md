# V7.4 — Response to the first presentation feedback

Date: 2026-11-04  
Input: [06-feedback.md](06-feedback.md).  
Status: Diagnosis and correction approach. Presentation repairs have not been applied in this turn. This document corrects the readiness assessment in [04-presentation-build.md](04-presentation-build.md).

## My assessment

Your criticism is justified. You liked the light visual style, but the opening did not let you understand the subject. I delivered a deck whose explanations and demonstrations were inadequate, and I called it ready. I’m sorry.

I prioritized layout, topic coverage, and completing the slide list. I compressed teaching into headings and descriptions of what should happen. Consequently, the audience sees conclusions before the examples that would make them meaningful. The approved outline did not relieve me of the responsibility to write an understandable presentation.

The repair needs to preserve the visual work you approved and rebuild the explanatory sequence. It also needs to correct actual implementation defects. Changing a few titles will not resolve the missing examples and causal links.

## What your feedback identifies

| Feedback | What went wrong | Required correction |
|---|---|---|
| Abrupt switches between light and dark hurt the eyes. | I introduced a visual treatment that makes navigation and emphasis physically disruptive. | Use a light canvas throughout: maps, dividers, examples, and closing pages. Put darker photographs inside the light composition rather than changing the whole slide to a dark screen. Keep the approved typography and light palette. |
| “Answering / doing” does not explain the difference. | I presented category labels and claims that work had happened. The audience never sees enough of either experience to understand the distinction. | Show the same request receiving an actual advice-only answer, then show the assistant carrying the task through. Derive the distinction from those examples. |
| The travel phone is too small and the conversation is vague. | The main example is visually secondary. Its messages narrate the author’s plan instead of enacting a conversation. | Give the conversation most of the available height. Show questions, user answers, concrete options, confirmation, execution, and usable sample downloads. |
| “Service” in slide 6 is unclear. | I introduced an abstract component before giving it a recognizable referent. | Name a travel service, such as Ali Baba, and show what request it receives and what options it returns. Then explain that it is the external service in the diagram. |
| The scheduled-agent topic has no useful connection to the opening. | I promoted a Codo design discussion into audience content. It interrupts the travel example before the audience understands it. | Remove the scheduled-job teaching from the presentation and retain it in Codo. Check the later timer examples too, including current slides 56 and 103. |
| The model chapter begins without prerequisites. | “Inputs,” “outputs,” “layers,” and “weights” arrive together with no concrete task. | Begin with familiar earlier AI applications, establish one specific recognition task, identify its actual input and output, and only then introduce a network. |
| The network control does not demonstrate learning. | The picture and the changing number are disconnected. There is no training example, target answer, error, or weight update. | Build one small, coherent learning demonstration whose inputs, predictions, corrections, weight changes, and later outputs are visibly connected. |
| Slide 8 says “undefined.” | This is a real rendering bug that my verification missed. | Correct the duplicate function name and check rendered content, not just browser errors and element boundaries. |
| Temperature and candidate probabilities were useful in the old deck. | I removed explanatory material that helped make token generation understandable. | Restore the candidate-word distribution and temperature demonstration after explaining prediction. |

The opening slide can stay. The light style can stay. The material around them needs substantial rewriting.

## What I verified in the delivered code

I reproduced these behaviors in Chrome against the current local presentation.

**Slide 8 really renders `undefined`.** In [deck.js](../../../presentation/deck.js), two functions are named `overview()`: one is intended to render the overview slide; the later one populates the search dialog and returns no slide HTML. The later declaration takes precedence, so the slide renderer receives `undefined` and inserts it into the page. The browser reports no JavaScript exception. That explains how the defect passed my “no console errors” check.

**The travel sequence is incomplete.** At its final step, the rendered conversation contains one user request followed by four assistant messages. It has no user reply specifying the budget, no concrete itinerary, no user authorization, no completed booking, and no download links. The phone is 440 design pixels tall. “Options were found” and “the proposal is ready” announce events without showing their substance.

**The neural-network picture is unrelated to the slider calculation.** Moving the slider to `2` changed the displayed percentage from 65% to 88% in my reproduction. The SVG remained unchanged. The handler computes a percentage from the slider value; it does not run the depicted network or update it through learning. There is also no real input example or expected answer. A changing number cannot teach the relationship the slide claims to illustrate.

These findings support your experience. Whether a small percentage visibly changes is secondary to the absence of an intelligible experiment.

## How the opening should actually teach

The first demonstration should let the audience follow a complete task before we take the system apart.

### A conversation with actual content

For example, using clearly illustrative prices and options:

| Speaker | What appears in the conversation |
|---|---|
| User | «پنجشنبه می‌خواهم بروم مشهد و جمعه برگردم. بلیت و هتل را هماهنگ کن.» |
| Agent | «برای چند نفر؟ حدود بودجه‌ات چقدر است؟ قطار را ترجیح می‌دهی یا هواپیما؟» |
| User | «یک نفر، قطار. برای بلیت رفت‌وبرگشت و یک شب هتل، تا هشت میلیون تومان.» |
| Agent | «پنجشنبه صبح حرکت کنی و جمعه شب برگردی مناسب است؟» |
| User | «بله.» |
| Agent | Two concrete option cards appear, with departure and return times, a named hotel, one-night accommodation, and total cost. For example: option A, Thursday 07:00 outward / Friday 20:00 return, total 6.2 million toman; option B, different times and hotel, total 7.4 million. |
| User | «گزینهٔ اول را می‌خواهم.» |
| Agent | «پس بلیت رفت پنجشنبه ساعت ۷، برگشت جمعه ساعت ۲۰ و یک شب اقامت در هتلِ گزینهٔ اول؛ جمعاً ۶ میلیون و ۲۰۰ هزار تومان. رزرو کنم؟» |
| User | «بله، رزرو کن.» |
| Agent | «رزرو انجام شد.» Buttons provide the sample outward ticket, return ticket, and hotel voucher. |

The sample downloads should open actual local demonstration documents. The dialogue needs enough screen space to read comfortably and advance through meaningful exchanges. Scrolling should support that exchange, rather than compensate for an unnecessarily small phone.

Next, pause at a specific event the audience has just seen: **«قیمت و موجودی را از کجا آورد؟»** Show a concrete request going to the named travel service and options coming back. Now “model,” “harness,” and “external service” have something visible to refer to.

Then derive the model/harness explanation from that sequence. The security question about who can authorize a booking can return when the audience understands what execution means. The scheduled-job detour should disappear. The first route map should summarize an understandable direction, and every route map should render correctly on the same light background.

### A model introduction with an actual task

The model chapter needs its own explanatory bridge:

1. Show that useful AI existed before conversational assistants: recognizing a handwritten digit or a face is an understandable example. A long history timeline is unnecessary.
2. Choose one small task and stay with it. For instance, distinguish two handwritten digits drawn on a grid.
3. Label the input explicitly: these pixel values. Label the output explicitly: the predicted digit.
4. Introduce the network as a mechanism for making that prediction. Introduce weights through their effect on the same example.
5. Demonstrate learning: make a prediction, reveal the correct label, show the error, update the weights, and repeat the prediction. The numbers, diagram, and result must agree.
6. Connect this idea to predicting a continuation of text. Now show candidate words and their probabilities.
7. Restore temperature as a control over the distribution used for selection. Show the distribution and sampled choices changing together. Temperature should not be presented as a guarantee of factual correctness.

The network example must distinguish a signed weight value from an output probability. A label such as «وزن» beside “65%” obscures that distinction. Manual weight adjustment and learning should also be visibly different operations.

## Why the previous checks were insufficient

My checks established some mechanical facts: local files loaded, fonts and images were available, controls changed state, and selected elements did not overflow. They did not establish that a beginner could understand the presentation. I overstated what those checks justified.

Three specific weaknesses are now evident:

- A page containing `undefined` can have no console error and no clipped text. Visiting every page did not prove that every page contained its intended explanation.
- Testing a slider by checking that its number changes did not establish that it represents the network or demonstrates learning.
- Clicking through a conversation did not establish that it actually contains the requested questions, answers, confirmation, execution, and result.

Verification needs explicit content conditions as well as interaction checks. For the travel example, those conditions are the complete exchange and working sample artifacts. For the network, they are a defined input, target, meaningful computation, visible update, and consistent result. For every slide, I need to inspect what a learner actually receives.

## What should change in the repair process

I should rebuild the opening and model fundamentals as a complete, watchable teaching sequence, then audit the rest of the deck for the same failures: undefined terms, examples replaced by summaries, missing intermediate steps, decorative controls, and internal planning material leaking into audience content.

For each new concept, the review should answer: **What question has arisen? What concrete thing is being shown? What does the audience already know? What new understanding does this screen add?** If those answers are missing, the slide needs rewriting even if its layout is attractive.

The next quality judgment must come from reading and operating the presentation in order as a newcomer, alongside the technical checks. You should not have to discover the same pattern repeatedly across the remaining slides. The light visual system provides a foundation; the work now required is to make the explanations earn their place on it.
