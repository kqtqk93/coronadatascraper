import assert from 'assert';
import * as fetch from '../../lib/fetch/index.js';
import * as parse from '../../lib/parse.js';
import maintainers from '../../lib/maintainers.js';
import getKey from '../../utils/get-key.js';

const labelFragmentsByKey = [
  { discard: 'confirmed case' },
  { cases: 'probable case' }, // Recovered is often higher than confirmed, so use probable number.
  { recovered: 'recovered cases' },
  { deaths: 'deaths' },
  { discard: 'cases in hospital' },
  { discard: 'currently in hospital' }
];

const scraper = {
  country: 'iso1:NZ',
  maintainers: [maintainers.camjc],
  priority: 1,
  sources: [
    {
      description: 'New Zealand Government Ministry of Health',
      name: 'New Zealand Government Ministry of Health',
      url: 'https://www.health.govt.nz'
    }
  ],
  type: 'table',
  url:
    'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases',
  async scraper() {
    const data = {};
    const $ = await fetch.page(this, this.url, 'default');
    const $table = $('h2:contains("Summary") + table');
    const $trs = $table.find('tbody tr');
    $trs.each((index, tr) => {
      const $tr = $(tr);
      const key = getKey({ label: $tr.find('th').text(), labelFragmentsByKey });
      const value = $tr.find('td:first-of-type').text();
      data[key] = parse.number(value);
    });
    assert(data.cases > 0, 'Cases is not reasonable');
    return data;
  }
};

export default scraper;