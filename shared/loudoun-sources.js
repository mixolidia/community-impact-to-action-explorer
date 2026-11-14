// Visitors and the brief skill use the same curated notes.
export const loudounSources = [
  {
    id: 'W1',
    issues: ['water'],
    name: 'Loudoun County: Water Considerations',
    url: 'https://www.loudoun.gov/6402/Water-Considerations',
    description: 'The county describes several cooling methods. Loudoun Water supplies reclaimed wastewater to some customers, reducing demand for drinking water where that system is available. Developers typically consult local water and wastewater authorities about available capacity. The county’s special exception process gives the public and county officials more visibility into proposed projects.',
  },
  {
    id: 'W2',
    issues: ['water'],
    name: 'ICPRB: Data Centers and Water Use in the Potomac River Basin',
    url: 'https://www.potomacriver.org/focus-areas/water-resources-and-drinking-water/water-resources/planning/data-centers-and-water-use-in-the-potomac-river-basin/',
    description: 'ICPRB used aggregated utility data and describes summer demand peaks when river flows tend to be low. Its baseline projects that data centers in the Washington metropolitan area could consume about 22 million gallons per day on average in 2050. These totals do not give water use at a particular facility. Cooling methods that use less water can use more electricity. Reclaimed water reduces drinking water demand, while evaporation in water-based cooling can reduce the amount returned to the river.',
  },
  {
    id: 'N1',
    issues: ['noise', 'air'],
    name: 'Loudoun County: Noise and Air Quality Concerns',
    url: 'https://www.loudoun.gov/6405/Noise-Air-Quality-Concerns',
    description: 'The county identifies cooling equipment and generators as potential noise sources and reports recurring tonal noise complaints. A-weighted measurements can miss low-frequency or tonal noise. Measuring a wider range of frequencies requires suitable equipment and training. Zoning Enforcement investigates potential zoning violations. The page also describes Virginia DEQ’s local air monitoring.',
  },
  {
    id: 'N2',
    issues: ['noise'],
    name: 'Loudoun County: Data Center Zoning Standards',
    url: 'https://www.loudoun.gov/5956/Zoning-Ordinance-Rewrite-Change-Highligh',
    description: 'The county’s Chapter 4 summary describes soundproofing for mechanical equipment, building setbacks, pre- and post-construction noise studies, and limits on generator testing hours for data centers next to residential property. Check which rules apply at the specific site and request post-construction measurements to see how well the controls work.',
  },
  {
    id: 'A1',
    issues: ['air', 'noise'],
    name: 'Loudoun County: Energy Issues and Considerations',
    url: 'https://www.loudoun.gov/6404/Energy-Issues-Considerations',
    description: 'Diesel backup generators can emit nitrogen oxides and particulate matter. The county describes cleaner standards and exhaust treatment for new or modified generators. Batteries can provide temporary power while their stored charge lasts. The county says emergency generator operation is generally exempt from county noise provisions. Virginia DEQ regulates outdoor air quality.',
  },
  {
    id: 'A2',
    issues: ['air'],
    name: 'Virginia JLARC: Data Centers in Virginia (2024)',
    url: 'https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp',
    description: 'The 2024 report estimates diesel data center generators contribute less than 4% of regional nitrogen oxide emissions and 0.1% or less of regional carbon monoxide and particulate matter emissions in Northern Virginia. Regional emissions inventories do not establish pollutant concentrations near a facility. JLARC describes further DEQ study to assess local air quality.',
  },
];

// These options and limitations are checked against the linked source notes.
export const mitigationOptions = {
  water: [
    '**Use reclaimed water where available.** Reusing treated wastewater reduces demand for drinking water [W1]. When cooling relies on evaporation, water can still be lost before it returns to the river [W2].',
    '**Consider cooling methods that use less water.** They can reduce freshwater demand, but may require more electricity. Ask for both water and energy estimates for the proposed equipment [W2].',
  ],
  noise: [
    '**Soundproof mechanical equipment.** Loudoun County lists soundproofing as a control for data centers next to homes [N2]. Checking how well it works across frequencies requires equipment and training beyond a standard A-weighted measurement [N1].',
    '**Limit scheduled generator testing hours.** The county lists limits for data centers next to homes [N2]. These limits address scheduled testing, while emergency generator operation is generally exempt from county noise provisions [A1].',
  ],
  air: [
    '**Use cleaner generators with exhaust treatment.** Exhaust controls reduce nitrogen oxide and particulate emissions. The stricter standards apply to new or modified generators. Ask which existing units have those controls [A1].',
    '**Use batteries for short backup needs.** Batteries can supply temporary power during an outage. Their stored charge limits how long they can do so [A1].',
  ],
};
