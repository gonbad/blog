# V7.2 — diagnose the complete payment protocol

Registration V0.2.12: Sina's five local checkout decisions were accepted, but Bale's read-only transaction inquiry
reports the latest attempt failed. Existing logs do not record answerPreCheckoutQuery's result/latency; absence of
an exception does not establish the documented true result. No provider failure-reason field is returned.

Codo /issue and book chapter 8 now distinguish local eligibility, remote acknowledgement and settlement. Record
actual response/timing, use the documented read-only inquiry, and keep unknown incidents open. Do not invent a
wallet/client cause, repeat financial actions, or label an instrumentation patch as a completed payment fix.
