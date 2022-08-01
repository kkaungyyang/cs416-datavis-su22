/**
 * This is the main execution file
 *
 * @Author Kaung Yang
 * Date: July 31st 2021
 */

var CTX = 'global.script.js';

logger.setScope(CTX);
logger.setActive(false);

/**
 * global variables // TODO: turn into const after
 */
var CURRENT_YEAR = '';
var YEARS = [];
var IND_MAP = {};
var ORIG_DATA = {};
var ALL_CNTR_MAP = {};
var CNTR_ONLY_MAP = {};
var DEMO_OR_RGN_MAP = {};
var CNTRS = {};
var TOP_N = 10;

var currBarData = [];
var totalRefugeeInYear = 0;

/**
 * chart configs
 */
let width = 500;
let height = 500;
let margin = { top: 50, bottom: 50, left: 150, right: 50 };

/**
 * selectors
 */
const SELECTORS = {
  BAR_CHART: 'div#barChart',
  YEAR_CONTROL: '#yearControl',
  TOP_N_SELECT: '#topNSelect',
  CLS_FOR_YEAR: '.forYear',
  CLS_TOT_REF: '.totalRefugees',
  SUMM_STAT: '#summStat',
  CLEAR_BTN: '#clearBtn',
  CMP_PNL: '#comparePanel',
  CMP_CARD: '.compareCard',
  CURR_MORE_INFO: '#currMoreInfo',
};

/**
 * selector elements
 */
var yearControl = document.querySelector(SELECTORS.YEAR_CONTROL);
var topNSelect = document.querySelector(SELECTORS.TOP_N_SELECT);
var forYear = document.querySelectorAll(SELECTORS.CLS_FOR_YEAR);
var barChartDiv = document.querySelector(SELECTORS.BAR_CHART);
var totalRefSpan = document.querySelectorAll(SELECTORS.CLS_TOT_REF);
var summStat = document.querySelector(SELECTORS.SUMM_STAT);
var clearBtn = document.querySelector(SELECTORS.CLEAR_BTN);
var comparePanel = document.querySelector(SELECTORS.CMP_PNL);
var currMoreInfo = document.querySelector(SELECTORS.CURR_MORE_INFO);
var compareCard = document.querySelectorAll(SELECTORS.CMP_CARD);

/**
 * read data
 */
(async () => {
  ORIG_DATA = await d3.json('data.json');
  logger.log('ORIG_DATA', ORIG_DATA);

  // populate data in the global area
  processData();

  // add year options to drop down
  addOptions(yearControl, YEARS);

  /**
   * year control listener
   */
  yearControl.addEventListener('change', (e) => {
    CURRENT_YEAR = e.target.value;
    TOP_N = 10;
    forYear.forEach((e) => (e.innerText = CURRENT_YEAR));

    // filter and sort data
    currBarData = IND_MAP[IND_ORIGIN].filter(
      (e) =>
        e[FIELDS.VALUE] != '' &&
        e[FIELDS.YEAR] == CURRENT_YEAR &&
        e[FIELDS.CNT_NAME] in FINAL_COUNTRIES
    ).sort((a, b) => b[FIELDS.VALUE] - a[FIELDS.VALUE]);

    logger.logActive('FILTERED BY YEAR', currBarData);

    var size = currBarData.length;
    addTopNOptions(size);
    calculateTotalRefugees();
    calculateRegionalData();
    renderBarChart(currBarData);
  });
  yearControl.value = '2020';
  yearControl.dispatchEvent(new Event('change'));

  /**
   * top N listener
   */
  topNSelect.addEventListener('change', (e) => {
    logger.logActive('topNSelect', e.target.value);
    logger.logActive('topNSelect', CURRENT_YEAR, CNTR_ONLY_MAP);
    TOP_N = e.target.value;
    renderBarChart(currBarData);
  });
  topNSelect.value = '10';
  topNSelect.dispatchEvent(new Event('change'));

  window.setInterval(() => {
    summStat.scrollBy(0, 1);
  }, 25);

  window.setInterval(() => {
    summStat.scrollTo(0, 0);
  }, 30000);

  /**
   * clear btn
   */
  clearBtn.addEventListener('click', (e) => {
    comparePanel.innerHTML = '';
  });
})();
