// China in Numbers — small canvas chart helpers.
// No libraries: every chart is drawn with the plain Canvas 2D API, scaled
// for high-DPI screens, and redrawn when its container changes size.
// Each helper takes a canvas element and an array of {label, value} points
// plus an options object, and returns nothing. Colours match the site
// palette in style.css so charts and cards read as one design.

window.Charts = (function () {
  "use strict";

  var INK = "#14365d";
  var MUTED = "#5b6b7d";
  var GRID = "#e3e8ee";
  var BLUE = "#1d5c9e";
  var AMBER = "#e8a33d";
  var TEAL = "#1f7a6d";
  var LIGHT_BLUE = "#7fb3d8";

  function setup(canvas, cssHeight) {
    var dpr = window.devicePixelRatio || 1;
    var width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
    var height = cssHeight || 260;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = height + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.font = "12px system-ui, -apple-system, 'Segoe UI', sans-serif";
    return { ctx: ctx, width: width, height: height };
  }

  function niceMax(max) {
    var pow = Math.pow(10, Math.floor(Math.log10(max)));
    var n = max / pow;
    var f = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return f * pow;
  }

  function formatValue(v) {
    if (Math.abs(v) >= 1000) return v.toLocaleString("en-US");
    if (Math.abs(v) >= 100) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  function axes(ctx, x0, y0, x1, y1, max, ticks) {
    ctx.strokeStyle = GRID;
    ctx.fillStyle = MUTED;
    ctx.lineWidth = 1;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (var i = 0; i <= ticks; i++) {
      var v = (max * i) / ticks;
      var y = y1 - ((y1 - y0) * i) / ticks;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.fillText(formatValue(v), x0 - 8, y);
    }
  }

  // Vertical bars, one series. options: {color, unit, highlightIndex}
  function barChart(canvas, points, options) {
    var o = options || {};
    var g = setup(canvas, o.height || 280);
    var ctx = g.ctx;
    var padL = 64, padR = 12, padT = 18, padB = 30;
    var plotW = g.width - padL - padR;
    var plotH = g.height - padT - padB;
    var max = niceMax(Math.max.apply(null, points.map(function (p) { return p.value; })) * 1.08);
    axes(ctx, padL, padT, padL + plotW, padT + plotH, max, 4);
    var slot = plotW / points.length;
    var barW = Math.min(64, slot * 0.55);
    points.forEach(function (p, i) {
      var h = (plotH * p.value) / max;
      var x = padL + slot * i + (slot - barW) / 2;
      var y = padT + plotH - h;
      ctx.fillStyle = o.highlightIndex === i ? AMBER : (o.color || BLUE);
      ctx.beginPath();
      ctx.rect(x, y, barW, h);
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(formatValue(p.value), x + barW / 2, y - 5);
      ctx.fillStyle = MUTED;
      ctx.textBaseline = "top";
      ctx.fillText(String(p.label), x + barW / 2, padT + plotH + 8);
    });
    if (o.unit) {
      ctx.fillStyle = MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(o.unit, padL, 0);
    }
  }

  // Line chart with dots and value labels. options: {color, unit, decimals}
  function lineChart(canvas, points, options) {
    var o = options || {};
    var g = setup(canvas, o.height || 280);
    var ctx = g.ctx;
    var padL = 64, padR = 20, padT = 24, padB = 30;
    var plotW = g.width - padL - padR;
    var plotH = g.height - padT - padB;
    var values = points.map(function (p) { return p.value; });
    var lo = Math.min.apply(null, values);
    var hi = Math.max.apply(null, values);
    var span = hi - lo || 1;
    lo = lo - span * 0.25;
    hi = hi + span * 0.25;
    var max = niceMax(hi);
    var min = Math.max(0, lo - ((lo % (max / 4)) || 0));
    axes(ctx, padL, padT, padL + plotW, padT + plotH, max, 4);
    function px(i) { return padL + (plotW * i) / (points.length - 1); }
    function py(v) { return padT + plotH - ((plotH * (v - min)) / (max - min)); }
    ctx.strokeStyle = o.color || TEAL;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(px(i), py(p.value));
      else ctx.lineTo(px(i), py(p.value));
    });
    ctx.stroke();
    points.forEach(function (p, i) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = o.color || TEAL;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px(i), py(p.value), 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      var label = o.decimals ? p.value.toFixed(o.decimals) : formatValue(p.value);
      ctx.fillText(label, px(i), py(p.value) - 10);
      ctx.fillStyle = MUTED;
      ctx.textBaseline = "top";
      ctx.fillText(String(p.label), px(i), padT + plotH + 8);
    });
    if (o.unit) {
      ctx.fillStyle = MUTED;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(o.unit, padL, 0);
    }
  }

  // Donut with a centre label and a legend drawn beside it.
  // options: {colors, centreTop, centreBottom}
  function donutChart(canvas, slices, options) {
    var o = options || {};
    var g = setup(canvas, o.height || 260);
    var ctx = g.ctx;
    var cx = 120, cy = g.height / 2, r = Math.min(92, g.height / 2 - 16);
    var total = slices.reduce(function (s, p) { return s + p.value; }, 0);
    var colors = o.colors || [BLUE, AMBER, TEAL, LIGHT_BLUE];
    var angle = -Math.PI / 2;
    slices.forEach(function (p, i) {
      var frac = p.value / total;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + frac * Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      angle += frac * Math.PI * 2;
    });
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 20px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText(o.centreTop || "", cx, cy - 12);
    ctx.font = "12px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillStyle = MUTED;
    ctx.fillText(o.centreBottom || "", cx, cy + 12);
    var lx = cx + r + 28, ly = 26;
    slices.forEach(function (p, i) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(lx, ly - 6, 12, 12);
      ctx.fillStyle = INK;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      var pct = ((p.value / total) * 100).toFixed(1) + "%";
      ctx.fillText(p.label + " — " + pct, lx + 20, ly);
      ly += 28;
    });
  }

  // Grouped bars, two series. options: {labels, unit, colors}
  function groupedBarChart(canvas, groups, options) {
    var o = options || {};
    var g = setup(canvas, o.height || 300);
    var ctx = g.ctx;
    var padL = 64, padR = 12, padT = 18, padB = 30;
    var plotW = g.width - padL - padR;
    var plotH = g.height - padT - padB;
    var all = [];
    groups.forEach(function (grp) { all.push(grp.a, grp.b); });
    var max = niceMax(Math.max.apply(null, all) * 1.08);
    axes(ctx, padL, padT, padL + plotW, padT + plotH, max, 4);
    var colors = o.colors || [BLUE, AMBER];
    var slot = plotW / groups.length;
    var barW = Math.min(34, slot * 0.28);
    groups.forEach(function (grp, i) {
      var x0 = padL + slot * i + (slot - barW * 2 - 6) / 2;
      [[grp.a, colors[0]], [grp.b, colors[1]]].forEach(function (pair, j) {
        var h = (plotH * pair[0]) / max;
        var x = x0 + j * (barW + 6);
        var y = padT + plotH - h;
        ctx.fillStyle = pair[1];
        ctx.beginPath();
        ctx.rect(x, y, barW, h);
        ctx.fill();
        ctx.fillStyle = INK;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(formatValue(pair[0]), x + barW / 2, y - 5);
      });
      ctx.fillStyle = MUTED;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(String(grp.label), padL + slot * i + slot / 2, padT + plotH + 8);
    });
    // Legend
    var lx = padL, ly = 0;
    (o.labels || ["Series A", "Series B"]).forEach(function (name, i) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(lx, ly, 12, 12);
      ctx.fillStyle = INK;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(name, lx + 18, ly + 6);
      lx += 18 + ctx.measureText(name).width + 28;
    });
    if (o.unit) {
      ctx.fillStyle = MUTED;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(o.unit, g.width - padR, 0);
    }
  }

  return {
    barChart: barChart,
    lineChart: lineChart,
    donutChart: donutChart,
    groupedBarChart: groupedBarChart,
  };
})();
