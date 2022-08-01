/**
 * This is the controllers file, with helper methods
 *
 * @Author Kaung Yang
 * Date: July 31st 2021
 */

/**
 * logs data to console
 */
class Logger {
  constructor(currFile) {
    this.currFile = currFile || 'global';
    this.active = false;
  }

  setActive(flag) {
    this.active = flag;
  }

  setScope(fileName) {
    if (fileName) {
      this.currFile = fileName;
    }
  }

  log1(doPrint, ctx, ...messages) {
    if (doPrint) {
      var str = [this.currFile];
      str.push(ctx);
      for (var i in messages) {
        var msg = messages[i];
        str.push(msg);
        str.push('\n');
      }
      console.log(...str);
    }
  }

  logActive(ctx, ...messages) {
    this.log1(true, ctx, messages);
  }

  log(ctx, ...messages) {
    this.log1(this.active, ctx, messages);
  }
}

/**
 * controls system settings
 */
class SystemController {
  constructor() {}

  setNavColor() {
    let navLinks = document.querySelectorAll('nav a');
    let pathName = window.location.pathname;
    navLinks.forEach((e) => {
      pathName = pathName.toLowerCase();
      console.log(pathName);
      if (
        (pathName == '/' || pathName.includes('index.html')) &&
        e.id.toLowerCase() == 'home'
      ) {
        e.classList.add('js-bg');
      } else if (pathName.includes(e.id.toLowerCase())) {
        e.classList.add('js-bg');
      }
    });
  }
}

/**
 * controls the processing of data
 */
class DataProcessor {
  constructor() {}
}

/**
 * helps render bar chart
 */
class D3Helper {
  construtor() {}

  bar(opts) {
    if (!opts) return;

    var data = opts.data || [];
    var xKey = opts.xKey || 'Value';
    var yKey = opts.yKey || FIELDS.CNT_NAME;
    var width = opts.width;
    var height = opts.height;
    var cssSelector = opts.cssSelector;
    var margin = opts.margin;

    var svg = d3
      .select(cssSelector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // X axis
    var x = d3.scaleLinear().domain([0, data[0][xKey]]).range([0, width]);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(
        data.map(function (d) {
          return d[yKey];
        })
      )
      .padding(0.05);
    svg.append('g').call(d3.axisLeft(y));

    //Bars
    svg
      .selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', function (d) {
        return y(d[yKey]);
      })
      .attr('value', function (d) {
        return JSON.stringify(d);
      })
      .attr('width', function (d) {
        return x(d[xKey]);
      })
      .attr('height', y.bandwidth())
      .attr('fill', '#0078d8');

    svg
      .selectAll('rect')
      .on('mouseover', function (e) {
        d3.select(this).style('fill', 'orange').style('cursor', 'pointer');
        console.log(e, this);

        console.log(JSON.parse(this.getAttribute('value')));
        // console.log(d3.event, d3.mouse(this));
        var dataObj = JSON.parse(this.getAttribute('value'));
        currMoreInfo.innerHTML = `<div>
          <ul>
          <li>Country Name: ${dataObj[FIELDS.CNT_NAME]}</li>
          <li>Year: ${dataObj[FIELDS.YEAR]}</li>
          <li>Number of refugees: <span class="colorRed">${numberFormatter.format(
            dataObj[FIELDS.VALUE]
          )}<span></li>
          </ul>
        </div>`;
      })
      .on('mouseout', function (e) {
        d3.select(this).style('fill', '#0078d8');
      })
      .on('click', function (e) {
        console.log('getting clicked', this);
        addCompareCard(JSON.parse(this.getAttribute('value')));
      });
  }
}

/**
 * global variable accessors
 */
let logger = new Logger();
let systemController = new SystemController();
systemController.setNavColor();

let d3Helper = new D3Helper();
let dataProcessor = new DataProcessor();

let numberFormatter = new Intl.NumberFormat('en-US');
