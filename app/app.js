// China in Numbers — routing and page rendering.
// One page, seven sections reached by hash links. Each section is rendered
// from window.CHINA_STATS, its charts drawn on canvas after the section is
// in the document, and every control on it (year picker, tabs, sort buttons,
// search box, view toggle) really works. Nothing here fetches anything.
// Charts are redrawn on resize so they stay sharp at any window width.

(function () {
  "use strict";

  var S = window.CHINA_STATS;
  var C = window.Charts;
  var view = document.getElementById("view");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var drawQueue = [];

  function src() {
    return S.source;
  }

  function cite(year) {
    return '<span class="cite">Source: ' + src() + ", " + year + "</span>";
  }

  function fmtTrillion(billionYuan) {
    return (billionYuan / 1000).toFixed(2) + " trillion";
  }

  function fmtBillion(billionYuan) {
    return billionYuan.toLocaleString("en-US") + " billion";
  }

  function statCard(label, value, unit, year) {
    return (
      '<article class="card stat"><p class="stat-label">' + label + "</p>" +
      '<p class="stat-value">' + value + ' <span class="stat-unit">' + unit + "</span></p>" +
      '<p class="stat-year">' + src() + ", " + year + "</p></article>"
    );
  }

  function drawLater(fn) {
    drawQueue.push(fn);
    requestAnimationFrame(function () {
      var fns = drawQueue;
      drawQueue = [];
      fns.forEach(function (f) { f(); });
    });
  }

  // ---------- Overview ----------

  function renderOverview() {
    var gdp2023 = S.gdp[4];
    var pop2023 = S.population[4];
    var urban2023 = S.urbanShare[4];
    var trade2023 = S.trade[4];
    var unemp2023 = S.unemployment[4];
    var html =
      '<section class="hero">' +
      "<h1>China in Numbers</h1>" +
      "<p class=\"lede\">The essential statistics of the world's second-largest economy — " +
      "population, output, trade, jobs, air and schools — drawn from the " +
      "National Bureau of Statistics of China and shown with the year each figure belongs to.</p>" +
      "</section>" +
      '<section class="grid stats-grid">' +
      statCard("Total population", "1.41", "billion", 2023) +
      statCard("GDP", "126.06", "trillion yuan", 2023) +
      statCard("GDP per capita", "89,358", "yuan", 2023) +
      statCard("Urban population", "66.2", "%", 2023) +
      statCard("Goods exports", "23.77", "trillion yuan", 2023) +
      statCard("Urban surveyed unemployment", "5.2", "%", 2023) +
      "</section>" +
      '<section class="card chart-card"><h2>GDP, 2019–2023</h2>' +
      '<p class="note">Gross domestic product at current prices. ' + cite(2023) + "</p>" +
      '<canvas id="chart-gdp" role="img" aria-label="Bar chart of GDP by year, 2019 to 2023"></canvas>' +
      '<p class="note">GDP rose from 98.65 trillion yuan in 2019 to 126.06 trillion in 2023 — ' +
      "real growth of 5.2% in 2023 after 3.0% in 2022.</p></section>" +
      '<section class="card"><h2>Find an indicator</h2>' +
      '<p class="note">Type to filter the table. Every row names its source and year.</p>' +
      '<input id="indicator-search" class="search" type="search" placeholder="Search indicators — try “exports”, “life” or “forest”…" aria-label="Search indicators">' +
      '<div class="table-wrap"><table id="indicator-table"><thead><tr><th>Indicator</th><th>Value</th><th>Year</th><th>Source</th></tr></thead><tbody>' +
      indicatorRows() +
      "</tbody></table></div>" +
      '<p class="note" id="indicator-count"></p></section>';
    view.innerHTML = html;
    drawLater(function () {
      var el = document.getElementById("chart-gdp");
      if (el) C.barChart(el, S.gdp.map(function (d) { return { label: d.year, value: d.value / 1000 }; }), { unit: "trillion yuan", highlightIndex: 4 });
    });
    var search = document.getElementById("indicator-search");
    var count = document.getElementById("indicator-count");
    var rows = Array.prototype.slice.call(document.querySelectorAll("#indicator-table tbody tr"));
    function updateCount() {
      var shown = rows.filter(function (r) { return r.style.display !== "none"; }).length;
      count.textContent = shown + " of " + rows.length + " indicators shown.";
    }
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      rows.forEach(function (r) {
        r.style.display = r.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
      });
      updateCount();
    });
    updateCount();
    void gdp2023; void pop2023; void urban2023; void trade2023; void unemp2023;
  }

  function indicatorRows() {
    var rows = [
      ["Total population", "1,409.67 million", 2023],
      ["GDP", "126,058.2 billion yuan", 2023],
      ["GDP per capita", "89,358 yuan", 2023],
      ["Urban population share", "66.16%", 2023],
      ["Goods exports", "23,772.6 billion yuan", 2023],
      ["Goods imports", "17,986.5 billion yuan", 2023],
      ["Consumer prices (CPI)", "+0.2% on 2022", 2023],
      ["Urban surveyed unemployment rate", "5.2%", 2023],
      ["Life expectancy", "78.6 years", 2023],
      ["Forest coverage", "24.02%", 2023],
      ["Average PM2.5, 339 cities", "30 µg/m³", 2023],
      ["Higher education gross enrolment", "60.2%", 2023],
      ["New urban jobs created", "12.44 million", 2023],
      ["Per capita disposable income", "39,218 yuan", 2023],
    ];
    return rows.map(function (r) {
      return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + src() + "</td></tr>";
    }).join("");
  }

  // ---------- Population ----------

  function renderPopulation() {
    var html =
      "<h1>Population</h1>" +
      '<p class="lede">China’s population peaked in 2021 and fell for a second year in 2023, ' +
      "while two in three people now live in towns and cities.</p>" +
      '<section class="grid stats-grid">' +
      statCard("Total population", "1,409.67", "million", 2023) +
      statCard("Births", "9.02", "million", 2023) +
      statCard("Deaths", "11.10", "million", 2023) +
      statCard("Urban share", "66.16", "%", 2023) +
      "</section>" +
      '<div class="tabs" role="tablist">' +
      '<button class="tab active" data-tab="trend" role="tab" aria-selected="true">Population trend</button>' +
      '<button class="tab" data-tab="age" role="tab" aria-selected="false">Age structure</button>' +
      '<button class="tab" data-tab="urban" role="tab" aria-selected="false">Urban &amp; rural</button>' +
      "</div>" +
      '<section class="card tab-pane" id="pane-trend"><h2>Year-end population, 2019–2023</h2>' +
      '<p class="note">Millions of people. ' + cite(2023) + "</p>" +
      '<canvas id="chart-pop" role="img" aria-label="Line chart of total population, 2019 to 2023"></canvas>' +
      "<p class=\"note\">The population fell by 2.08 million in 2023 — births of 9.02 million " +
      "against deaths of 11.10 million. The crude birth rate was 6.39 per thousand; the death rate 7.87.</p></section>" +
      '<section class="card tab-pane hidden" id="pane-age"><h2>Age structure, end of 2023</h2>' +
      '<p class="note">Millions of people. ' + cite(2023) + "</p>" +
      '<div class="table-wrap"><table><thead><tr><th>Age group</th><th>People</th><th>Share</th></tr></thead><tbody>' +
      S.age2023.map(function (a) {
        var share = ((a.value / 1409.67) * 100).toFixed(1);
        return "<tr><td>" + a.group + "</td><td>" + a.value.toFixed(2) + " million</td><td>" + share + "%</td></tr>";
      }).join("") +
      "</tbody></table></div>" +
      "<p class=\"note\">People aged 60 and over number 296.97 million — 21.1% of the population — " +
      "and 216.76 million are 65 or over (15.4%).</p></section>" +
      '<section class="card tab-pane hidden" id="pane-urban"><h2>Urban and rural, end of 2023</h2>' +
      '<p class="note">Share of the total population. ' + cite(2023) + "</p>" +
      '<canvas id="chart-urban" role="img" aria-label="Donut chart of urban and rural population shares"></canvas>' +
      "<p class=\"note\">The urbanisation rate reached 66.16% in 2023, up 0.94 points on 2022 — " +
      "about 932.67 million people in urban areas and 477.00 million in rural areas.</p></section>";
    view.innerHTML = html;
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    function drawTrend() {
      var el = document.getElementById("chart-pop");
      if (el) C.lineChart(el, S.population.map(function (d) { return { label: d.year, value: d.value }; }), { unit: "million people", decimals: 2 });
    }
    function drawUrban() {
      var el = document.getElementById("chart-urban");
      if (el) C.donutChart(el, [
        { label: "Urban", value: 66.16 },
        { label: "Rural", value: 33.84 },
      ], { centreTop: "66.2%", centreBottom: "urban" });
    }
    drawLater(drawTrend);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        document.querySelectorAll(".tab-pane").forEach(function (p) { p.classList.add("hidden"); });
        var pane = document.getElementById("pane-" + tab.getAttribute("data-tab"));
        pane.classList.remove("hidden");
        if (tab.getAttribute("data-tab") === "trend") drawLater(drawTrend);
        if (tab.getAttribute("data-tab") === "urban") drawLater(drawUrban);
      });
    });
  }

  // ---------- Economy ----------

  var selectedYear = 2023;

  function renderEconomy() {
    var html =
      "<h1>Economy</h1>" +
      '<p class="lede">Pick a year to see that year’s headline figures, then compare the five years in the chart and table below.</p>' +
      '<div class="year-picker" role="group" aria-label="Choose a year">' +
      S.years.map(function (y) {
        return '<button class="year-btn' + (y === selectedYear ? " active" : "") + '" data-year="' + y + '">' + y + "</button>";
      }).join("") +
      "</div>" +
      '<section class="grid stats-grid" id="economy-cards"></section>' +
      '<section class="card chart-card"><h2>GDP by year</h2>' +
      '<p class="note">Billion yuan at current prices. ' + cite(2023) + "</p>" +
      '<canvas id="chart-gdp-year" role="img" aria-label="Bar chart of GDP by year, 2019 to 2023"></canvas></section>' +
      '<section class="card"><h2>Economy by year</h2>' +
      '<p class="note">Click a column heading to sort the table. ' + cite(2023) + "</p>" +
      '<div class="table-wrap"><table id="economy-table"><thead><tr>' +
      '<th><button class="sort-btn" data-key="year">Year</button></th>' +
      '<th><button class="sort-btn" data-key="gdp">GDP (billion yuan)</button></th>' +
      '<th><button class="sort-btn" data-key="growth">Real growth (%)</button></th>' +
      '<th><button class="sort-btn" data-key="perCapita">GDP per capita (yuan)</button></th>' +
      '<th><button class="sort-btn" data-key="cpi">CPI (%)</button></th>' +
      '<th><button class="sort-btn" data-key="income">Disposable income (yuan)</button></th>' +
      "</tr></thead><tbody></tbody></table></div>" +
      '<p class="note">Structure of GDP in 2023: primary industry 7.1%, secondary industry 38.3%, ' +
      "tertiary industry 54.6%.</p></section>";
    view.innerHTML = html;
    var sortState = { key: "year", dir: 1 };
    function economyRows() {
      return S.years.map(function (y) {
        var g = S.gdp.find(function (d) { return d.year === y; });
        var pc = S.gdpPerCapita.find(function (d) { return d.year === y; });
        var c = S.cpi.find(function (d) { return d.year === y; });
        var inc = S.disposableIncome.find(function (d) { return d.year === y; });
        return { year: y, gdp: g.value, growth: g.growth, perCapita: pc.value, cpi: c.value, income: inc.value };
      });
    }
    function fillTable() {
      var rows = economyRows().sort(function (a, b) {
        return (a[sortState.key] - b[sortState.key]) * sortState.dir;
      });
      var tbody = document.querySelector("#economy-table tbody");
      tbody.innerHTML = rows.map(function (r) {
        return "<tr><td>" + r.year + "</td><td>" + fmtBillion(r.gdp) + "</td><td>" + r.growth.toFixed(1) + "</td><td>" +
          r.perCapita.toLocaleString("en-US") + "</td><td>" + (r.cpi > 0 ? "+" : "") + r.cpi.toFixed(1) + "</td><td>" +
          r.income.toLocaleString("en-US") + "</td></tr>";
      }).join("");
      document.querySelectorAll(".sort-btn").forEach(function (btn) {
        btn.classList.toggle("sorted", btn.getAttribute("data-key") === sortState.key);
        btn.textContent = btn.textContent.replace(/ [▲▼]$/, "") + (btn.getAttribute("data-key") === sortState.key ? (sortState.dir === 1 ? " ▲" : " ▼") : "");
      });
    }
    function fillCards() {
      var g = S.gdp.find(function (d) { return d.year === selectedYear; });
      var pc = S.gdpPerCapita.find(function (d) { return d.year === selectedYear; });
      var c = S.cpi.find(function (d) { return d.year === selectedYear; });
      var inc = S.disposableIncome.find(function (d) { return d.year === selectedYear; });
      document.getElementById("economy-cards").innerHTML =
        statCard("GDP, " + selectedYear, fmtTrillion(g.value), "yuan", selectedYear) +
        statCard("Real growth", "+" + g.growth.toFixed(1), "%", selectedYear) +
        statCard("GDP per capita", pc.value.toLocaleString("en-US"), "yuan", selectedYear) +
        statCard("Consumer prices", (c.value > 0 ? "+" : "") + c.value.toFixed(1), "%", selectedYear) +
        statCard("Disposable income per capita", inc.value.toLocaleString("en-US"), "yuan", selectedYear);
    }
    function drawChart() {
      var el = document.getElementById("chart-gdp-year");
      if (el) C.barChart(el, S.gdp.map(function (d) { return { label: d.year, value: d.value / 1000 }; }), {
        unit: "trillion yuan",
        highlightIndex: S.gdp.findIndex(function (d) { return d.year === selectedYear; }),
      });
    }
    fillCards();
    fillTable();
    drawLater(drawChart);
    document.querySelectorAll(".year-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedYear = Number(btn.getAttribute("data-year"));
        document.querySelectorAll(".year-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        fillCards();
        drawLater(drawChart);
      });
    });
    document.querySelectorAll(".sort-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-key");
        if (sortState.key === key) sortState.dir *= -1;
        else { sortState.key = key; sortState.dir = key === "year" ? 1 : -1; }
        fillTable();
      });
    });
  }

  // ---------- Trade ----------

  var partnerSort = { key: "value", dir: -1 };

  function renderTrade() {
    var html =
      "<h1>Trade</h1>" +
      '<p class="lede">China has been the world’s largest trader in goods since 2013. In 2023 ' +
      "exports slipped 0.6% while the surplus stayed above 5.7 trillion yuan.</p>" +
      '<section class="grid stats-grid">' +
      statCard("Goods exports", "23.77", "trillion yuan", 2023) +
      statCard("Goods imports", "17.99", "trillion yuan", 2023) +
      statCard("Total goods trade", "41.76", "trillion yuan", 2023) +
      statCard("Trade surplus", "5.79", "trillion yuan", 2023) +
      "</section>" +
      '<section class="card chart-card"><h2>Exports and imports by year</h2>' +
      '<p class="note">Billion yuan. ' + cite(2023) + "</p>" +
      '<canvas id="chart-trade" role="img" aria-label="Grouped bar chart of exports and imports, 2019 to 2023"></canvas></section>' +
      '<section class="card"><h2>Main trading partners, 2023</h2>' +
      '<p class="note">Total goods trade, trillion yuan. Click a heading to sort. ' + cite(2023) + "</p>" +
      '<div class="table-wrap"><table id="partner-table"><thead><tr>' +
      '<th><button class="sort-btn" data-key="partner">Partner</button></th>' +
      '<th><button class="sort-btn" data-key="value">Total trade (trillion yuan)</button></th>' +
      "</tr></thead><tbody></tbody></table></div>" +
      "<p class=\"note\">ASEAN has been China’s largest trading partner since 2020; the European Union " +
      "is second and the United States third.</p></section>";
    view.innerHTML = html;
    function fillPartners() {
      var rows = S.partners2023.slice().sort(function (a, b) {
        if (partnerSort.key === "partner") return a.partner.localeCompare(b.partner) * partnerSort.dir;
        return (a.value - b.value) * partnerSort.dir;
      });
      var tbody = document.querySelector("#partner-table tbody");
      tbody.innerHTML = rows.map(function (r) {
        return "<tr><td>" + r.partner + "</td><td>" + r.value.toFixed(2) + "</td></tr>";
      }).join("");
      document.querySelectorAll("#partner-table .sort-btn").forEach(function (btn) {
        var on = btn.getAttribute("data-key") === partnerSort.key;
        btn.textContent = btn.textContent.replace(/ [▲▼]$/, "") + (on ? (partnerSort.dir === 1 ? " ▲" : " ▼") : "");
      });
    }
    fillPartners();
    drawLater(function () {
      var el = document.getElementById("chart-trade");
      if (el) C.groupedBarChart(el, S.trade.map(function (t) {
        return { label: t.year, a: t.exports / 1000, b: t.imports / 1000 };
      }), { labels: ["Exports", "Imports"], unit: "trillion yuan" });
    });
    document.querySelectorAll("#partner-table .sort-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-key");
        if (partnerSort.key === key) partnerSort.dir *= -1;
        else { partnerSort.key = key; partnerSort.dir = key === "partner" ? 1 : -1; }
        fillPartners();
      });
    });
  }

  // ---------- Employment ----------

  var employmentView = "quarters";

  function renderEmployment() {
    var html =
      "<h1>Employment</h1>" +
      '<p class="lede">The surveyed urban unemployment rate averaged 5.2% in 2023, and 12.44 million ' +
      "new jobs were created in towns and cities.</p>" +
      '<section class="grid stats-grid">' +
      statCard("Urban surveyed unemployment", "5.2", "% average", 2023) +
      statCard("New urban jobs", "12.44", "million", 2023) +
      statCard("Urban employed persons", "470.83", "million", 2023) +
      "</section>" +
      '<div class="tabs" role="tablist">' +
      '<button class="tab active" data-view="quarters" role="tab" aria-selected="true">2023 by quarter</button>' +
      '<button class="tab" data-view="years" role="tab" aria-selected="false">Annual rate, 2019–2023</button>' +
      "</div>" +
      '<section class="card chart-card"><h2 id="employment-chart-title">Surveyed urban unemployment rate by quarter, 2023</h2>' +
      '<p class="note">Percent. ' + cite(2023) + "</p>" +
      '<canvas id="chart-employment" role="img" aria-label="Bar chart of the surveyed urban unemployment rate"></canvas>' +
      '<p class="note" id="employment-note">The rate eased through the year, from 5.5% in the first quarter to 5.1% in the fourth.</p></section>' +
      '<section class="card"><h2>What the figures mean</h2>' +
      "<p>The surveyed unemployment rate covers urban residents aged 16 and over who are out of work " +
      "and looking for it. It is published monthly and averaged here by quarter and by year. " +
      "The 2023 average of 5.2% was 0.4 points lower than 2022, and the year’s target of around 5.5% " +
      "was met. " + cite(2023) + "</p></section>";
    view.innerHTML = html;
    function draw() {
      var el = document.getElementById("chart-employment");
      if (!el) return;
      if (employmentView === "quarters") {
        document.getElementById("employment-chart-title").textContent = "Surveyed urban unemployment rate by quarter, 2023";
        document.getElementById("employment-note").textContent = "The rate eased through the year, from 5.5% in the first quarter to 5.1% in the fourth.";
        C.barChart(el, S.unemploymentQuarters2023.map(function (q) { return { label: q.quarter, value: q.value }; }), { unit: "%", highlightIndex: 0 });
      } else {
        document.getElementById("employment-chart-title").textContent = "Surveyed urban unemployment rate by year, 2019–2023";
        document.getElementById("employment-note").textContent = "The rate spiked to 5.6% in 2020 and again in 2022, then fell back to 5.2% in 2023.";
        C.barChart(el, S.unemployment.map(function (d) { return { label: d.year, value: d.value }; }), { unit: "%", highlightIndex: 4 });
      }
    }
    drawLater(draw);
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        employmentView = tab.getAttribute("data-view");
        document.querySelectorAll(".tab").forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        drawLater(draw);
      });
    });
  }

  // ---------- Environment ----------

  function renderEnvironment() {
    var html =
      "<h1>Environment</h1>" +
      '<p class="lede">Air got cleaner over five years even as the economy grew; forest cover ' +
      "passed 24% and energy use per unit of output kept falling.</p>" +
      '<section class="grid stats-grid">' +
      statCard("Forest coverage", "24.02", "%", 2023) +
      statCard("Average PM2.5", "30", "µg/m³", 2023) +
      statCard("Days with good air", "85.5", "%", 2023) +
      statCard("Energy use per unit GDP", "−2.5", "% on 2022", 2023) +
      "</section>" +
      '<section class="card chart-card"><h2>Average PM2.5, 2019–2023</h2>' +
      '<p class="note">Micrograms per cubic metre, average across 339 prefecture-level cities. ' + cite(2023) + "</p>" +
      '<canvas id="chart-pm25" role="img" aria-label="Line chart of average PM2.5 concentration, 2019 to 2023"></canvas>' +
      "<p class=\"note\">Average PM2.5 fell from 36 µg/m³ in 2019 to 29 in 2022, then ticked up to 30 in 2023. " +
      "The share of days with good air quality in those cities was 85.5% in 2023.</p></section>" +
      '<section class="card"><h2>What else changed in 2023</h2>' +
      "<ul class=\"facts\">" +
      "<li>Forest coverage reached 24.02% of the land area.</li>" +
      "<li>Energy consumption per 10,000 yuan of GDP fell 2.5% on the year before.</li>" +
      "<li>Afforestation covered 3.998 million hectares during the year.</li>" +
      "</ul>" +
      '<p class="note">' + cite(2023) + "</p></section>";
    view.innerHTML = html;
    drawLater(function () {
      var el = document.getElementById("chart-pm25");
      if (el) C.lineChart(el, S.pm25.map(function (d) { return { label: d.year, value: d.value }; }), { unit: "µg/m³" });
    });
  }

  // ---------- Education & Health ----------

  function renderEducationHealth() {
    var html =
      "<h1>Education &amp; Health</h1>" +
      '<p class="lede">People live longer, stay in school longer, and nearly everyone is covered ' +
      "by basic medical insurance.</p>" +
      '<section class="grid stats-grid">' +
      statCard("Life expectancy", "78.6", "years", 2023) +
      statCard("Higher education enrolment", "60.2", "% gross", 2023) +
      statCard("Compulsory education consolidation", "95.7", "%", 2023) +
      statCard("Basic medical insurance", "1.33", "billion people", 2023) +
      "</section>" +
      '<section class="card"><h2>Education, 2023</h2>' +
      '<div class="table-wrap"><table><thead><tr><th>Indicator</th><th>Value</th></tr></thead><tbody>' +
      "<tr><td>Gross enrolment rate, higher education</td><td>60.2%</td></tr>" +
      "<tr><td>Consolidation rate, nine-year compulsory education</td><td>95.7%</td></tr>" +
      "<tr><td>Regular institutions of higher education</td><td>3,074</td></tr>" +
      "<tr><td>Students in regular higher education</td><td>47.63 million</td></tr>" +
      "</tbody></table></div>" +
      '<p class="note">' + cite(2023) + "</p></section>" +
      '<section class="card"><h2>Health, 2023</h2>' +
      '<div class="table-wrap"><table><thead><tr><th>Indicator</th><th>Value</th></tr></thead><tbody>' +
      "<tr><td>Life expectancy at birth</td><td>78.6 years</td></tr>" +
      "<tr><td>Medical and health institutions</td><td>1.07 million</td></tr>" +
      "<tr><td>People covered by basic medical insurance</td><td>1.33 billion</td></tr>" +
      "<tr><td>Hospital beds per 10,000 people</td><td>74.4</td></tr>" +
      "</tbody></table></div>" +
      '<p class="note">Basic medical insurance covers more than 95% of the population. ' + cite(2023) + "</p></section>";
    view.innerHTML = html;
  }

  // ---------- Router ----------

  var ROUTES = {
    "": renderOverview,
    "/": renderOverview,
    "/population": renderPopulation,
    "/economy": renderEconomy,
    "/trade": renderTrade,
    "/employment": renderEmployment,
    "/environment": renderEnvironment,
    "/education-health": renderEducationHealth,
  };

  function route() {
    var hash = window.location.hash.replace(/^#/, "") || "/";
    var render = ROUTES[hash] || ROUTES["/"];
    window.scrollTo(0, 0);
    render();
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace(/^#/, "") || "/";
      a.classList.toggle("active", target === hash || (hash === "/" && target === "/"));
      if (target === hash) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(route, 180);
  });
  window.addEventListener("hashchange", route);
  route();
})();
