/* Small, deterministic teaching model. No network calls or external libraries. */
(function (root) {
  "use strict";
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const softmax = (values) => {
    const max = Math.max(...values);
    const exps = values.map((x) => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((x) => x / sum);
  };
  const patterns = [
    [0, ["01110", "11011", "10001", "11011", "01110"]],
    [0, ["01110", "10001", "10001", "10001", "01110"]],
    [0, ["11110", "10010", "10010", "10010", "11110"]],
    [0, ["01111", "01001", "01001", "01001", "01111"]],
    [0, ["01110", "10011", "10001", "11001", "01110"]],
    [0, ["01110", "11001", "10001", "10011", "01110"]],
    [1, ["00100", "01100", "00100", "00100", "01110"]],
    [1, ["00100", "00100", "00100", "00100", "01110"]],
    [1, ["00010", "00110", "00010", "00010", "00111"]],
    [1, ["01000", "11000", "01000", "01000", "11100"]],
    [1, ["00100", "01100", "00100", "00100", "00100"]],
    [1, ["00100", "00100", "00100", "00100", "00100"]],
  ];
  const dataset = patterns.map(([y, rows]) => ({
    x: rows.join("").split("").map(Number),
    y,
  }));
  class TinyNet {
    constructor() {
      let seed = 731;
      const rand = () => {
        seed = (1664525 * seed + 1013904223) >>> 0;
        return (seed / 4294967296 - 0.5) * 0.7;
      };
      this.w1 = Array.from({ length: 4 }, () =>
        Array.from({ length: 25 }, rand),
      );
      this.b1 = Array(4).fill(0);
      this.w2 = Array.from({ length: 2 }, () =>
        Array.from({ length: 4 }, rand),
      );
      this.b2 = [0.5, -0.5];
      this.epochs = 0;
    }
    forward(x) {
      const hidden = this.w1.map((row, j) =>
        sigmoid(row.reduce((s, w, i) => s + w * x[i], this.b1[j])),
      );
      const logits = this.w2.map((row, k) =>
        row.reduce((s, w, j) => s + w * hidden[j], this.b2[k]),
      );
      return { hidden, logits, probs: softmax(logits) };
    }
    loss(samples = dataset) {
      return (
        samples.reduce(
          (sum, { x, y }) =>
            sum - Math.log(Math.max(1e-12, this.forward(x).probs[y])),
          0,
        ) / samples.length
      );
    }
    gradient(samples = dataset) {
      const g = {
        w1: this.w1.map((r) => r.map(() => 0)),
        b1: this.b1.map(() => 0),
        w2: this.w2.map((r) => r.map(() => 0)),
        b2: this.b2.map(() => 0),
      };
      for (const { x, y } of samples) {
        const { hidden, probs } = this.forward(x);
        const d2 = probs.map((p, k) => p - Number(k === y));
        const d1 = hidden.map(
          (a, j) =>
            this.w2.reduce((sum, row, k) => sum + row[j] * d2[k], 0) *
            a *
            (1 - a),
        );
        d2.forEach((d, k) => {
          g.b2[k] += d;
          hidden.forEach((a, j) => (g.w2[k][j] += d * a));
        });
        d1.forEach((d, j) => {
          g.b1[j] += d;
          x.forEach((v, i) => (g.w1[j][i] += d * v));
        });
      }
      for (const key of ["w1", "w2"])
        g[key] = g[key].map((r) => r.map((v) => v / samples.length));
      for (const key of ["b1", "b2"])
        g[key] = g[key].map((v) => v / samples.length);
      return g;
    }
    train(samples = dataset, rate = 1) {
      const g = this.gradient(samples);
      for (const key of ["w1", "w2"])
        this[key] = this[key].map((r, i) =>
          r.map((v, j) => v - rate * g[key][i][j]),
        );
      for (const key of ["b1", "b2"])
        this[key] = this[key].map((v, i) => v - rate * g[key][i]);
      this.epochs++;
      return this.loss(samples);
    }
    weights() {
      return [...this.w1.flat(), ...this.b1, ...this.w2.flat(), ...this.b2];
    }
  }
  function temperature(base, t) {
    return softmax(base.map((p) => Math.log(p) / Math.max(0.05, t)));
  }
  function sample(probs, random = Math.random()) {
    let total = 0;
    for (let i = 0; i < probs.length; i++) {
      total += probs[i];
      if (random < total) return i;
    }
    return probs.length - 1;
  }
  const api = { TinyNet, dataset, temperature, sample };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.Learning = api;
})(typeof window === "undefined" ? null : window);
