# V6.0.1 — Step-by-Step Implementation Plan (Full Blueprint for Execution)

> **Purpose:** This document is a self-contained, file-by-file implementation manual for V6.0.1 based on [14-architecture.md](14-architecture.md). Every file path, data structure, function signature, command template, server operation, and verification command is specified explicitly so an implementing agent can execute Phases 1 through 7 in order without guessing.

---

## Execution Overview & Phase Checklist

Execute the 7 phases strictly in order. Run the verification command at the end of each phase before moving to the next.

- [ ] **Phase 1:** Upgrade `codo-core` to `0.2.0` (`/home/omid/projects/workshop/agent/kandoo/packages/codo-core/`)
- [ ] **Phase 2:** Upgrade Workshop MCP (`mcp-coolify`) with Auxiliary Docker Image tools (`/home/omid/projects/workshop/agent/kandoo/services/mcp-coolify/`)
- [ ] **Phase 3:** Upgrade `tool-bank` with `whatsapp-waha`, `botfather-provisioner`, `agency-mcp-client`, and updated `codo-core-api` (`/home/omid/projects/workshop/agent/kandoo/tool-bank/`)
- [ ] **Phase 4:** Upgrade Codo Participant Template (`/home/omid/projects/workshop/agent/kandoo/templates/codo/`)
- [ ] **Phase 5:** Update Kandoo Commands (`sync-rehearsal`, `rehearse`), Participant Book, Cookbook, and Compiler (`/home/omid/projects/workshop/agent/kandoo/` & `/home/omid/projects/workshop/agent/cookbook/`)
- [ ] **Phase 6:** Deploy & Verify on Live Staging Server (`82.39.165.56` — `agent.kiloapp.ir`)
- [ ] **Phase 7:** Create & Update the 4 Rehearsal Idea Inputs (`/home/omid/projects/workshop/workshop_docs/versions/V6.0.1/`)

---

## Phase 1: Upgrade `codo-core` to `v0.2.0`

**Working directory:** `/home/omid/projects/workshop/agent/kandoo/packages/codo-core`

### Step 1.1: Bump Version in `pyproject.toml`
Edit `pyproject.toml`:
- Change `version = "0.1.0"` to `version = "0.2.0"`.

### Step 1.2: Update `codo_core/declare.py`
Edit `codo_core/declare.py` to support the V6.0.1 declarative model while maintaining 100% backward compatibility with `0.1.0` imports:
1. Add `"whatsapp_waha": ("whatsapp", "user")` to `ACCOUNT_KINDS`:
   ```python
   ACCOUNT_KINDS = {
       "bale_bot": ("bale", "bot"), "telegram_bot": ("telegram", "bot"),
       "rubika_bot": ("rubika", "bot"), "eitaayar": ("eitaayar", "api"),
       "telegram_user": ("telegram", "user"), "eitaa_user": ("eitaa", "user"),
       "rubika_user": ("rubika", "user"), "bale_user": ("bale", "user"),
       "whatsapp_waha": ("whatsapp", "user"),
       "web": ("web", "api"),
   }
   ```
   And in `DEFAULT_ENV`:
   ```python
   "whatsapp_waha": ("WAHA_API_URL", "WAHA_API_KEY"),
   ```
2. Add `WiringSlot` and `ManagementSpec` dataclasses:
   ```python
   @dataclass(slots=True)
   class WiringSlot:
       """One external credential or humanoid session slot configured via /employer/mcp."""
       slot: str
       kind: str
       label: str = ""
       required: bool = True
       instructions_fa: str = ""
       env_keys: tuple[str, ...] = ()

   @dataclass(slots=True)
   class ManagementSpec:
       """Defines what /employer/mcp configures and what /broker/mcp bills."""
       is_rented: bool = False
       persona_editable: tuple[str, ...] = (
           "name", "age", "bio", "temperament", "voice", "avatar", "signature"
       )
       default_persona: Persona = dc_field(default_factory=Persona)
       fields: list[Field] = dc_field(default_factory=list)
       wiring_slots: list[WiringSlot] = dc_field(default_factory=list)
       meters: list[Meter] = dc_field(default_factory=list)
       notification_modes: tuple[str, ...] = ("webhook", "channel")
       warnings: tuple[str, ...] = ()
   ```
3. Extend `Job`:
   - Add fields:
     ```python
     prd: Any = ""
     management: ManagementSpec | None = None
     employer_tools: tuple = ()
     work_tools: tuple = ()
     enable_work_mcp: bool = False
     work_mcp_public: bool = False
     models: tuple = ()
     ```
   - Add a `__post_init__(self)` method on `Job` that synchronizes `self.management` and `self.hiring` so code using either `job.management` or `job.hiring` works seamlessly:
     - If `self.management is None`: build `ManagementSpec` from `self.hiring` (`is_rented=(self.hiring.model == "rented")`, `fields=self.hiring.fields`, `meters=self.hiring.meters`, `default_persona=self.persona`, `persona_editable=self.persona_slot.editable if self.persona_slot else (...)`, and auto-populate `wiring_slots` from `self.accounts` where `a.role != "management"` or `a.per_employment`).
     - If `self.management is not None`: sync `self.hiring.model = "rented" if self.management.is_rented else "in_house"`, `self.hiring.fields = self.management.fields`, `self.hiring.meters = self.management.meters`.

### Step 1.3: Update `codo_core/models.py` and `codo_core/db.py`
1. In `codo_core/models.py`, add `Broker` and `BrokerLedgerEntry`:
   ```python
   class Broker(Base):
       __tablename__ = "brokers"
       id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: new_id("brk"))
       name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
       token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
       status: Mapped[str] = mapped_column(String(20), default="active")  # active|suspended
       balance_rials: Mapped[int] = mapped_column(BigInteger, default=0)
       credit_limit_rials: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=None)
       meta: Mapped[dict] = mapped_column(JSON, default=dict)
       created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


   class BrokerLedgerEntry(Base):
       __tablename__ = "broker_ledger"
       __table_args__ = (UniqueConstraint("idempotency_key"),)
       id: Mapped[int] = mapped_column(AutoID, primary_key=True, autoincrement=True)
       broker_id: Mapped[str] = mapped_column(ForeignKey("brokers.id"), index=True)
       employment_id: Mapped[str | None] = mapped_column(ForeignKey("employments.id"), index=True, nullable=True)
       kind: Mapped[str] = mapped_column(String(16))           # charge|credit|adjust
       amount_rials: Mapped[int] = mapped_column(BigInteger)
       balance_after_rials: Mapped[int] = mapped_column(BigInteger)
       reason: Mapped[str] = mapped_column(String(300), default="")
       idempotency_key: Mapped[str] = mapped_column(String(80))
       meta: Mapped[dict] = mapped_column(JSON, default=dict)
       created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
   ```
2. In `codo_core/models.py`, add columns to `Employment`:
   ```python
   label: Mapped[str] = mapped_column(String(120), default="self")
   broker_id: Mapped[str | None] = mapped_column(ForeignKey("brokers.id"), index=True, nullable=True)
   token_hash: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)
   work_token_hash: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)
   spent_rials: Mapped[int] = mapped_column(BigInteger, default=0)
   budget_cap_rials: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=None)
   notifications: Mapped[dict] = mapped_column(JSON, default=dict)
   ```
   *(Make sure `Employment.status` is `String(32)` to hold `"paused_budget_cap"` and `"paused_broker_credit"`.)*
3. In `codo_core/db.py`, update `init_db()` so it also runs idempotent `ALTER TABLE employments ADD COLUMN ...` statements if an existing SQLite/Postgres database from v0.1 is opened.

### Step 1.4: Update `codo_core/ledger.py` (Add Wholesale Broker Clearing + Budget Cap Gate)
Keep all existing functions (`balance`, `charge`, `credit`, `statement`, `employment_status`) intact so existing unit tests pass, and add the V6.0.1 wholesale broker functions:
```python
class BudgetCapExceeded(RuntimeError):
    def __init__(self, employment_id: str, spent_rials: int, cap_rials: int, needed_rials: int):
        self.employment_id, self.spent_rials, self.cap_rials, self.needed_rials = (
            employment_id, spent_rials, cap_rials, needed_rials
        )
        super().__init__(f"employment {employment_id}: spent {spent_rials} + {needed_rials} > cap {cap_rials}")

class BrokerCreditExhausted(RuntimeError):
    def __init__(self, broker_id: str, balance_rials: int, limit_rials: int, needed_rials: int):
        self.broker_id, self.balance_rials, self.limit_rials, self.needed_rials = (
            broker_id, balance_rials, limit_rials, needed_rials
        )
        super().__init__(f"broker {broker_id}: balance {balance_rials} - {needed_rials} < -{limit_rials}")
```
Add functions:
- `async def charge_wholesale(employment_id: str, amount_rials: int, reason: str, key: str, meta: dict | None = None) -> BrokerLedgerEntry | None`:
  1. Looks up `emp = await s.get(Employment, employment_id)`. If `emp.broker_id` is `None`: falls back to `await charge(employment_id, amount_rials, reason, key, meta=meta)` for legacy tests.
  2. Checks idempotency on `BrokerLedgerEntry.idempotency_key == key`.
  3. Checks **Gate 1 (`budget_cap_rials`)**: if `emp.budget_cap_rials is not None and emp.spent_rials + amount_rials > emp.budget_cap_rials`: sets `emp.status = "paused_budget_cap"`, commits, and raises `BudgetCapExceeded`.
  4. Looks up `brk = await s.get(Broker, emp.broker_id)`.
  5. Checks **Gate 2 (`credit_limit_rials`)**: if `brk.status != "active"` or (`brk.credit_limit_rials is not None and brk.balance_rials - amount_rials < -brk.credit_limit_rials`): sets `brk.status = "suspended"`, sets all `"active"` employments of `brk.id` to `"paused_broker_credit"`, commits, and raises `BrokerCreditExhausted`.
  6. Deducts: `emp.spent_rials += amount_rials`, `brk.balance_rials -= amount_rials`, inserts `BrokerLedgerEntry(broker_id=brk.id, employment_id=emp.id, kind="charge", amount_rials=amount_rials, balance_after_rials=brk.balance_rials, reason=reason, idempotency_key=key, meta=meta or {})`, commits, and returns the entry.
- `async def credit_broker(broker_id: str, amount_rials: int, reason: str, key: str) -> BrokerLedgerEntry`:
  - Credits `brk.balance_rials += amount_rials`, inserts `BrokerLedgerEntry(kind="credit", ...)`.
  - If `brk.status == "suspended"` and (`brk.credit_limit_rials is None or brk.balance_rials >= -brk.credit_limit_rials`): sets `brk.status = "active"` and restores all employments of `brk.id` with `status == "paused_broker_credit"` back to `"active"`.
- `async def broker_statement(broker_id: str, limit: int = 50) -> list[BrokerLedgerEntry]`: returns recent entries for `broker_id`.

### Step 1.5: Update `codo_core/employments.py` (Broker & Employer Token Minting)
Add token hashing and broker/employment management functions to `codo_core/employments.py`:
- `def hash_token(token: str) -> str`: `hashlib.sha256(token.encode("utf-8")).hexdigest()`
- `async def create_broker(name: str, credit_limit_toman: int | None = None, raw_token: str | None = None) -> tuple[Broker, str]`:
  - Generates `tok = raw_token or f"brk_{name}_{_secrets.token_urlsafe(18)}"` (or returns existing if `name` exists and rotates/updates if requested).
  - Stores `token_hash = hash_token(tok)`, `credit_limit_rials = None if credit_limit_toman is None else credit_limit_toman * 10`.
  - Returns `(broker, tok)`.
- `async def create_for_broker(job: Job, broker_id: str, label: str = "self", initial_budget_cap_toman: int | None = None, raw_token: str | None = None) -> tuple[Employment, str]`:
  - Mints `tok = raw_token or f"emp_{_secrets.token_urlsafe(18)}"` and `work_tok = f"wrk_{_secrets.token_urlsafe(18)}"`.
  - Initializes `fields` with defaults from `job.management.fields` (allowing required fields without defaults to stay `None` while status is `"draft"`).
  - Initializes `persona` from `job.management.default_persona` (or `job.persona`).
  - Sets `status = "draft"` if any required field or required `wiring_slot` is unfilled, else `"active"`.
  - Returns `(emp, tok)`.
- `async def check_readiness(job: Job, emp: Employment) -> tuple[bool, list[str]]`:
  - Checks every required `Field` in `job.management.fields` and every required `WiringSlot` in `job.management.wiring_slots`.
  - Returns `(len(missing) == 0, missing)`.

### Step 1.6: Create `codo_core/notifications.py` (Dual-Sink Reverse Notifications)
Create `codo_core/notifications.py`:
- Implements `async def notify_employer(job: Job, emp: Employment, drivers: dict[str, Any], message: str, kind: str = "alert", approval_code: str = "", payload: dict | None = None) -> dict`:
  1. Reads `cfg = emp.notifications or {}`.
  2. **Sink A (`cfg.get("mode") == "webhook"` and `cfg.get("webhook_url")`)**:
     - Builds body `{"event": "employer.notification", "agent_slug": job.slug, "employment_id": emp.id, "kind": kind, "message": redact(message), "approval_code": approval_code, "payload": payload or {}, "timestamp": datetime.now(UTC).isoformat()}`.
     - If `cfg.get("webhook_secret")`: computes `sig = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()` and sends header `X-Codo-Signature: sha256={sig}`.
     - POSTs via `httpx.AsyncClient(timeout=15)`.
  3. **Sink B (`cfg.get("mode") == "channel"` and `cfg.get("channel_or_group_id")`)**:
     - Resolves driver from `cfg.get("account_slot")` or `emp.accounts` or first available bot/user driver in `drivers`.
     - Calls `await drv.send(Outbound(chat_id=str(cfg["channel_or_group_id"]), text=redact(message)))`.
  4. **Fallback (Legacy Management Channel)**:
     - If `job.hiring.management` and `emp.employer_customer_id` are set, sends via the legacy path so existing tests in `tests/test_manager.py` continue to pass.
  5. Records `Event(employment_id=emp.id, kind=f"notification.{kind}", data={"mode": cfg.get("mode", "none"), "ok": ok})`.

### Step 1.7: Create `codo_core/broker.py` (Plane 2: `/broker/mcp` + `/.well-known/agent.json`)
Create `codo_core/broker.py`:
- Uses `contextvars.ContextVar("_current_broker_id", default="")`.
- Defines `def build_manifest(job: Job) -> dict` returning the exact JSON schema from `14-architecture.md` §3.1.
- Creates a `FastMCP("codo-broker")` instance inside `def mount(app: FastAPI, job: Job, engine: Engine)`:
  - Registers `GET /.well-known/agent.json` on `app` returning `build_manifest(job)`.
  - Registers all 8 fixed tools on `/broker/mcp`:
    1. `get_manifest() -> dict`
    2. `ask_presales_question(question: str, prospect_context: str = "") -> dict`
    3. `create_employer(label: str, initial_budget_cap_toman: int | None = None) -> dict`
    4. `list_employers() -> list[dict]`
    5. `set_employer_budget_cap(employment_id: str, budget_cap_toman: int | None = None) -> dict`
    6. `pause_employer(employment_id: str, reason: str = "paused_by_broker") -> dict`
    7. `resume_employer(employment_id: str) -> dict`
    8. `rotate_employer_token(employment_id: str) -> dict`
    9. `get_broker_account(limit_ledger: int = 30) -> dict`
  - Wraps `mcp.http_app(path="/mcp")` with `_BrokerAuthMiddleware` (validating `Authorization: Bearer <brk_token>` against `Broker.token_hash`) and mounts at `app.mount("/broker", sub)`.

### Step 1.8: Create `codo_core/employer.py` (Plane 3: `/employer/mcp` + `@employer_tool`)
Create `codo_core/employer.py`:
- Uses `contextvars.ContextVar("_current_employment_id", default="")`.
- Defines `class EmployerCtx` (carries `job: Job`, `employment: Employment`, `drivers: dict`, `notify(message, kind="alert")`, `session()`).
- Defines decorator `def employer_tool(fn=None, *, name: str = "")`: marks a function with `__codo_employer_tool__ = {"name": name or fn.__name__}`.
- Inside `def mount(app: FastAPI, job: Job, engine: Engine, drivers: dict[str, Any])`:
  - Creates a `FastMCP("codo-employer")` instance.
  - Registers all 19 universal Employer tools specified in `14-architecture.md` §3.4-A (`get_management_status`, `suggest_persona_and_avatar_prompt`, `update_persona_and_avatar`, `update_management_settings`, `set_field`, `add_knowledge_entry`, `list_knowledge_entries`, `delete_knowledge_entry`, `wire_token_slot`, `wire_session_start`, `wire_session_verify`, `configure_notifications`, `test_notification`, `pending_approvals`, `resolve_approval`, `escalations_list`, `reply_to_escalation`, `audit_queue`, `approve_receipt`, `reject_receipt`, `get_employer_reports`).
  - Iterates over `job.employer_tools` (and any `@employer_tool` in `job.tools`), adapts `fn(ctx: EmployerCtx, ...)` by hiding `ctx` from the MCP JSON schema and injecting `EmployerCtx` for the authenticated `Employment`, and registers each on the `FastMCP("codo-employer")` server!
  - Wraps `mcp.http_app(path="/mcp")` with `_EmployerAuthMiddleware` (validating `Authorization: Bearer <emp_token>` against `Employment.token_hash`) and mounts at `app.mount("/employer", sub)`.

### Step 1.9: Create `codo_core/work.py` (Plane 4D: `/work/mcp` + `@work_tool`)
Create `codo_core/work.py`:
- Defines decorator `def work_tool(fn=None, *, name: str = "")`: marks a function with `__codo_work_tool__ = {"name": name or fn.__name__}`.
- Inside `def mount(app: FastAPI, job: Job, engine: Engine)`:
  - Mounted at `/work/mcp` when `job.enable_work_mcp` is `True` (or when `job.work_tools` is non-empty).
  - Authenticates via `Authorization: Bearer <wrk_token>` (matching `Employment.work_token_hash`) or, if `job.work_mcp_public` is `True`, falls back to the first active employment.
  - Exposes `ask_employee(question_or_request: str, end_user_id: str = "assistant_user", end_user_name: str = "") -> dict` plus every `@work_tool` function on `job.work_tools`.

### Step 1.10: Update `codo_core/admin.py` (Plane 1: Fixed Universal `/admin/mcp`)
Update `codo_core/admin.py` to include the Broker management tools while keeping existing tools working:
- Add `create_broker(name: str, credit_limit_toman: int | None = None, auto_confirm: bool = False) -> dict`
- Add `list_brokers() -> list[dict]`
- Add `credit_broker(broker_id_or_name: str, amount_toman: int, note: str = "", auto_confirm: bool = False) -> dict`
- Add `set_broker_credit_limit(broker_id_or_name: str, credit_limit_toman: int | None = None, auto_confirm: bool = False) -> dict`
- Add `set_broker_status(broker_id_or_name: str, status: str, reason: str = "", auto_confirm: bool = False) -> dict`
- Update `confirm(token: str)` to handle `"broker.create"`, `"broker.credit"`, `"broker.set_limit"`, `"broker.set_status"`.

### Step 1.11: Create `codo_core/accounts/whatsapp_waha.py` and Register in `codo_core/accounts/__init__.py`
Create `codo_core/accounts/whatsapp_waha.py`:
- Implements `WahaDriver(AccountDriver)`:
  - `kind = "user"`, `platform = "whatsapp"`.
  - Reads `WAHA_API_URL` and `WAHA_API_KEY` from settings or employment's wired slot config.
  - `async def begin_login(self, phone: str = "", session_name: str = "default") -> dict`:
    - Calls `POST {waha_url}/api/sessions/{session_name}/start` (creating the session first if 404).
    - Calls `GET {waha_url}/api/screenshot?session={session_name}` (or `/api/{session_name}/auth/qr`), saves PNG to `data/waha_qr_{session_name}.png`, and returns `{"step": "qr_required", "qr_path": f"data/waha_qr_{session_name}.png", "image_b64": b64_png, "hint": "کد QR را در واتساپ گوشی اسکن کنید."}`.
  - `async def finish_login(self, code: str = "", password: str = "", session_name: str = "default") -> dict`:
    - Calls `GET {waha_url}/api/sessions/{session_name}` and verifies `status == "WORKING"`.
  - `async def send(self, out: Outbound) -> dict`:
    - Calls `POST {waha_url}/api/sendText` with `{"session": self.session_name, "chatId": out.chat_id, "text": out.text}`.
  - `async def parse_update(self, update: dict) -> InboundEvent | None`:
    - Parses WAHA's `event == "message"` payload (`payload.from`, `payload.body`, `payload.fromMe == False`) into `InboundEvent(platform="whatsapp", user_id=..., chat_id=..., text=...)`.
- Register `"whatsapp_waha": WahaDriver` in `codo_core/accounts/__init__.py`.

### Step 1.12: Update `codo_core/app.py`, `codo_core/engine.py`, `codo_core/cli.py`, and `codo_core/__init__.py`
1. In `codo_core/app.py`:
   - In `_make_web()`, mount `admin.mount(...)`, `broker.mount(app, self.job, self.engine)`, `employer.mount(app, self.job, self.engine, self.drivers)`, and `work.mount(app, self.job, self.engine)`.
   - In `lifespan`, register any custom SQLAlchemy models in `self.job.models` before `await init_db()`.
   - Update `check(job)` so it validates `ManagementSpec` (`job.management`), custom `@employer_tool` and `@work_tool` functions, and no longer requires `hiring.management` or `hiring.payments` on rented agents.
2. In `codo_core/engine.py`:
   - Update `_charge_meters` to call `await ledger.charge_wholesale(emp.id, price * item["units"], item["name"], key, meta={"customer_id": customer.id})` when `emp.broker_id` is set, catching `BudgetCapExceeded` and `BrokerCreditExhausted` and notifying the Employer via `notifications.notify_employer`.
   - Update `_notify_manager` to delegate to `notifications.notify_employer(self.job, emp, self.drivers, text)`.
3. In `codo_core/cli.py`, add 3 new subcommands:
   - `codo-core bootstrap [--env local|staging] [--url http://127.0.0.1:8000]`:
     - Ensures `ADMIN_TOKEN` and `SEAL_KEY` exist in `docs/secrets/agent.local.md` and `.env`.
     - Calls the agent (or directly via DB if local) to create default Broker `"self"` (`credit_limit=None`) and default Employer `"self"`, and writes `docs/secrets/environments.local.md`.
   - `codo-core mcp-call <admin|broker|employer> <tool_name> [json_args] [--env local|staging|prod] [--name self|...]`:
     - Parses the YAML block in `docs/secrets/environments.local.md`, connects to the target MCP URL with its Bearer token using FastMCP client (`fastmcp.Client`), invokes `<tool_name>`, and prints the JSON result. (If `create_employer` or `create_broker` is called, automatically appends the returned token to `docs/secrets/environments.local.md`!)
   - `codo-core replay-employer [--from-env local] [--to-env staging]`:
     - Bootstraps `to-env` in `docs/secrets/environments.local.md`, reads `docs/secrets/first-employer-snapshot.local.json` (or fetches current state from `from-env`'s `/employer/mcp`), and replays persona, avatar, management settings, knowledge entries, wired tokens, and notification config onto `to-env`'s `"self"` Employer!
4. Export `ManagementSpec`, `WiringSlot`, `employer_tool`, `EmployerCtx`, `work_tool`, `Broker`, `BrokerLedgerEntry` from `codo_core/__init__.py`, and update `API.md`.

### Step 1.13: Add Unit Tests in `packages/codo-core/tests/`
Create `tests/test_v601_three_mcp.py` testing:
1. `GET /.well-known/agent.json` returns valid manifest.
2. `/admin/mcp`: `create_broker("agency", credit_limit_toman=100_000)` → `list_brokers()` → `credit_broker()`.
3. `/broker/mcp`: authenticated with `agency`'s `brk_...` token → `get_manifest()` → `create_employer("shop_1", initial_budget_cap_toman=50_000)` → returns `emp_...` token.
4. `/employer/mcp`: authenticated with `shop_1`'s `emp_...` token → `get_management_status()` → `update_persona_and_avatar(name="سارا")` → `update_management_settings(...)` → `configure_notifications(mode="webhook", webhook_url="https://example.org/hook")` → `@employer_tool` invocation.
5. Wholesale billing double-gate:
   - Meter charge deducts from `agency` broker balance and increments `shop_1.spent_rials`.
   - Exceeding `shop_1.budget_cap_rials` pauses `shop_1` (`paused_budget_cap`) without suspending `agency`.
   - Exceeding `agency.credit_limit_rials` suspends `agency` and pauses all its employments (`paused_broker_credit`); `credit_broker` restores both to `active`.
6. `/work/mcp`: `@work_tool` and `ask_employee` invocation.

**Phase 1 Verification Command:**
```bash
cd /home/omid/projects/workshop/agent/kandoo/packages/codo-core && pytest -v && python3 -m build --wheel
```
*(Must pass 100% of existing 51 tests + all new V6.0.1 tests, and produce `dist/codo_core-0.2.0-py3-none-any.whl`.)*

---

## Phase 2: Upgrade Workshop MCP (`mcp-coolify`) with Auxiliary Docker Image Tools

**Working directory:** `/home/omid/projects/workshop/agent/kandoo/services/mcp-coolify/server`

### Step 2.1: Update `app/config.py`
Edit `app/config.py`:
- Add `MAX_AUX_IMAGES = int(os.getenv("MAX_AUX_IMAGES", "2"))` right after `MAX_SUBDOMAINS`.

### Step 2.2: Add `AuxiliaryImage` Table to `app/db.py`
Edit `app/db.py`:
```python
class AuxiliaryImage(Base):
    """A pre-built Docker image (e.g. devlikeapro/waha, wordpress) deployed inside
    the team's Coolify project and routed to one of the team's claimed subdomains."""
    __tablename__ = "auxiliary_images"
    __table_args__ = (UniqueConstraint("project_id", "name"),)
    id               = Column(Integer, primary_key=True)
    project_id       = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    name             = Column(String, nullable=False)
    image            = Column(String, nullable=False)
    tag              = Column(String, default="latest")
    port             = Column(String, default="3000")
    subdomain        = Column(String, unique=True, nullable=False)
    application_uuid = Column(String, unique=True, nullable=False)
    created_at       = Column(DateTime, default=now)
```

### Step 2.3: Add `create_dockerimage_application` to `app/coolify.py`
Edit `app/coolify.py`:
```python
async def create_dockerimage_application(
    *, project_uuid, environment_uuid, environment_name,
    name, image, tag="latest", ports_exposes="3000",
    domains=None, limits_memory="512m", limits_cpus="0.5"
):
    body = {
        "project_uuid": project_uuid,
        "server_uuid": SERVER_UUID,
        "environment_uuid": environment_uuid,
        "environment_name": environment_name,
        "docker_registry_image_name": image,
        "docker_registry_image_tag": tag or "latest",
        "ports_exposes": str(ports_exposes),
        "name": name,
        "limits_memory": limits_memory,
        "limits_cpus": limits_cpus,
        "autogenerate_domain": False,
        "instant_deploy": False,
    }
    if domains:
        body["domains"] = domains
    r = await _req("POST", "/applications/dockerimage", json=body)
    return r["uuid"]
```

### Step 2.4: Update `app/tools.py`
Edit `app/tools.py`:
1. Import `MAX_AUX_IMAGES` from `.config` and `AuxiliaryImage` from `.db`.
2. Update `_names(s, project_id)` / `_sync_domains(s, p)` so that subdomains assigned to an `AuxiliaryImage` row for `project_id` are **not** included in the primary agent application's `domains` string (preventing Traefik routing collisions between the main app and the auxiliary container!).
3. In `whoami()`, include:
   ```python
   "auxiliary_images": [
       {"name": a.name, "image": f"{a.image}:{a.tag}", "url": f"https://{a.subdomain}.{BASE_DOMAIN}", "port": a.port}
       for a in s.query(AuxiliaryImage).filter_by(project_id=p.id).all()
   ] if p else [],
   "auxiliary_images_left": MAX_AUX_IMAGES - (s.query(AuxiliaryImage).filter_by(project_id=p.id).count() if p else 0),
   ```
4. In `release_subdomain(name)`, refuse if `name` is currently bound to an `AuxiliaryImage` (tell the caller to call `remove_image` first).
5. In `reset_project()`, also delete any `AuxiliaryImage` applications in Coolify and their rows in `auxiliary_images`.
6. Add the 5 new MCP tools to `app/tools.py`:
   - `@mcp.tool() async def deploy_image(name: str, image: str, subdomain: str, port: str = "3000", tag: str = "latest", env: dict[str, str] | None = None, volume_path: str = "") -> dict`
   - `@mcp.tool() async def set_image_env(name: str, key: str, value: str) -> dict`
   - `@mcp.tool() async def list_images() -> dict`
   - `@mcp.tool() async def image_logs(name: str, lines: int = 80) -> dict`
   - `@mcp.tool() async def remove_image(name: str, release_domain: bool = False) -> dict`

**Phase 2 Verification Command:**
```bash
python3 -m py_compile /home/omid/projects/workshop/agent/kandoo/services/mcp-coolify/server/app/*.py
```

---

## Phase 3: Upgrade `tool-bank` with WAHA, BotFather Provisioner, Agency Client & Updated API Sheet

**Working directory:** `/home/omid/projects/workshop/agent/kandoo/tool-bank`

### Step 3.1: Update `tools/codo-core-api/README.md`
Copy the updated `packages/codo-core/API.md` (documenting `0.2.0`, `ManagementSpec`, `WiringSlot`, `/admin/mcp`, `/broker/mcp`, `/employer/mcp`, `/work/mcp`, `@employer_tool`, `@work_tool`, `whatsapp_waha`, and `codo-core bootstrap` / `mcp-call` / `replay-employer`) into `tools/codo-core-api/README.md`.

### Step 3.2: Create `tools/whatsapp-waha/` (`README.md` + `waha_client.py`)
1. `tools/whatsapp-waha/README.md`:
   - Explains **WAHA (WhatsApp HTTP API)** and its two editions:
     - **WAHA Core (`devlikeapro/waha` — Free):** 1 session per container (`"default"`), text messaging + inbound webhooks + QR screenshot login (`GET /api/screenshot`). Sufficient for **In-House** WhatsApp humanoid agents or single-session use.
     - **WAHA Plus (`devlikeapro/waha-plus` — Paid):** Multi-session support in 1 container + full media/voice sending. Required if a **Rented** agent needs each Employer to attach their own WhatsApp SIM.
   - States the **Workshop Resource Rule:** At most **1 WAHA container per agent project** (never 1 container per Employer/End-User). Use engine `WHATSAPP_DEFAULT_ENGINE=GOWS` (or `NOWEB`) to keep memory under 250 MB.
   - Shows the exact `workshop.deploy_image` call:
     ```python
     workshop.deploy_image(
         name="waha",
         image="devlikeapro/waha",
         tag="latest",
         subdomain="<team>-waha",
         port="3000",
         env={"WHATSAPP_API_KEY": "<generated_secret>", "WHATSAPP_DEFAULT_ENGINE": "GOWS"},
         volume_path="/app/.sessions"
     )
     ```
   - Shows how `Account(key="whatsapp", kind="whatsapp_waha", role="customer")` + `/employer/mcp`'s `wire_session_start` / `wire_session_verify` fetches the QR screenshot and completes login.
2. `tools/whatsapp-waha/waha_client.py`:
   - Helper client for direct WAHA operations (session status, QR screenshot download, text/media send, webhook registration).

### Step 3.3: Create `tools/botfather-provisioner/` (`README.md` + `provisioner.py`)
1. `tools/botfather-provisioner/README.md`:
   - Explains how a Calling Agent (such as the **Agent Agency** or **Codo** during `/employer`) can offer a non-technical Employer two choices when wiring a `bale_bot` or `telegram_bot` slot:
     1. Manual step-by-step `@BotFather` instructions, OR
     2. Hands-free automated bot creation: Employer gives Phone + OTP → provisioner logs in temporarily, messages `@BotFather` (`/newbot`), sets bot name/username, captures the minted bot token, passes it to `wire_token_slot` on `/employer/mcp`, and **immediately logs out and deletes the temporary user session**.
2. `tools/botfather-provisioner/provisioner.py`:
   - Async functions `start_botfather_provisioning(platform, phone)` and `complete_botfather_provisioning(ticket, otp_code, bot_display_name, bot_username, password="") -> dict` returning `{"ok": True, "bot_token": "...", "bot_username": "..."}`.

### Step 3.4: Create `tools/agency-mcp-client/` (`README.md` + `agency_client.py`)
1. `tools/agency-mcp-client/README.md`:
   - Explains how a Broker / Agency agent (like Rehearsal #4 `04-agent-agency`) calls any rented Codo agent's `/broker/mcp` and `/employer/mcp` endpoints over Streamable HTTP.
2. `tools/agency-mcp-client/agency_client.py`:
   - `class RemoteAgentClient`:
     - `call_broker(broker_mcp_url: str, broker_token: str, tool_name: str, arguments: dict) -> dict`
     - `call_employer(employer_mcp_url: str, employer_token: str, tool_name: str, arguments: dict) -> dict`
     - High-level helpers: `inspect_agent`, `ask_presales`, `hire_employer`, `set_budget_cap`, `pause_employer`, `resume_employer`, `get_broker_account`, `get_employer_status`, `configure_employer_persona`, `configure_employer_settings`, `wire_employer_token`, `wire_employer_session_start`, `wire_employer_session_verify`, `configure_employer_notifications`.

### Step 3.5: Update `tool-bank/catalog.json`
Add entries for `whatsapp-waha`, `botfather-provisioner`, and `agency-mcp-client`, and update `codo-core-api`'s summary in `catalog.json`.

**Phase 3 Verification Command:**
```bash
python3 -c 'import json; d=json.load(open("/home/omid/projects/workshop/agent/kandoo/tool-bank/catalog.json")); print("Tools count:", len(d["tools"]))'
```

---

## Phase 4: Upgrade Codo Participant Template (`templates/codo/`)

**Working directory:** `/home/omid/projects/workshop/agent/kandoo/templates/codo`

### Step 4.1: Remove Obsolete Build-Time Files
Delete these files from `templates/codo/`:
- `commands/role.md` (replaced by `commands/idea-core.md`)
- `commands/hiring.md` (replaced by `commands/manage-spec.md`)
- `commands/persona.md` (moved to runtime `/employer/mcp` during `/wire` & `/employer`)
- `commands/avatar.md` (moved to runtime `/employer/mcp` during `/wire` & `/employer`)
- `docs/living/role.md` (replaced by `docs/living/idea-core.md`)
- `docs/living/hiring.md` (replaced by `docs/living/management.md`)
- `docs/living/persona.md`
- `docs/living/avatar.md`

### Step 4.2: Create New & Restored Command Files in `templates/codo/commands/`
Every command file in `templates/codo/commands/*.md` must start with YAML frontmatter `---\ndescription: ...\n---` and end with the progress bar instruction.

1. **`commands/idea-core.md`** (Step 02 — «هستهٔ ایده»):
   - Combines V4.1's `/idea-core` (reading `docs/versions/0.1/00-idea-input.md` and `existing_product/`, competitor benchmarking via `web_search`, scope cutting into `docs/living/roadmap.md`) with V6's employee role framing:
     - Fixes **1 Job Title** («یک عنوان شغلی»).
     - Decides **In-House (`is_rented=False`) vs. Rented (`is_rented=True`)** using the internal-system boundary rule.
     - Decides the **End-User Work Plane** (messengers, web screen/blog, `/work/mcp` for personal AI assistants, or no end-user).
     - Defines boundaries & referral link.
   - Writes `docs/versions/0.1/01-idea-core.md` and `docs/living/idea-core.md`.
   - Next command: `‹prd›`.

2. **`commands/prd.md`** (Step 03 — «سند محصول»):
   - Restored from V4.1 (`private/kandoo/templates/codo/commands/prd.md`), adapted for AI employees & products:
     - Runs the file-based questions loop to write `docs/living/prd.md`.
     - Covers: what the product/employee does, who the End-Users and Employers are, core business rules, whether it has a web screen/companion UI (and if so, mobile/desktop target form), and strict adherence to the v0.1 scope agreed in `/idea-core`.
   - Next command: `‹tools›`.

3. **`commands/tools.md`** (Step 04 — «ابزارها»):
   - Reads `idea-core.md` and `prd.md`. Writes `docs/living/tools.md`.
   - Selects End-User Work Plane accounts (`bale_bot`, `telegram_bot`, `rubika_bot`, `eitaayar`, `bale_user`, `telegram_user`, `eitaa_user`, `rubika_user`, `whatsapp_waha`) and checks whether `/work/mcp` (`enable_work_mcp=True`) is needed.
   - **WhatsApp (`WAHA`) rule:** If the user wants a WhatsApp humanoid account, searches `whatsapp-waha` in the tool bank, explains **WAHA Core (Free, 1 session `"default"`) vs. WAHA Plus (Paid, multi-session)**, enforces the **1-container-per-agent limit**, and notes that `workshop.deploy_image` will spin up `devlikeapro/waha` on a team subdomain.
   - **Auxiliary Docker Images (`deploy_image`):** If the product needs WordPress, WAHA, or another Docker Hub image (up to 2 per team), records the image, tag, port, env vars, and subdomain in `tools.md`.
   - Searches `workshop/tool-bank` (`search_tool_bank`, `fetch_tool`) for ready tools (`rss-fetch`, `web-reader`, `wordpress-publish`, `bale-wallet`, `receipt-ocr`, `botfather-provisioner`, `agency-mcp-client`).
   - Defines sealed inputs/outputs, approval modes, rate limits, and writes «کارهای تو» sign-up instructions so the participant starts getting tokens in parallel.
   - Next command: `‹manage-spec›`.

4. **`commands/manage-spec.md`** (Step 05 — «قابلیت‌های مدیریتی»):
   - Reads `idea-core.md`, `prd.md`, and `tools.md`. Writes `docs/living/management.md`.
   - Specifies everything exposed on `/employer/mcp` (and `/broker/mcp` if rented):
     1. **Persona & Avatar Slot Rules:** Editable fields (`name`, `age`, `temperament` / `مزاج`, `voice`, `bio`, `signature`, `avatar`) + default persona values + locked rules (honest AI identity, boundary voice).
     2. **Behavioral Settings (`Field` list):** Schedules (`HH:MM` in `Asia/Tehran`), topics, RSS sources, ticket prices, etc.
     3. **Tool Wiring Slots (`WiringSlot` list):** Automatically derived from `/tools` — which tokens (`wire_token_slot`) or humanoid sessions (`wire_session_start/verify`) an Employer configures, with `instructions_fa`.
     4. **Outbound Notification Sinks:** Webhook (`webhook_url`) and Messenger Group/Channel (`channel_or_group_id` where agent's bot/account is Admin).
     5. **Agent-Specific Employer Tools (`@employer_tool`):** Any custom management operations specific to this product (e.g., approving unverified agents or checking broker payables in the Agency, exporting registrants in Event Organizer).
     6. **Wholesale Meters (`Meter` list — ONLY if `is_rented=True`):** Which units are billed to Brokers on `/broker/mcp`, wholesale price in Tomans, and free allowance. (If `is_rented=False`, records "In-House — no wholesale billing").
   - Next command: `‹sops›`.

5. **`commands/sops.md`** (Step 06 — «رویه‌ها»):
   - Reads `idea-core.md`, `prd.md`, `tools.md`, `management.md`. Writes `docs/living/sops.md`.
   - Defines 3–6 concrete `Sop(...)` procedures: triggers, states, second-person instructions, tools (`@tool`), wholesale meter emitted (`ctx.meter(...)`), outbound employer notifications (`ctx.notify_employer(...)`), debounce window, media fallback, and approval requirements.
   - Next command: `‹data-model›`.

6. **`commands/data-model.md`** (Step 07 — «مدل داده»):
   - Restored from V4.1 (`private/kandoo/templates/codo/commands/data-model.md`), placed after `/sops`:
     - Uses plain business language («چیز», «فیلد», «یکتا», «یک به چند» — zero SQL jargon).
     - Captures all domain things implied by `prd.md`, `management.md`, and `sops.md` (beyond the built-in `codo-core` tables), their fields, relationships, uniqueness rules, invariants, and what is deliberately not kept.
     - Writes `docs/living/data-model.md`.
   - Next command: `‹edge-cases›`.

7. **`commands/edge-cases.md`** (Step 08 — «مواردِ لبه»):
   - Reads `prd.md`, `tools.md`, `management.md`, `sops.md`, `data-model.md`. Writes `docs/living/edge-cases.md`.
   - Runs pressure test + 3 lenses (Adversarial, Edge-Case Hunter, Verification Gap).
   - Hard gate before `/plan`.
   - Next command: `‹ux›` (if `idea-core.md` / `prd.md` says the product has its own screen/companion theme) or `‹plan›` (if no screen).

8. **`commands/plan.md`** (Step 09 — «نقشه»):
   - Gate: refuses if any case in `edge-cases.md` is `open`.
   - Reads all living docs (`idea-core.md`, `prd.md`, `tools.md`, `management.md`, `sops.md`, `data-model.md`, `edge-cases.md`).
   - Writes `docs/versions/0.1/plan.md` and `docs/living/architecture.md`:
     1. Custom SQLAlchemy models (if any from `data-model.md`) in `backend/app/models.py` passed to `Job(models=(...))`.
     2. `backend/app/job.py` structure (`Job`, `ManagementSpec`, `Field`, `WiringSlot`, `Meter`, `Account`, `Sop`).
     3. Tool list: `@tool` (SOP tools), `@employer_tool` (custom tools on `/employer/mcp`), `@work_tool` (if `/work/mcp` enabled).
     4. Auxiliary Docker images to deploy via `workshop.deploy_image` (if any, e.g. WAHA or WordPress).
     5. Numbered build order & test plan.
   - Next command: `‹build›` (fresh session).

9. **`commands/build.md`** (Step 10 — «ساخت»):
   - Fresh session. Reads `plan.md`, all living docs, and `codo-core-api` from the tool bank.
   - Scaffolds `backend/requirements.txt` (`codo-core=={{CODO_CORE_VERSION}}`), `backend/app/models.py`, `backend/app/tools/*.py`, `backend/app/sops/*.md`, `backend/app/job.py`, `Dockerfile`, `run.sh`, `backend/tests/test_agent.py`.
   - If `plan.md` includes an auxiliary Docker image (e.g. `waha` or `wordpress`), calls `workshop.deploy_image(...)` now and waits for it to be healthy so its URL is ready for `/wire`.
   - Runs `codo-core check backend/app/job.py` and `pytest` until 100% green.
   - Next command: `‹wire›`.

10. **`commands/wire.md`** (Step 11 — «راه‌اندازی»):
    - Starts the local agent and WSS webhook relay (`./run.sh`).
    - Runs `codo-core bootstrap --env local` to generate `ADMIN_TOKEN`, `SEAL_KEY`, default Broker `"self"`, and first Employer `"self"` (`emp_01`), saving them into `docs/secrets/environments.local.md`.
    - Connects to `local` `/employer/mcp` (`codo-core mcp-call employer get_management_status --env local --name self`) and guides the participant through configuring Employer `"self"`:
      1. **Persona & Avatar:** Calls `suggest_persona_and_avatar_prompt` if the user wants suggestions, generates/saves `assets/avatar.png` if needed, and calls `update_persona_and_avatar`.
      2. **Management Settings:** Calls `update_management_settings` for all required fields in `management.md`.
      3. **Tool & Session Wiring:** Calls `wire_token_slot` (reading tokens from `docs/secrets/accounts.local.md` or offering `botfather-provisioner` if available) and/or `wire_session_start` + `wire_session_verify` (handling OTP or WAHA QR screenshot).
      4. **Notifications:** Calls `configure_notifications` (`webhook` or `channel`) and `test_notification`.
    - Saves the configured snapshot to `docs/secrets/first-employer-snapshot.local.json` so `/deploy` can replay it onto `staging` automatically.
    - Next command: `‹test›`.

11. **`commands/test.md`** (Step 12 — «تست»):
    - Runs `pytest` machine tests + interactive real-messenger scenarios through the relay.
    - Verifies `/admin/mcp` (`stats`), `/broker/mcp` (`get_manifest`), and `/employer/mcp` (`get_management_status`, `get_employer_reports`).
    - Records token usage & cost-per-unit in `docs/versions/0.1/test.md`.
    - Next command: `‹deploy›` (or `‹iterate›`).

12. **`commands/deploy.md`** (Step 13 — «انتشار»):
    - Claims subdomain (`claim_subdomain`), sets staging env vars via `set_env` (`SEAL_KEY`, `ADMIN_TOKEN`, `LLM_*`, `PIP_INDEX_URL`, `APP_URL`), pushes to git, and calls `deploy`.
    - Once deployed and `/health` answers `200 OK`:
      - Runs **`codo-core replay-employer --from-env local --to-env staging`** to automatically provision `environments.staging` in `docs/secrets/environments.local.md` and replay Employer `"self"`'s Persona, Avatar, settings, knowledge, wired tokens, and notification config onto `staging`!
      - Flips `default_environment: staging` in `docs/secrets/environments.local.md`.
      - If `is_rented == True`, asks if the participant wants to create a Broker token for `agency` right now (`codo-core mcp-call admin create_broker '{"name":"agency","credit_limit_toman":100000000,"auto_confirm":true}' --env staging`).
    - Verifies external reachability and ticks `انتشار`.

13. **`commands/admin.md`, `commands/broker.md`, `commands/employer.md` (The 3 Floating Persona Commands):**
    - **`commands/admin.md` (`/admin`):** Reads `docs/secrets/environments.local.md`, determines the target environment (`default_environment` unless specified), and calls `/admin/mcp` via `codo-core mcp-call admin <tool> '<json>' --env <env>`. Handles Broker creation, Broker credit top-ups (`credit_broker`), Broker suspension, global stats, and `query_readonly`.
    - **`commands/broker.md` (`/broker`):** Reads `docs/secrets/environments.local.md`, picks the Broker (defaults to `"self"` if only one exists, otherwise matches name or asks), and calls `/broker/mcp` via `codo-core mcp-call broker <tool> '<json>' --env <env> --name <broker>`. When `create_employer` is called, automatically saves the new employer's `employment_id`, `mcp_url`, and `token` under `environments.<env>.employers` in `docs/secrets/environments.local.md`!
    - **`commands/employer.md` (`/employer`):** Reads `docs/secrets/environments.local.md`, picks the Employer (defaults to `"self"` if only one exists, otherwise matches name or asks), and calls `/employer/mcp` via `codo-core mcp-call employer <tool> '<json>' --env <env> --name <employer>`. Supports all universal management actions (persona, avatar, fields, knowledge, token/OTP/QR wiring, notifications, approvals, escalations, reports) **plus** any custom `@employer_tool` of the agent!

### Step 4.3: Update Living Doc Templates & Constitution in `templates/codo/`
1. In `templates/codo/docs/living/`:
   - Create `idea-core.md`, `prd.md`, `management.md`, `data-model.md`.
   - Update `tools.md`, `sops.md`, `edge-cases.md`, `architecture.md`, `README.md`.
2. In `templates/codo/docs/secrets/`:
   - Create `environments.local.md.example` with the YAML structure from `14-architecture.md` §4.1.
   - Update `README.md` to explain `environments.local.md`.
3. Update `templates/codo/AGENTS.md`, `templates/codo/docs/status.md`, and `templates/codo/docs/constitution/00-rules.md`..`03-tool.md` to reflect the 13-step V6.0.1 pipeline and the 3 floating persona commands (`/admin`, `/broker`, `/employer`).

**Phase 4 Verification Command:**
```bash
python3 /home/omid/projects/workshop/agent/kandoo/compile/compile.py --check
```

---

## Phase 5: Update Kandoo Commands, Participant Book, Cookbook & Compiler

**Working directory:** `/home/omid/projects/workshop/agent/kandoo` and `/home/omid/projects/workshop/agent/cookbook`

### Step 5.1: Create `agent/kandoo/.opencode/commands/sync-rehearsal.md`
Create `.opencode/commands/sync-rehearsal.md`:
- Takes `<rehearsal_path>` (e.g. `/home/omid/projects/rehearsals/01-event-organizer`).
- Runs `python3 compile/compile.py` to build a fresh `out/codo.zip`.
- Unzips only the command files (`.opencode/commands/*` or adapter equivalent), `AGENTS.md`, and `docs/constitution/*` into `<rehearsal_path>`, **never overwriting** `<rehearsal_path>/docs/living/`, `docs/versions/`, `docs/secrets/`, `.env`, `backend/`, or `data/`.
- If `<rehearsal_path>/.venv` exists, installs the latest wheel from `packages/codo-core/dist/codo_core-0.2.0-py3-none-any.whl` into `<rehearsal_path>/.venv`.

### Step 5.2: Update `agent/kandoo/.opencode/commands/rehearse.md`
Update `rehearse.md` so it describes the 4-rehearsal loop in `/home/omid/projects/rehearsals/` (`01-event-organizer`, `02-neda-reporter`, `03-hanieh-support`, `04-agent-agency`), the V6.0.1 pipeline (`/start` → `/idea-core` → `/prd` → `/tools` → `/manage-spec` → `/sops` → `/data-model` → `/edge-cases` → `/plan` → `/build` → `/wire` → `/test` → `/deploy`), and `/sync-rehearsal`.

### Step 5.3: Update `templates/participant-book/*.md` and `agent/cookbook/*.md`
1. In `templates/participant-book/03-project.md`, `04-start.md`, `05-after.md`:
   - Update the pipeline steps and command names (`/idea-core`, `/prd`, `/tools`, `/manage-spec`, `/sops`, `/data-model`, `/edge-cases`, `/plan`, `/build`, `/wire`, `/test`, `/deploy`, plus floating `/admin`, `/broker`, `/employer`).
   - Explain in plain Persian how `/employer` lets the participant change their agent's persona, avatar, schedule, and connected accounts anytime, and how Rented agents can be connected to the Agency via `/admin` (creating a Broker token).
2. In `agent/cookbook/01-model.md`, `02-employee.md`, `03-stack.md`, `05-kandoo.md`, `09-rehearse.md`, `13-glossary.md`:
   - Update to V6.0.1 (`codo-core 0.2.0`, the 3-MCP model, Wholesale Broker Ledger, `deploy_image` for WAHA/WordPress, and the 4 rehearsals).
3. In `agent/kandoo/docs/compile.json` (and `compile.example.json`):
   - Update `"codo_core_version": "0.2.0"`.

**Phase 5 Verification Command:**
```bash
cd /home/omid/projects/workshop/agent/kandoo && python3 compile/compile.py && python3 compile/rtl_check.py templates/participant-book ../cookbook
```

---

## Phase 6: Deploy & Verify on Live Staging Server (`82.39.165.56`)

**Server:** `root@82.39.165.56` (`agent.kiloapp.ir`), SSH key: `/home/omid/projects/workshop/agent/kandoo/docs/secrets/box_key`.

### Step 6.1: Publish `codo-core 0.2.0` Wheel to Gitea PyPI Registry
1. Copy `packages/codo-core/dist/codo_core-0.2.0-py3-none-any.whl` to `root@82.39.165.56:/tmp/`.
2. Upload the wheel to `https://git.agent.kiloapp.ir/api/packages/workshop/pypi` using the `GITEA_TOKEN` from `/opt/kandoo/services/.env`.
3. Verify `pip index versions codo-core` (with seat credentials) shows `0.2.0`.

### Step 6.2: Push Updated `tool-bank` to Gitea (`workshop/tool-bank`)
1. Copy `/home/omid/projects/workshop/agent/kandoo/tool-bank/` to the server and push the commit to `https://git.agent.kiloapp.ir/workshop/tool-bank.git`.
2. Verify `search_tool_bank("whatsapp")` and `search_tool_bank("agency")` return `whatsapp-waha`, `botfather-provisioner`, and `agency-mcp-client`.

### Step 6.3: Update Base Image with `codo-core 0.2.0`
1. Copy `codo_core-0.2.0-py3-none-any.whl` into `/opt/kandoo/services/base-image/` on `82.39.165.56` and update the `workshop/agent-base:6.0-20261018` image so `codo-core==0.2.0` is pre-installed in `/wheels` and site-packages.

### Step 6.4: Deploy Updated `mcp-coolify` Service on `82.39.165.56`
1. `scp -i /home/omid/projects/workshop/agent/kandoo/docs/secrets/box_key -r /home/omid/projects/workshop/agent/kandoo/services/mcp-coolify root@82.39.165.56:/opt/kandoo/services/`
2. Update `CODO_CORE_VERSION=0.2.0` in `/opt/kandoo/services/.env` on `82.39.165.56`.
3. Rebuild and restart `mcp`:
   ```bash
   ssh -i /home/omid/projects/workshop/agent/kandoo/docs/secrets/box_key root@82.39.165.56 "cd /opt/kandoo/services && docker compose up -d --build mcp && docker compose ps"
   ```
4. Verify from `p01` seat token that `whoami` returns `"codo_core_version": "0.2.0"`, `"auxiliary_images": []`, `"auxiliary_images_left": 2`, and that `list_images` and `search_tool_bank` work end-to-end.

---

## Phase 7: Create & Update the 4 Rehearsal Idea Inputs

**Working directory:** `/home/omid/projects/workshop/workshop_docs/versions/V6.0.1/` (and `V6.0/`)

### Step 7.1: Write `16-idea-input-event-organizer.md` (Rehearsal #1: Event Registration Agent)
Write a complete Persian `00-idea-input.md` ready to paste into `/home/omid/projects/rehearsals/01-event-organizer/docs/versions/0.1/00-idea-input.md`:
- **Role:** مسئول ثبت‌نام و هماهنگی رویداد و کارگاه (اجاره‌ای — `is_rented = True`).
- **End-User Work Plane:** ربات بله (`bale_bot`) + رابط `/work/mcp` (برای دستیارهای شخصی هوش مصنوعی شرکت‌کنندگان) + دریافت هزینه ثبت‌نام با کیف پول بله (`bale_wallet`) و کارت‌به‌کارت با OCR رسید (`card_ocr`) + چانه‌زنی در چارچوب باند تخفیف کارفرما.
- **Management (`/employer/mcp`):** تنظیم پرسونا و آواتار، عنوان و سرفصل‌های رویداد، ظرفیت، قیمت بلیت، باند تخفیف، اتصال توکن ربات بله، اتصال کانال/گروه اعلان ثبت‌نام‌های جدید، و ابزار اختصاصی `@employer_tool` برای دریافت فهرست ثبت‌نام‌شدگان (`export_registrants`).
- **Wholesale Meter (`/broker/mcp`):** به ازای هر ثبت‌نام قطعی (پرداخت‌شده)، کسر از اعتبار بروکر.
- **First Employer (`self`):** ثبت‌نام واقعی شرکت‌کنندگان کارگاه V6.0 خودِ امید!

### Step 7.2: Write `17-idea-input-agency.md` (Rehearsal #4: The Agent Agency)
Write a complete Persian `00-idea-input.md` ready to paste into `/home/omid/projects/rehearsals/04-agent-agency/docs/versions/0.1/00-idea-input.md`:
- **Role:** آژانس استخدام ایجنت‌ها (داخلی / غیر اجاره‌ای — `is_rented = False`).
- **End-User Work Plane:** یک ربات بله (`bale_bot`) برای دو دسته کاربر انتهایی:
  1. **سمت عرضه (توسعه‌دهندگان ایجنت):** ارسال آدرس `/broker/mcp` و توکن بروکر ← بررسی خودکار مانیفست ایجنت ← ثبت در وضعیت `unverified` ← ارائه لینک عمیق اختصاصی (`?start=hire_<slug>`) به توسعه‌دهنده ← **ارسال فوری اعلان به کانال نوتیفیکیشن کارفرما (امید) که یک ایجنت تأییدنشده جدید ثبت شده است**.
  2. **سمت تقاضا (کارفرمایان):** جست‌وجو و پرسش‌وپاسخ پیش از خرید درباره ایجنت‌های `approved` (یا ایجنت `unverified` با لینک مستقیم)، شارژ کیف پول کاربری در آژانس (`bale_wallet` یا `card_ocr`)، استخدام ایجنت (فراخوانی `create_employer` و `set_employer_budget_cap` روی `/broker/mcp` ایجنت مقصد)، دریافت آدرس و توکن `/employer/mcp`، و پیکربندی کامل ایجنت (پرسونا، آواتار، تنظیمات، ساخت خودکار ربات در BotFather با `botfather-provisioner` یا ارسال OTP، و تنظیم وب‌هوک اعلان آژانس) درون خودِ ربات آژانس!
- **Management (`/employer/mcp` — فراخوانی با دستور `/employer` در کدو):**
  - تنظیم پرسونا، آواتار، توکن ربات بله آژانس، و کانال نوتیفیکیشن مدیر آژانس (`configure_notifications(mode="channel", ...)`).
  - ابزارهای اختصاصی `@employer_tool` روی `/employer/mcp`:
    1. `list_unverified_agents()` — مشاهده ایجنت‌های منتظر تأیید.
    2. `approve_listed_agent(slug, retail_markup_pct=20)` — تأیید ایجنت برای نمایش و تبلیغ عمومی در آژانس.
    3. `suspend_listed_agent(slug, reason)` — تعلیق ایجنت.
    4. `show_broker_payables()` — استعلام لحظه‌ای بدهی آژانس به تک‌تک توسعه‌دهندگان ایجنت‌ها از طریق `get_broker_account()` روی `/broker/mcp` آن‌ها.
    5. `record_developer_payout(slug, amount_toman, note)` — ثبت تسویه‌حساب انجام‌شده با توسعه‌دهنده.

### Step 7.3: Update `V6.0/07-idea-input-neda.md` and `V6.0/08-idea-input-hanieh.md`
Update `07-idea-input-neda.md` and `08-idea-input-hanieh.md` so their terminology matches V6.0.1 (removing references to "Employment #0" and direct Employer-to-Agent payment gateways, and noting that Neda's WordPress blog is spun up via `workshop.deploy_image` and wholesale billing clears via `/broker/mcp`).
