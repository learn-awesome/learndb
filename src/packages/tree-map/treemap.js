import * as d3 from 'd3';

export const render = (alltopics, el) => {
  let data = alltopics.slice(0, -1).reduce((acc, d, i) => {
    let { name, parent_id, display_name } = d;
    let [gp, n] = name.split('»');
    let parentId;
    if (n) {
      parentId = parent_id === gp ? 'top' : parent_id || 'top';
    } else if (parent_id) {
      gp = parent_id;
      parentId = 'top';
    } else {
      gp = 'misc';
      parentId = 'top';
    }
    if (!acc[gp]) acc[gp] = { id: gp, value: 0, parentId, items: [] };
    acc[gp].items.push(n || display_name);
    acc[gp].value = Math.min(acc[gp].value + 1, 200);
    return acc;
  }, {});
  data = Object.values(data);
  console.log(data);

  data.push({ id: 'top', parentId: undefined });

  function browserDimensions() {
    var w = 0,
      h = 0;
    if (typeof window.innerWidth == 'number') {
      //Non-IE
      w = window.innerWidth;
      h = window.innerHeight;
    } else if (
      document.documentElement &&
      (document.documentElement.clientWidth || document.documentElement.clientHeight)
    ) {
      //IE 6+ in 'standards compliant mode'
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      //IE 4 compatible
      w = document.body.clientWidth;
      h = document.body.clientHeight;
    }
    return [w, h];
  }

  const [w, h] = browserDimensions();
  let width = w - 320;
  let height = h;

  data.sort((a, b) => b.value - a.value);
  let root = d3.stratify()(data);
  root.sum((d) => {
    console.log('v', d.id, d.value);
    return Math.max(+d.value, 3);
  });
  d3.treemap().size([width, height]).padding(4)(root);

  var svg = d3.select(el).append('svg').attr('width', width).attr('height', height).append('g');

  svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return d.x0;
    })
    .attr('y', function (d) {
      return d.y0;
    })
    .attr('width', function (d) {
      return d.x1 - d.x0;
    })
    .attr('height', function (d) {
      return d.y1 - d.y0;
    })
    .on('click', (evt, d) => {
      window.parent.location.href = '/#/topic/' + d.id;
    });

  // and to add the text labels
  svg
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', function (d) {
      return d.x0 + 10;
    })
    .attr('y', function (d) {
      return d.y0 + 20;
    })
    .text(function (d) {
      return d.id;
    });
};
