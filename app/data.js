// China in Numbers — the figures behind the site.
// Every figure below comes from the National Bureau of Statistics of China
// (annual Statistical Communiqué and China Statistical Yearbook figures for
// 2019-2023). Each entry carries its source and year so the page can cite
// it next to the number. Values are year-end or full-year figures unless
// the label says otherwise. Amounts are in yuan; population in millions.
// Figures were checked against the 2023 Statistical Communiqué release.

window.CHINA_STATS = {
  source: "National Bureau of Statistics of China",
  years: [2019, 2020, 2021, 2022, 2023],

  // Gross domestic product, billion yuan, current prices.
  gdp: [
    { year: 2019, value: 98651.5, growth: 6.0 },
    { year: 2020, value: 101356.7, growth: 2.2 },
    { year: 2021, value: 114923.7, growth: 8.6 },
    { year: 2022, value: 120472.4, growth: 3.0 },
    { year: 2023, value: 126058.2, growth: 5.2 },
  ],
  // GDP per capita, yuan.
  gdpPerCapita: [
    { year: 2019, value: 70078 },
    { year: 2020, value: 72000 },
    { year: 2021, value: 81370 },
    { year: 2022, value: 85698 },
    { year: 2023, value: 89358 },
  ],
  // Shares of GDP by sector, percent, 2023.
  gdpSectors2023: [
    { sector: "Primary industry", share: 7.1 },
    { sector: "Secondary industry", share: 38.3 },
    { sector: "Tertiary industry", share: 54.6 },
  ],
  // Consumer price index, percent change on previous year.
  cpi: [
    { year: 2019, value: 2.9 },
    { year: 2020, value: 2.5 },
    { year: 2021, value: 0.9 },
    { year: 2022, value: 2.0 },
    { year: 2023, value: 0.2 },
  ],
  // Per capita disposable income of residents, yuan.
  disposableIncome: [
    { year: 2019, value: 30733 },
    { year: 2020, value: 32189 },
    { year: 2021, value: 35128 },
    { year: 2022, value: 36883 },
    { year: 2023, value: 39218 },
  ],

  // Year-end total population, millions.
  population: [
    { year: 2019, value: 1410.08 },
    { year: 2020, value: 1411.78 },
    { year: 2021, value: 1412.60 },
    { year: 2022, value: 1411.75 },
    { year: 2023, value: 1409.67 },
  ],
  // Births and deaths, millions, 2023.
  births2023: 9.02,
  deaths2023: 11.10,
  // Crude rates per thousand, 2023.
  birthRate2023: 6.39,
  deathRate2023: 7.87,
  // Urbanisation: share of population living in urban areas, percent.
  urbanShare: [
    { year: 2019, value: 60.60 },
    { year: 2020, value: 63.89 },
    { year: 2021, value: 64.72 },
    { year: 2022, value: 65.22 },
    { year: 2023, value: 66.16 },
  ],
  // Age structure, millions, year-end 2023.
  age2023: [
    { group: "Aged 0–14", value: 230.06 },
    { group: "Aged 15–59", value: 865.52 },
    { group: "Aged 60 and over", value: 296.97 },
    { group: "Aged 65 and over", value: 216.76 },
  ],

  // Goods trade, billion yuan.
  trade: [
    { year: 2019, exports: 17298.6, imports: 14311.7 },
    { year: 2020, exports: 17932.6, imports: 14183.3 },
    { year: 2021, exports: 21734.8, imports: 17385.4 },
    { year: 2022, exports: 23965.4, imports: 18102.9 },
    { year: 2023, exports: 23772.6, imports: 17986.5 },
  ],
  // Total goods trade with main partners, trillion yuan, 2023.
  partners2023: [
    { partner: "ASEAN", value: 6.41 },
    { partner: "European Union", value: 5.51 },
    { partner: "United States", value: 4.67 },
    { partner: "Japan", value: 2.38 },
    { partner: "South Korea", value: 2.29 },
    { partner: "United Kingdom", value: 1.02 },
  ],

  // Urban surveyed unemployment rate, average for the year, percent.
  unemployment: [
    { year: 2019, value: 5.2 },
    { year: 2020, value: 5.6 },
    { year: 2021, value: 5.1 },
    { year: 2022, value: 5.6 },
    { year: 2023, value: 5.2 },
  ],
  // 2023 surveyed urban unemployment rate by quarter, percent.
  unemploymentQuarters2023: [
    { quarter: "Q1", value: 5.5 },
    { quarter: "Q2", value: 5.2 },
    { quarter: "Q3", value: 5.2 },
    { quarter: "Q4", value: 5.1 },
  ],
  newUrbanJobs2023: 12.44, // millions
  urbanEmployed2023: 470.83, // millions, year-end

  // Environment: 339 prefecture-level cities, 2023 unless noted.
  pm25: [
    { year: 2019, value: 36 },
    { year: 2020, value: 33 },
    { year: 2021, value: 30 },
    { year: 2022, value: 29 },
    { year: 2023, value: 30 },
  ], // average PM2.5 concentration, micrograms per cubic metre
  goodAirDays2023: 85.5, // percent of days with good air quality
  forestCoverage2023: 24.02, // percent
  energyIntensityChange2023: -2.5, // percent change in energy use per unit GDP

  // Education and health, 2023.
  lifeExpectancy2023: 78.6, // years
  higherEducationEnrolment2023: 60.2, // gross enrolment rate, percent
  compulsoryConsolidation2023: 95.7, // nine-year compulsory education consolidation rate, percent
  higherInstitutions2023: 3074, // regular institutions of higher education
  medicalInstitutions2023: 1.07, // millions
  basicInsuranceParticipants2023: 1.33, // billions of people
};
