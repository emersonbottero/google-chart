/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {GoogleCharts} from './googleCharts.js';
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';

class GoogleChart extends  mixinBehaviors([IronResizableBehavior], PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }       
      </style>

      <div id="chart"></div>
    `;
  }

  static get properties () {
    return {
      title: String,
      chartType: {
        type: String,
        notify: true,
        value: "Line",
        observer: 'drawChart'
      },
      chart: Object,
      options: Object,
      data:{
        type: Array
      } 
    };
  }

  ready() {
    super.ready();
    // this.loaded = true;
    requestAnimationFrame(() => {
      GoogleCharts.load(() => this.drawChart());
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('iron-resize', this.onIronResize.bind(this));
    if(this.chart !== undefined)
      this.chart.draw(this.data, this.options);
  }

  onIronResize() {
    if(this.chart !== undefined)
      this.chart.draw(this.data, this.options);
  }

  updateChart(){
    if(this.chart !== undefined){
      this.chart.draw(this.data, this.options);}
  }

  drawChart() {
    // Standard google charts functionality is available as GoogleCharts.api after load
    if (GoogleCharts.api != undefined)
    {
      // console.log('desenhado graficos');
      let data = this.data || GoogleCharts.api.visualization.arrayToDataTable([
          ['Chart thing',     'Chart amount'],
          ['Na Meta',         50],
          ['Abaixo da Meta',  22],
          ['Acima da Meta',   10],
          ['Refugos',         15]
      ]);

      if (this.chartType === "Timeline"){
        data = this.data || new google.visualization.DataTable();

        data.addColumn({ type: 'string', id: 'President' });
        data.addColumn({ type: 'date', id: 'Start' });
        data.addColumn({ type: 'date', id: 'End' });
        data.addRows([
          [ 'Ventilador', new Date(1789, 3, 30, 10, 4, 45), new Date(1789, 3, 30, 10, 5, 0) ],
          [ 'Ventilador', new Date(1789, 3, 30, 10, 5, 0), new Date(1789, 3, 30, 10, 5, 15) ],
          [ 'Ventilador', new Date(1789, 3, 30, 10, 5, 15), new Date(1789, 3, 30, 10, 5, 30) ]
        ]);
      }

      let options = {
        colors: ['white'],
        backgroundColor: {
          fill:'transparent' 
        },

        title: this.title,

        titleTextStyle: {
            fontSize: 12,
            color: 'white',
            opacity: 1
        },

        legend: {
          textStyle: {
            color: 'white'
          }
        },

        bar: { 
          groupWidth: "20%",
        },

        animation: {
          duration: 2000,
          easing: 'out',
          startup: true
        },

        hAxis: {
          baselineColor: 'white',
          gridlines: {
            color: 'white',
            opacity: 0.5
          },
          textStyle: {
            fontSize: 8,
            color: 'white',
            opacity: 0.5
          }
        },

        is3D: 'true',

        curveType: 'function',

        vAxis: {
          baselineColor: 'white',
          gridlines: {
            color: '#white',
            count: 6,
            opacity: 0.5
          },
          textStyle: {
            fontSize: 8,
            color: 'white',
            opacity: 0.5
          }
        }
      };

      if (this.chartType === "Gauge"){
        data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Ventilador', 0]
        ]);
        options = {
          width: 400, height: 120,
          redFrom: 2, redTo: 5,
          min: 0, max: 5,
          yellowFrom:0, yellowTo: 1,
          minorTicks: 0.1
        };
      }

      //default is linechart
      let chart = new GoogleCharts.api.visualization.LineChart(this.$.chart);

      switch (this.chartType) {
        case "Line":
          options.legend.position = 'none';
          chart = new GoogleCharts.api.visualization.LineChart(this.$.chart);
          break;
        case "Area":
          options.legend.position = 'none';
          chart = new GoogleCharts.api.visualization.AreaChart(this.$.chart);
          break;
        case "Pie":
          options.colors = null;
          chart = new GoogleCharts.api.visualization.PieChart(this.$.chart);
          break;
        case "Column":
          options.legend.position = 'none';
          chart = new GoogleCharts.api.visualization.ColumnChart(this.$.chart);
          break;
        case "Timeline":
          options.colors = null;
          options.legend.position = 'none';
          chart = new GoogleCharts.api.visualization.Timeline(this.$.chart);
          break;
        case "Gauge":
          chart = new GoogleCharts.api.visualization.Gauge(this.$.chart);
          break;
        case "Bar":
          options.legend.position = 'none';
          chart = new GoogleCharts.api.visualization.BarChart(this.$.chart);
      }

      this.data = data;
      this.options = options;
      this.chart = chart;
      chart.draw(data, options);
    }
  }
}

window.customElements.define('google-chart', GoogleChart);
