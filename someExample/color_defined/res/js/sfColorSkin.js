/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) {

	function Scheme(orgin) {
		var HSL = new Object();
		var RGB = new Object();
		var tempRGB = new Object();
		RGB.R = RGB.G = RGB.B = 0;
		tempRGB.R = tempRGB.G = tempRGB.B = 0;
		HSL.H = HSL.S = HSL.L = 0;
		var HEXCodes = new Array(256);
		var k = 0;
		var HEX = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
		for (i = 0; i < 16; i++)
		{
			for (j = 0; j < 16; j++)
			{
				HEXCodes[k] = HEX[i] + HEX[j];
				k++;
			}
		}
		SetHex(orgin);
		function SetHex(bgColor)
		{
			var i = 0;

			if (bgColor.substring(0, 3) == "rgb") {
				bgColor = bgColor.substring(4, bgColor.length - 1);
				rgbArray = bgColor.split(", ");
				ChangeColors(rgbArray[0], rgbArray[1], rgbArray[2]);
				return;
			}

			if (bgColor.length == 0)
				return;
			if (bgColor.length == 7)
				bgColor = bgColor.substring(1, 7);

			if (bgColor.length < 6) {
				alert("You must enter a 6 character HEX value!");
				return;
			}

			bgColor = bgColor.toUpperCase();
			for (j = 0; j < 6; j++) {
				if (!isHex(bgColor.charAt(j))) {
					alert("You may only enter values between A-F and 0-9!");
					return false;
				}
			}
			var bgColorArr = [bgColor.substring(0, 2).toUpperCase(),bgColor.substring(2, 4).toUpperCase(),bgColor.substring(4, 6).toUpperCase()];
			var bgColorflag = 3; 
			for(var i=0,len= HEXCodes.length; i < len; i++)
			{
				if(bgColorflag == 0) break;
				if(HEXCodes[i] == bgColorArr[0])
				{
					RGB.R = i;
					bgColorflag--;
				}
				if(HEXCodes[i] == bgColorArr[1])
				{
					RGB.G = i;
					bgColorflag--;
				}
				if(HEXCodes[i] == bgColorArr[2])
				{
					RGB.B = i;
					bgColorflag--;
				}
			}
			/*while (HEXCodes[i] != bgColor.substring(0, 2).toUpperCase())
				i++;
			RGB.R = i;
			i = 0;
			while (HEXCodes[i] != bgColor.substring(2, 4).toUpperCase())
				i++;
			RGB.G = i;
			i = 0;
			while (HEXCodes[i] != bgColor.substring(4, 6).toUpperCase())
				i++;
			RGB.B = i;*/

			ChangeColors(RGB.R, RGB.G, RGB.B);
		}

		function isHex(hexChar) {
			for (k = 0; k < HEX.length; k++) {
				if (hexChar == HEX[k]) {
					return true;
				}
			}
			return false;
		}

		function ChangeColors(r, g, b)
		{
			r = (r > 255) ? 255 : ((r < 0) ? 0 : r);
			g = (g > 255) ? 255 : ((g < 0) ? 0 : g);
			b = (b > 255) ? 255 : ((b < 0) ? 0 : b);

			RGB.R = r;
			RGB.G = g;
			RGB.B = b;
		}

		function toHex(c){

			var r = (c.R).toString(16);
				r = (r.length <= 1)? ('0' + r) : r;
			var g = (c.G).toString(16);
				g = (g.length <= 1)? ('0' + g) : g;
			var b = (c.B).toString(16);
				b = (b.length <= 1)? ('0' + b) : b;
			return '#' + r + g + b;
		}
//提高明度，变亮
		this.LightScheme = function(a)
		{
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.L = HSL.L + a;
			if (HSL.L > 100)
				HSL.L = 100;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
//强制设置亮度
		this.setLight = function(a)
		{
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.L = a;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		};
//降低明度，变暗
		this.DarkenScheme = function(a)
		{
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.L = HSL.L - a;
			if (HSL.L < 0)
				HSL.L = 0;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
//提高饱和度
		this.PureScheme = function(a) {
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.S = HSL.S + a;
			if (HSL.S > 100)
				HSL.S = 100;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
//降低饱和度
		this.MuddyScheme = function(a) {
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.S = HSL.S - a;
			if (HSL.S < 0)
				HSL.S = 0;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
		//整体变艳丽
		this.AddScheme = function(a, b, c) {
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.H = (HSL.H + a > 360) ? 360 : HSL.H + a;
			HSL.S = (HSL.S + b > 100) ? 100 : HSL.S + b;
			HSL.L = (HSL.L + c > 100) ? 100 : HSL.L + c;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
		//整体变灰暗
		this.MinusScheme = function(a, b, c) {
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.H = (HSL.H - a < 0) ? 0 : HSL.H - a;
			HSL.S = (HSL.S - b < 0) ? 0 : HSL.S - b;
			HSL.L = (HSL.L - c < 0) ? 0 : HSL.L - c;
			HSLtoRGB(HSL.H, HSL.S, HSL.L);
			return toHex(tempRGB);
		}
		function HSLtoRGB(H, S, L)
		{
			var p1, p2;

			L /= 100;
			S /= 100;
			if (L <= 0.5)
				p2 = L * (1 + S);
			else
				p2 = L + S - (L * S);
			p1 = 2 * L - p2;
			if (S == 0)
			{
				tempRGB.R = L;
				tempRGB.G = L;
				tempRGB.B = L;
			}
			else
			{
				tempRGB.R = FindRGB(p1, p2, H + 120);
				tempRGB.G = FindRGB(p1, p2, H);
				tempRGB.B = FindRGB(p1, p2, H - 120);
			}
			tempRGB.R *= 255;
			tempRGB.G *= 255;
			tempRGB.B *= 255;
			tempRGB.R = Math.round(tempRGB.R);
			tempRGB.G = Math.round(tempRGB.G);
			tempRGB.B = Math.round(tempRGB.B);
		}

		function FindRGB(q1, q2, hue)
		{
			if (hue > 360)
				hue = hue - 360;
			if (hue < 0)
				hue = hue + 360;
			if (hue < 60)
				return (q1 + (q2 - q1) * hue / 60);
			else if (hue < 180)
				return(q2);
			else if (hue < 240)
				return(q1 + (q2 - q1) * (240 - hue) / 60);
			else
				return(q1);
		}

		function RGBtoHSL(r, g, b)
		{
			var Min = 0;
			var Max = 0;
			r = (eval(r) / 51) * .2;
			g = (eval(g) / 51) * .2;
			b = (eval(b) / 51) * .2;

			if (eval(r) >= eval(g))
				Max = eval(r);
			else
				Max = eval(g);
			if (eval(b) > eval(Max))
				Max = eval(b);

			if (eval(r) <= eval(g))
				Min = eval(r);
			else
				Min = eval(g);
			if (eval(b) < eval(Min))
				Min = eval(b);

			HSL.L = (eval(Max) + eval(Min)) / 2;
			if (eval(Max) == eval(Min))
			{
				HSL.S = 0;
				HSL.H = 0;
			}
			else
			{
				if (HSL.L < .5)
					HSL.S = (eval(Max) - eval(Min)) / (eval(Max) + eval(Min));
				if (HSL.L >= .5)
					HSL.S = (eval(Max) - eval(Min)) / (2 - eval(Max) - eval(Min));
				if (r == Max)
					HSL.H = (eval(g) - eval(b)) / (eval(Max) - eval(Min));
				if (g == Max)
					HSL.H = 2 + ((eval(b) - eval(r)) / (eval(Max) - eval(Min)));
				if (b == Max)
					HSL.H = 4 + ((eval(r) - eval(g)) / (eval(Max) - eval(Min)));
			}
			HSL.H = Math.round(HSL.H * 60);
			if (HSL.H < 0)
				HSL.H += 360;
			if (HSL.H >= 360)
				HSL.H -= 360;
			HSL.S = Math.round(HSL.S * 100);
			HSL.L = Math.round(HSL.L * 100);
		}
	}

	$.fn.SFColorSkins = function(opt) {
		var rules = [];
		var orgin = opt.mainColor.replace('#', '');
		var sc = new Scheme(orgin);
		function Transform(offset, ts) {
			ts = ts.toLowerCase();
			offset = parseInt(offset, 10);
			var c = {R: 0, G: 0, B: 0};
			switch (ts) {
				case 'anti': //取反
					c = sc.DarkenScheme(offset);
					break;
				case 'dark':
					c = sc.DarkenScheme(offset);
					break;
				case 'bright':
					c = sc.LightScheme(offset);
					break;
				case 'keeplight':
					c = sc.setLight(offset);
					break;	
				case 'tonic':
					c = sc.AddScheme(offset, 0, 10);
					break;
				case 'pure':
					c = sc.PureScheme(offset);
					break;
				case 'add-over-anti':
					c = sc.AddScheme(0,offset,100);
					break;
				case 'minus-over-anti':
					c = sc.MinusScheme(0,50,offset);
					break;
				default:
					c =  opt.mainColor;
					break;
			}
			return c;
		}

		function setParams(s, arr) {
			//var values = Array.prototype.slice.call(arr, 1);
			return s.replace(/%\d+/g, function(m) {
				var i = m.replace('%', '') * 1;
				return arr[i] === null ? '' : arr[i];
			});
		}
		
		function getStyleByType(xml,type){
			var css = 'skin rules[page="%1"] css'.replace('%1', type);
			var styles = [];
			$(xml).find(css).each(function(index, item) {
				var itc = $(item);
				var selector = itc.attr('selector');
				var text = itc.find('text').text();
				var tpl = '%selector{%text}';
				var params = [];
				itc.find('param').each(function(i, p) {
					var ts = $(p).attr('transform');
					var offset = $(p).attr('offset');
					params[i] = Transform(offset, ts);
				});

				text = setParams(text, params);
				styles.push(tpl.replace('%selector', selector).replace('%text', text));

			});
			return styles.join("\n");
		}
		
		function onchangecolor(xml){
			var styles = ['<style id="sfSkin" type="text/css">'];
			var pcstyle = getStyleByType(xml,"PC.html");
			styles.push(pcstyle);
			styles.push('</style>');
			$(styles.join('\n')).appendTo('head');
			$("#mobileStyle").val("<style>"+getStyleByType(xml,"mobile.html")+"</style>");
			$("#pcStyle").val("<style>"+pcstyle+"</style>");
		}
		
		if(window.skinXml){
			onchangecolor(window.skinXml);
			return;
		}
		
		$.ajax({
			url: opt.url || 'skin.xml',
			type: 'GET',
			dataType: 'xml',
			timeout: 1000,
			success: function(xml) {
				window.skinXml = xml;
				onchangecolor(window.skinXml);
			}
		});

	};
})(jQuery);
