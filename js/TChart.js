

function TChart(data,options){
	var _self = this;
	this.options = {
		'background-color' : 'rgb(30, 219, 181)',
		'xaxis' : {
			'path' : {
				'fill' : 'none',
				'stroke' : '#fff',
				'shape-rendering' : 'crispEdges'
			},
			'line' : {
				'fill' : 'none',
				'stroke' : '#fff',
				'shape-rendering' : 'crispEdges'
			},
			'text' : {
				'font-family' : 'sans-serif',
				'font-size' : '5px',
				'color' : '#fff'
			}
		},
		'yaxis' : {
			'path' : {
				'fill' : 'none',
				'stroke' : 'rgba(0, 0, 0, 0)',
				'shape-rendering' : 'crispEdges'
			},
			'line' : {
				'fill' : 'none',
				'stroke' : 'rgba(0, 0, 0, 0)',
				'shape-rendering' : 'crispEdges'
			},
			'text' : {
				'font-family' : 'sans-serif',
				'font-size' : '11px'
			}
		},
		'circle' : {
			'span' : {
				'display' : 'none',
			},
			'hover' : {
				'fill' : 'orange',
				'transition' : 'all 0.3s',
				'span' : {
					'display' : 'block',
					'position' : 'absolute',
					'top' : '0.2em',
					'left' : '2em',
					'width' : '15em',
					'border' : '1px solid #0cf',
					'color' : '#000',
					'background-color' : '#cff',
					'text-align' : 'center'
				}
			}
		},
		'color' : [
			'#8d4653', '#91e8e1','#434348','#0f9ef7','#ff7f50','#ff69b4',  '#cd5c5c', '#ffa500', '#ff6347', '#ba55d3','#ff00ff', '#6495ed', '#90ed7d', '#18d018', '#32cd32', '#40e0d0', '#1e90ff', '#7b68ee','#00fa9a', '#ffd700', '#6b8e23', '#3cb371', '#b8860b', '#30e0e0','#ebeb8b','#7cb5ec','#8085e9', '#f7a35c','#f15c80', '#e4d354', '#87cefa', '#da70d6', '#8085e8'
		],
		'width' : 900,
		'height' : 400,
		'element' : 'demo',
		'padding' : 15
	}
	this.maxNum = 0;

	TChart.prototype.initData = function(){
		this.data = [];
		for(this.num=0; this.num<12; this.num++){
			this.data.push({
				'name' : (this.num+1)+'月',
				'data' : []
			})

			for(this.num2=0; this.num2<30; this.num2++){
				this.data[this.num]['data'].push([(this.num2+1)+'号', parseInt(Math.random()*(100)+1)]);
			}
		}
	}
	TChart.prototype.createSvg = function(){
		console.info(d3.select('#'+this.options.element))
		this.svg = d3.select('#'+this.options.element).append('svg').attr('width',this.options.width).attr('height',this.options.height).style('background-color',this.options['background-color']);

		this.xscale = d3.scale.linear().domain([0, this.data[0].data.length]).range([this.options.padding, this.options.width-this.options.padding]);

		this.yscale = d3.scale.linear().domain([1, this.data.length]).range([this.options.padding, this.options.height-this.options.padding*2]);

		this.rscale = d3.scale.linear().domain([0,this.maxNum]).range([0,30-this.options.padding]);

		this.xaxis = d3.svg.axis().scale(this.xscale).orient('bottom').ticks(this.data[0].data.length).tickFormat(function(d){
			if(d == 0){
				return ' ';
			}
			return d+'日';
		});

		this.x = this.svg.append('g').attr('class',"xaxis").attr('transform', 'translate(0, '+(this.options.height-this.options.padding)+')').call(this.xaxis);

		for(this.num=0; this.num<this.data.length; this.num++){
			this.g = this.svg.append('g');
			this.circle = this.g.selectAll('circle');
			this.text = this.g.selectAll('text');

			this.circle.data(this.data[this.num].data).enter().append('circle').attr('cx',function(d,x){return _self.xscale(x+1);}).attr('cy', _self.yscale(this.num+1)).attr('r',function(d){return _self.rscale(d[1])}).attr('fill', this.options['background-color']).transition().delay(function(d,x){return d[1]*50+250}).duration(this.num*50+550).ease('bounce').attr('fill',this.options.color[this.num]).text(function(d){return d[1]});
			this.text.data(this.data[this.num].data).enter().append('text').attr('x', function(d,x){return _self.xscale(x+1)-6}).attr('y', this.yscale(this.num+1)+6).attr('class', 'value').text(function(d){return d[1]}).attr('fill', this.options.color[this.num]).style('display', 'none')

			this.g.append('text').attr('x', function(d,x){return 0}).attr('y', this.yscale(this.num+1)+6).text(this.data[this.num].name).style('fill', this.options.color[this.num]).on('mouseover', this.mouseOver).on('mouseout', this.mouseOut).attr('class','label')
		}
	}
	TChart.prototype.mouseOver = function(){
		var g = d3.select(this).node().parentNode;
		d3.select(g).selectAll('circle').style('display','none');
		d3.select(g).selectAll('text.value').style('display','block');
	}
	TChart.prototype.mouseOut = function(){
		var g = d3.select(this).node().parentNode;
		d3.select(g).selectAll('circle').style('display','block');
		d3.select(g).selectAll('text.value').style('display','none');
	}
	TChart.prototype.maxData = function(){
		for(this.num=0; this.num<this.data.length; this.num++){
			for(this.num2=0; this.num2<this.data[this.num].data.length; this.num2++){
				if(this.data[this.num].data[this.num2][1] > this.maxNum){
					this.maxNum = this.data[this.num].data[this.num2][1];

				}
			}
		}
	}
	TChart.prototype.init = function(){
		if(data){
			this.data = data;
		}else{
			this.initData();
		}
		this.maxData();
		this.createSvg();
	}
	this.init();
}

