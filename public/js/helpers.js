/**
 * ========================================
 * | BEGINNING OF HELPER METHODS
 * ========================================
 */

/**
 * function to process data
 */
function processData() {
  for (var year in ORIG_DATA) {
    YEARS.push(year);
    var yearData = ORIG_DATA[year];
    for (var i in yearData) {
      var obj = window.structuredClone(yearData[i]);

      logger.log('process data', obj);

      indicatorName = obj[FIELDS.IND_NAME];
      if (indicatorName in IND_MAP) {
        IND_MAP[indicatorName].push(obj);
      } else {
        IND_MAP[indicatorName] = [obj];
      }

      countryName = obj[FIELDS.CNT_NAME];
      if (countryName in ALL_CNTR_MAP) {
        ALL_CNTR_MAP[countryName].push(obj);

        if (countryName in FINAL_COUNTRIES) {
          // Store in country only groups
          if (countryName in CNTR_ONLY_MAP) {
            CNTR_ONLY_MAP[countryName].push(obj);
          } else {
            CNTR_ONLY_MAP[countryName] = [obj];
          }
        } else if (countryName in FINAL_DEMOGRAPHIC_OR_REGIONAL_GROUP) {
          // Store in regional / demographic groups
          if (countryName in DEMO_OR_RGN_MAP) {
            DEMO_OR_RGN_MAP[countryName].push(obj);
          } else {
            DEMO_OR_RGN_MAP[countryName] = [obj];
          }
        }
      } else {
        ALL_CNTR_MAP[countryName] = [obj];
      }
    }
  }

  logger.logActive('IND_MAP', IND_MAP);
  logger.logActive('ALL_CNTR_MAP', ALL_CNTR_MAP);
  logger.logActive('CNTR_ONLY_MAP', CNTR_ONLY_MAP);
  logger.logActive('DEMO_OR_RGN_MAP', DEMO_OR_RGN_MAP);
}

/**
 * adds options to the html elements
 * @param {html element} el
 * @param {arr} optionData
 */
function addOptions(el, optionData) {
  for (var i = 0; i < optionData.length; i++) {
    var option = createOption(optionData[i], optionData[i]);
    el.appendChild(option);
  }
}

/**
 * creates an html option element
 * @param {string} value
 * @param {string} innerText
 * @returns
 */
function createOption(value, innerText) {
  var option = document.createElement('option');
  option.value = value;
  option.innerText = innerText;
  return option;
}

/**
 * adds top N countries option elements by denominations of 10
 * @param {integer} size
 */
function addTopNOptions(size) {
  topNSelect.innerHTML = '';
  for (var i = 1; i < size / 10; i++) {
    var option = createOption(i * 10, i * 10);
    topNSelect.appendChild(option);
  }
  if (size % 10 > 0) {
    var option = createOption(size, `All (${size})`);
    topNSelect.appendChild(option);
  }
}

function renderBarChart(data) {
  console.log('renderBarChart', data);
  var tempData = data.slice(0, TOP_N);
  console.log('renderBarChart tempData', tempData);
  barChartDiv.innerHTML = '';
  d3Helper.bar({
    data: tempData,
    width: width,
    height: height,
    xKey: FIELDS.VALUE,
    yKey: FIELDS.CNT_NAME,
    cssSelector: SELECTORS.BAR_CHART,
    margin: margin,
  });
}

function calculateTotalRefugees() {
  var data = IND_MAP[IND_ORIGIN].filter((e) => {
    return (
      e[FIELDS.CNT_NAME] in FINAL_COUNTRIES &&
      e[FIELDS.VALUE] != '' &&
      e[FIELDS.YEAR] == CURRENT_YEAR
    );
  });
  var sum = 0;
  var value = data
    .map((e) => e[FIELDS.VALUE])
    .reduce((p, c) => {
      console.log('p, c', p, c);
      return parseInt(p) + parseInt(c);
    }, sum);

  totalRefugeeInYear = value; // update value
  totalRefSpan.forEach(
    (e) => (e.innerText = numberFormatter.format(totalRefugeeInYear))
  );
}

function calculateRegionalData() {
  summStat.innerHTML = '';
  var data = IND_MAP[IND_ORIGIN].filter((e) => {
    return (
      e[FIELDS.CNT_NAME] in FINAL_DEMOGRAPHIC_OR_REGIONAL_GROUP &&
      e[FIELDS.VALUE] != '' &&
      e[FIELDS.YEAR] == CURRENT_YEAR
    );
  });

  logger.logActive('calculateRegionalData', data);
  var ul = document.createElement('ul');
  for (var i = 0; i < data.length; i++) {
    var tempData = data[i];
    var li = document.createElement('li');
    li.innerHTML = `${
      tempData[FIELDS.CNT_NAME]
    }: <span class="colorRed">${numberFormatter.format(
      tempData[FIELDS.VALUE]
    )}</span>`;

    ul.appendChild(li);
  }
  summStat.appendChild(ul);
}
