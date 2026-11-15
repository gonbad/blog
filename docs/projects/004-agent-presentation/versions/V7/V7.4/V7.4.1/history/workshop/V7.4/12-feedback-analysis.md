# V7.4 — Analysis of the second presentation feedback

Date: 2026-11-04  
Inputs: [11-feedback.md](11-feedback.md), the subsequent chat feedback about development/runtime model choice and the trust ladder, and the [current presentation](../../../presentation/index.html).  
Status: Analysis and proposed revision; this document does not implement the slide changes.

All slide numbers below refer to the **current visible content counter**, excluding route maps. Internal IDs are included where useful because reordering will change the visible numbers.

## 1. The central problem

The feedback identifies a problem in the structure, beyond the wording or visuals. The previous repair made individual examples more concrete, but continued to mix three different questions:

1. **What does a model learn, compute, and sometimes get wrong?**
2. **Which model and access arrangement should we choose?**
3. **How does software use that model, execute work, and enforce limits?**

There is also a fourth question: **How should we work with a coding assistant to build that software?** It belongs in the construction part of the talk, rather than inside the explanation of model errors or subscription pricing.

A blue question at the bottom of a page cannot repair a transition between concepts that belong to different levels. The next revision needs a clear assignment of material to chapters, followed by new transitions and visuals that serve that assignment.

The additional chat feedback refines this boundary. The **choice of models for building versus running an agent belongs in the model chapter**, as does the **runtime trust ladder**. Showing a coding assistant editing files, constructing the harness, or executing tests remains construction material. Likewise, choosing a provider according to trust belongs in model selection; enforcing permissions belongs in the harness.

## 2. Decisions extracted from the feedback

| Feedback                                                                                         | Assessment and revision direction                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The digit examples and the travel evaluation cases are datasets.                                 | Correct, with different purposes. Explicitly name the training dataset and the evaluation dataset; explain their relationship without treating training performance as independent evaluation.      |
| Connect the small network's parameters to a language model's parameters.                         | Correct in principle. Add the missing numerical-representation/model-computation bridge; explain the architectural differences and avoid unsupported parameter counts for named proprietary models. |
| Add vectors, embeddings and cosine similarity to RAG.                                            | Adopt. Teach representation before similarity, then show retrieval. Use a calculable 3D example and explain that production dimensions depend on the embedding model.                               |
| Distinguish the access seller from the company hosting inference.                                | Adopt. Separate creator, model, customer-facing access service/router, and inference host. These roles can coincide or be separate.                                                                 |
| The company logos are wrong.                                                                     | The code uses generic technical icons beside company names. They can be mistaken for logos and should be removed from the company cards, or replaced with authentic local assets.                   |
| Give each of the eight companies its own model-selection slide.                                  | Adopt the eight-card structure. Each card should explain a few relevant model choices and their uses, rather than listing releases or repeating logos.                                              |
| Remove current slide 35 from the model chapter.                                                  | Move its model-as-adversary/security material to the harness security section. Preserve the concept, which earlier feedback explicitly requested.                                                   |
| Move section 2.2, context/knowledge/tools, into the harness.                                     | Adopt the requested teaching placement. Preserve the distinction between a model limitation and the software mechanism used to address it.                                                          |
| Add cache and growing input to the cost example.                                                 | Necessary. The current calculator assumes identical independent calls and cannot explain an accumulating conversation.                                                                              |
| Explain subscription versus pay-as-you-go before listing products.                               | Adopt. Start with payment mechanisms and constraints, then access services and short price comparisons.                                                                                             |
| Subscription pages should show the plans, prices and limits, rather than file-editing workflows. | Adopt. The current Claude Code/Codex/Antigravity/Cursor examples answer the wrong question for this section.                                                                                        |
| OpenCode Go and Zen should illustrate subscription and usage billing.                            | Correct distinction. Keep the OpenCode client separate from its optional access products; account for current documentation's Console naming.                                                       |
| Rename the last model subsection and move it before model selection.                             | Use **«اشتباهات رایج مدل‌های زبانی»**. Show failure types there; move editing, staged construction and executable verification to the construction subsection.                                      |
| Explain two model roles: building the agent and running it.                                      | Keep in model selection. Show why capable development assistance and economical repeated serving can lead to different choices. Cost remains subject to adequate quality and task requirements.     |
| Keep the trust ladder before subscriptions/cost.                                                 | Keep in model selection, using the requested four-level preference. This supersedes any interpretation that would move the whole trust ladder into security.                                        |
| Apply the same corrections to similar problems later in the deck.                                | Audit later ownership boundaries and repetition as well as the pages explicitly named. Moving a page must not create a duplicate explanation downstream.                                            |

## 3. Scientific clarifications

### Datasets: examples, learning, and evaluation

The current [learning.js](../../../presentation/learning.js) contains **12 labeled examples**, six zeroes and six ones. One image is one sample; the collection of images and labels is the dataset. Each input has 25 pixel values. These examples are used by `train()`, and the displayed loss is measured on the same examples. That is a small **training dataset**. It does not establish performance on unseen handwriting.

The audience should see a contact sheet of the twelve images with their labels, then understand: «این‌ها نمونه‌هایی هستند که مدل از آن‌ها یاد می‌گیرد.» A separate, unseen example can illustrate evaluation. If the demonstration still measures only its taught examples, label that measurement accurately rather than presenting a general accuracy claim.

Current visible slide 32, internal ID `27`, contains three travel requests and expected behaviors. This is the beginning of an **evaluation dataset**. A useful explanation adds the checking rule: input → expected answer or criterion → actual model behavior → score. For open-ended tasks, the expected result may be a rubric or constraint, rather than one exact sentence. An evaluation also needs consistent prompts, tool conditions, settings and metrics; the dataset alone is not the entire evaluation procedure. This is consistent with [OpenAI's evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices).

One subtlety matters: a test involving tool execution can evaluate the model **inside an agent configuration**, not just its weights. For a fair model comparison, keep the surrounding conditions fixed and identify what is being scored.

### Parameters and the bridge to language models

The implemented teaching network has **108 connection weights + 6 biases = 114 trainable parameters**. The earlier parameter-count correction remains valid. Training changes those numbers; ordinary inference uses the trained values without retraining them for every question.

The proposed language-model explanation is broadly right, but should be stated more precisely:

`text → tokens and token IDs → numerical vectors for the sequence → trained model → scores for candidate next tokens → probabilities → selection → append the selected token → repeat`

The whole sentence is not necessarily compressed into a single fixed vector before generation. A transformer processes numerical representations of a token sequence and their relationships. Its architecture is considerably different from our tiny fully connected digit classifier. The shared principle is learned numerical parameters transforming numerical inputs into predictions. The original [Transformer paper, section 3.4](https://papers.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf) describes token embeddings and the output transformation into next-token probabilities.

The visual should connect the already approved network and probability examples, rather than introduce an unexplained wall of transformer blocks. Keep token, vector, parameter and probability distinct: the input vector changes with the input; the trained parameters are reused; the output probabilities change with the context. “Next token” is more accurate than “next word.”

Some language models have hundreds of billions of parameters; that is not a universal size, and more parameters do not automatically mean a better choice for every task. Use a published open-model count if a concrete large number is needed. Do not invent the parameter counts of Astra, Claude or another model whose relevant count is undisclosed.

### Embeddings, angles and RAG

Teach this in the relocated RAG subsection:

1. Split documents into useful passages and compute an embedding for each passage.
2. Compute an embedding for the question with a compatible embedding model.
3. Compare vectors, select relevant **authorized** passages, and place their text beside the question.
4. Let the language model answer using that supplied text.

This is the intended retrieval-plus-generation mechanism; the [original RAG paper](https://arxiv.org/abs/2005.11401) provides its research foundation. The permission filter is an application requirement of this workshop.

For the geometric explanation, show a question vector and two document vectors from a common origin. Display the angle and calculate:

`cosine similarity = (q · d) / (||q|| × ||d||)` — the normalized dot product, as defined in the [scikit-learn reference](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html).

For nonzero vectors, 0° gives 1, 60° gives 0.5 and 90° gives 0. A smaller angle means more similar directions. Cosine does not measure vector length or guarantee that a retrieved statement is true. It is one retrieval technique, not a requirement for every RAG implementation.

Use actual toy 3D coordinates for the interactive drawing, so moving a vector changes the calculated angle, score and ranking together. Label it as a teaching example. A projected picture of real high-dimensional embeddings must not imply that its visible angle necessarily equals the original high-dimensional score.

There is no single “RAG vector dimension.” For concrete examples, OpenAI documents default dimensions of **1,536** for `text-embedding-3-small` and **3,072** for `text-embedding-3-large`, with configurable shortening. Other embedding models differ. Cite the chosen example rather than guessing “several thousand.” [Official embedding documentation](https://developers.openai.com/api/docs/guides/embeddings).

Also distinguish a retrieval embedding for a passage from the token representations inside a generative model. They are related numerical ideas, not interchangeable objects. Computing embeddings does not retrain the answering model on the documents.

## 4. Model selection, access roles, and trust

### Creator, router and host are different roles

Current slide 28, internal ID `23`, stops at model/creator/host. Expand the access path:

`our application → customer-facing access service / router → inference host → running model`

The creator is associated with the model's development; it is not automatically another recipient of every prompt. For example, self-hosting a published model does not inherently send its inputs back to its creator. Conversely, buying access through an intermediary can introduce an additional processor even when the model's name is unchanged.

Use **«واسطهٔ دسترسی / روتر»** and **«میزبانِ اجرای مدل»** as audience terms. A router may select among hosts; a reseller may simply forward to one upstream service. Do not call every multi-model product a router without checking its actual behavior. The same company can perform several roles.

The requested privacy implication is valid: examine the complete processing route. However, processing access, retaining text and using it for training are separate claims. [OpenRouter's privacy policy](https://openrouter.ai/privacy/) explicitly describes forwarding inputs to selected or automatically routed model providers and notes differing provider practices. That supports a concrete intermediary example. A GapGPT diagram should use a verified route for the particular product/API, rather than inventing its upstream host. Its name alone does not establish that route.

Keep the short role diagram in model selection. Detailed controls over sensitive data and recipients remain in the harness security section.

### Eight company cards should explain choices

Replace current slides 29–30 with one concise card for each already requested company: **OpenAI, Anthropic, Google, Meta, Z.ai, Alibaba, Xiaomi and DeepSeek**. Each should have the same useful structure: family → a few relevant models/variants → typical strengths → what to compare on our evaluation dataset. Use plain company names unless authentic logo assets are obtained.

Two examples are already supported by current primary documentation:

| Company   | Practical distinctions for the card                                                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI    | Astra for demanding work; Sol for capability/cost balance; Terra for visual/computer interaction and scoped work; Luna for focused, frequent tasks. Use explicit version labels in the final card. [Official model-selection guide](https://developers.openai.com/api/docs/guides/model-selection). |
| Anthropic | Fable for demanding reasoning and extended agent work; Opus for substantial coding/knowledge work; Sonnet for a speed/capability balance; Haiku for high-volume, latency-sensitive tasks. [Official model overview](https://platform.claude.com/docs/en/models/overview).                           |

These are starting distinctions, not measured guarantees for our application. Verify the remaining six cards against their creators' current documentation before implementation; this analysis has not completed that full model inventory. Do not infer a variant's capabilities just from names such as Max, Flash, Pro or Code.

The takeaway from model mistakes should be: **compare models on the relevant errors, quality and cost**. A more capable model may reduce measured failures; choosing one does not eliminate the need for software boundaries.

### Two roles: a model for building and a model for serving

This additional feedback supplies a good bridge into payment and cost:

| Role                   | Work and selection emphasis                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Building the agent** | Design, implementation, difficult debugging and review. Start with sufficiently capable assistance; avoiding expensive development mistakes can justify higher model cost. Smaller, bounded subtasks can still use a cheaper model.         |
| **Running the agent**  | Repeated interactions with actual users. Choose the least expensive configuration that meets the required quality, latency, data-handling and task-sensitivity criteria. A cheap request that fails the task is not necessarily economical. |

Show two separate model boxes around the same project: one helps produce the application; the other is called by the deployed application. They may use different models and accounts, but need not. This is a **selection explanation**, so it belongs in the model chapter. File-editing demonstrations and build/test procedures belong later.

### The requested runtime trust ladder

Preserve the following preference order in model selection, before subscriptions/cost:

1. **A model we developed and trained ourselves.**
2. **An open-weight model we host ourselves.**
3. **API access to a model/service from a friendly country.**
4. **API access to a model/service from an adversarial country, as the last option.**

Present this as a preference for control, independence and trust, adjusted to the sensitivity of the deployed task. It is not an instruction that every workshop participant must train a foundation model before using an API. A more controlled option must still be capable enough to perform the job.

Use the requested country-category labels without inventing a country list. Country alignment alone is not a technical guarantee: creator, actual inference operator, intermediary, data handling and available controls remain relevant. Likewise, developing or hosting a model ourselves does not prove its behavior correct. These distinctions preserve the model-as-adversary material rather than contradicting it.

The visual can show four rungs, with two adjacent indicators: **control over the model/execution** and **external processing exposure**. Its purpose is to make the runtime selection preference clear, not to pretend that all risks collapse into one numeric score.

The resulting transition is: «برای ساخت و اجرا چه مدلی مناسب است؟ به کدام مسیرِ پردازش اعتماد می‌کنیم؟ حالا دسترسی به آن را چطور می‌خریم و هزینه‌اش را چطور حساب می‌کنیم؟»

## 5. Subscriptions, usage billing, and cache

### Teach the payment mechanisms first

Start section 2.4 with **«اشتراک یا پرداخت به‌اندازهٔ مصرف؟»**:

- Subscription: a recurring price for specified access/allowance, with applicable model restrictions, reset windows and overage conditions.
- Pay-as-you-go: charges related to measured usage; rates and limits depend on the service and model.

Do not state that subscriptions are always cheaper. Their effective value depends on eligible models, usable allowance and actual workload. Also, an API key is an access credential, not a billing category: subscription products can provide API access too.

Then show the specific usage-billed routes, the growing-input/cache example, and a compact subscription comparison. OpenRouter and GapGPT can be discussed as access services where the relevant offering is verified; do not imply every offering from either service uses the same billing mechanism.

For OpenCode, distinguish the client from its optional access products. The official [Go documentation](https://opencode.ai/v2/docs/console/go/) describes monthly subscription plans. The URL historically labeled [Zen](https://opencode.ai/docs/zen) currently redirects to Console Models, whose page describes usage billing. This supports the feedback's Go/subscription versus Zen/PAYG distinction, with a naming note for the current documentation. It does not make the OpenCode client itself a required subscription.

### Correct the cost model, not just the caption

In [story.js](../../../presentation/story.js), the current `cost-lab` calculates:

`calls × (2,000 input tokens × $2/M + 500 output tokens × $8/M)`

That explains multiple independent equal-sized calls. It does not model a continuing conversation. The replacement should show input growing as retained earlier input, prior assistant output, new user text and, where applicable, tool results enter later context.

A simple two-round example can use **hypothetical rates**, with no cache-write charge assumed for this illustration:

| Round | Input        | Output     | What changed?                                                    |
| ----- | ------------ | ---------- | ---------------------------------------------------------------- |
| 1     | 2,000 tokens | 500 tokens | Initial context.                                                 |
| 2     | 2,700 tokens | 300 tokens | 2,000 retained input + 500 earlier output + 200 new user tokens. |

At illustrative rates of $2/M uncached input, $0.50/M cached input and $8/M output, round 2 costs **$0.0078 without a cache hit**, or **$0.0048 if 2,000 input tokens qualify for the cached rate**. Those cached tokens are still part of the input. Eligibility and cache hits must not be assumed guaranteed.

Use a growing ribbon with separate colors for repeated prefix, previous output and new text. A cache toggle should change the billing categories while leaving the logical input visible. That directly connects generation to cost.

For a more complete calculator:

`cost = (U × uncached_rate + R × cache_read_rate + W × cache_write_rate + O × output_rate) / 1,000,000 + applicable extras`

Here the input categories U/R/W must be disjoint; avoid billing the same write tokens again as ordinary uncached input. Not every service has all of these categories. Prompt caching reuses computation for matching prefixes; it is not the same as returning an old answer or permanently remembering the user. A stateful API can also avoid resending text over the network without making all contextual processing free. Current [OpenAI prompt-caching documentation](https://developers.openai.com/api/docs/guides/prompt-caching) explains prefix reuse and provider/model-specific charging.

Keep this audience-level billing explanation in the model/access section. Detailed cache configuration, runtime budgets and orchestration belong in harness engineering.

### Claude plan names need a factual qualification

The request to shorten the pricing pages is sound. However, the assertion that Ultra does not exist conflicts with the current [Anthropic help article](https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan): it says **Max 20x was renamed Ultra**, at **$200/month**. The older naming in the feedback reflects a real prior arrangement, but should not silently replace the current name in a dated current-pricing table.

Use a verified current table with a brief “formerly Max 20x” note if helpful, or clearly label an intentionally historical comparison. Do not combine an older multiplier, a newer plan name and a third date's limits into one row. The same dated-source discipline applies to Codex, Cursor, Antigravity and other plans. The tables should remain short; none needs another demonstration of editing the travel project's files.

## 6. Proposed chapter structure and handoffs

Preserve the previously requested four movements. A separate subsection about working with AI can sit near the end of the harness movement, leading into Codo; a fifth movement is not necessary.

| Movement / subsection                 | Its question and content                                                                                                                                                                                                                                                                     | Handoff                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **1 — از خواستن تا انجام‌شدن**        | Preserve the concrete opening and complete travel conversation.                                                                                                                                                                                                                              | What produces the model's predictions?                                                |
| **2.1 — مدل چگونه پاسخ می‌سازد؟**     | Training dataset, small network, parameters, training versus use, token/vector bridge, next-token probabilities, temperature and continuation.                                                                                                                                               | What can go wrong in these outputs?                                                   |
| **2.2 — اشتباهات رایج مدل‌های زبانی** | Unsupported confident claims, missed instructions, authoring commentary in the output and unnatural Persian. Show the errors without turning this subsection into a build or security procedure.                                                                                             | How do we choose a model that performs better on the work we need?                    |
| **2.3 — انتخاب مدل**                  | Evaluation dataset and criteria; model/creator/access service/host; eight company cards; open weights; supplied benchmark charts; development versus runtime selection; the four-level trust ladder.                                                                                         | How do we obtain access to the chosen models and pay for using them?                  |
| **2.4 — اشتراک و هزینه**              | Subscription versus usage billing; access products; growing input, output and cache; concise dated plan tables.                                                                                                                                                                              | The model predicts an output. What software turns that into a complete task?          |
| **3 — هارنس و ساختن ایجنت**           | Introduce the harness and loop; then context/history, fresh information, search and RAG with embeddings/cosine. Continue through operation, architecture choices, action/data security, connections and outages. End with staged construction, editing, tests and the concrete Codo project. | How does this specialist service fit into personal assistants and wider applications? |
| **4 — زندگی با ایجنت‌ها**             | Preserve the future movement's intended progression, reviewing dependencies affected by the new model/access explanations.                                                                                                                                                                   | Return to a small useful service the audience can build.                              |

The cutoff is a limitation of learned model knowledge; the model also processes context and embedding models compute vectors. Moving these explanations into the harness movement must not imply that they are unrelated to models. The teaching emphasis there is **how the surrounding application supplies the information the model needs**.

Similarly, the model chapter may explain the two model roles and trust preferences without demonstrating construction or authorization mechanisms. This is the distinction the latest chat feedback makes explicit.

Eight company pages add six pages relative to the current two-page catalog. Dataset/parameter/vector/cache additions also consume time. Offset this by merging duplicate context explanations and replacing the five development-workflow pricing pages with concise access/price comparisons. Keep the earlier target of approximately three hours and 100–150 content slides; calculate the actual count after drafting the revised sequence instead of committing to an inflated count in advance.

## 7. Concrete impact on the current deck

| Current visible pages                           | Proposed treatment                                                                                                                                                                                                                                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8–18: model foundations                         | Preserve the successful demonstrations. Add the labeled dataset and the missing language-model representation/parameter bridge at the appropriate points. First-17 approval is a reason to make focused additions, not a reason to omit the newly requested concepts.                          |
| 21: confident hotel answer                      | Use the unsupported-answer failure in the mistakes subsection. Its tool-based resolution belongs with harness search, not inside the introductory failure example.                                                                                                                             |
| 22–27: current section 2.2                      | Move to the harness's information-supply subsection; expand RAG with the vector/cosine sequence. Merge with overlapping current pages 57–60.                                                                                                                                                   |
| 28–34: model selection                          | Expand the access-role diagram, replace the two catalogs with eight useful cards, name the evaluation dataset, and retain the supplied charts with their actual meaning.                                                                                                                       |
| 35, internal ID `30`                            | Remove from model selection and integrate into harness security, preserving the untrusted-model threat.                                                                                                                                                                                        |
| 36, internal ID `31`                            | Keep in model selection and expand the three-rung treatment into the four-level trust preference requested in chat. Place it after the development/runtime distinction and before billing.                                                                                                     |
| 37: two API request formats                     | Move the JSON/interface implementation detail to harness connections. Model selection/billing only needs a short definition of API access.                                                                                                                                                     |
| 38: cost calculator                             | Rebuild around growing context and separate ordinary/cached input charges. Introduce payment mechanisms before asking the audience to interpret its bill.                                                                                                                                      |
| 39–43: development products                     | Replace file-editing walkthroughs with concise plan/access information, including Go and the usage-billed Console/Zen route. Reuse useful construction examples later only where they add something beyond pages 70–71.                                                                        |
| 44–47: model-output failures                    | Move suitable failure examples before model selection. Separate observing an error from the process or software boundary used to prevent/manage it. The receipt-validation case especially needs to be placed with service/privacy design rather than presented as a purely linguistic defect. |
| 48–51: editing, staged construction and testing | Relocate to the construction subsection. Merge with current pages 97–103 and the repeated duplicate-reservation test, instead of explaining the same procedure twice.                                                                                                                          |
| 52–103: harness and project                     | Reorder around the incoming context/search/RAG material; merge duplicate history, state, security and build explanations. Keep independent approval, caller isolation, protected-data recipients, restricted credentials and outage behavior intact.                                           |
| 104–130: wider applications and future          | Audit related model/access/cost/hosting statements and transitions. These pages have not yet been reviewed by the owner; their technical tests are not evidence of audience approval. Avoid another indiscriminate rewrite where the new feedback creates no dependency.                       |

Reordering also requires updating route maps, section names, speaker notes, transitions, source captions and visible numbering together. Preserve useful internal IDs/deep links where possible. Recompute page counts and rebuild the ZIP when the presentation is actually revised; the historical reports should remain historical records.

## 8. What the next revision should demonstrate

The review should establish these concrete outcomes:

- The audience can identify the training examples and distinguish them from evaluation examples; displayed measurements say which set they use.
- The language-model explanation visibly connects tokens, numerical representations, trained parameters and next-token probabilities. It does not invent proprietary parameter counts or equate a vector with a parameter.
- The RAG demonstration's angle, cosine score and selected passage agree with the same coordinates. Its 3D teaching geometry and any real embedding dimensions are labeled accurately.
- Model cards use authentic branding or plain names, verified model variants and useful selection distinctions. Capability, model version, access product and subscription tier remain separate.
- The development/runtime distinction and the requested trust ladder are in model selection. Their ending creates the bridge into payment/cost. Operational security mechanisms remain in the harness.
- Growing input changes the cost calculation. Cache affects eligible billing/computation, not the existence of context or the content of an old answer. The calculation states its assumptions.
- Each chapter has an identifiable purpose; examples moved into it are merged with existing material. There are no stranded blue handoffs referring to the previous ordering.

Run mechanical checks after those content decisions are implemented: actual demo arithmetic and state changes, slide/visual bounds including expanded states, sources, numbering, navigation, downloads and offline packaging. Those checks supplement the chapter-by-chapter teaching review; they cannot substitute for it.

The next edit is therefore a **reorganization with several missing explanatory bridges**, while preserving the visual examples that already work. The added chat feedback is part of this recommendation, particularly the placement of the two model roles and the trust ladder immediately before access and cost.
