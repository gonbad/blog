# V7.2 — verify synchronized clocks before diagnosing cross-system latency

Sina's November 3 10:03 checkout was acknowledged by Bale in 162 ms, yet the provider reports failed with no reason.
The apparent nine-second webhook delay was confounded by a VPS clock running about 9.36 seconds fast: timesyncd
was active but had received zero packets from its unreachable default Ubuntu NTP sources. Independent HTTPS time
and a reachable Cloudflare NTP response agree on that offset. Clock repair must not be called a proven payment fix.

Codo /deploy, /issue and book chapter 8 now require actual synchronization/offset evidence, distinguish wall-clock
timestamps from monotonic handler durations, and retain original historical audit values with a documented correction.
