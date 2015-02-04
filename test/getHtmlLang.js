'use strict';

var defaultLangCode = require('../lib/defaultLangCode'),
	expect = require('chai').expect,
	getHtmlLang = require('../lib/getHtmlLang'),
	sinon = require('sinon');

describe('getHtmlLang', function() {

	var getElementsByTagName, getAttribute;

	beforeEach(function() {

		getAttribute = sinon.stub().returns('ab-CD');

		getElementsByTagName = sinon.stub()
			.returns([{ getAttribute: getAttribute }]);

		global.window = {
			document: {
				body: {
					dir: 'blah'
				},
				getElementsByTagName: getElementsByTagName
			}
		};

	});

	[
	/* window is undefined */
	function() { global.window = undefined; },
	/* window.document is undefined */
	function() { global.window.document = undefined; },
	/* no HTML elements */
	function() {
		global.window.document.getElementsByTagName = sinon.stub()
		.returns([]);
	},
	/* no lang attribute on HTML element */
	function() {
		global.window.document.getElementsByTagName = sinon.stub()
			.returns([{getAttribute: sinon.stub().returns(null)}]);
	}
	].forEach(function(func,index) {
		it('should return default ' + ( index + 1 ), function() {
			func();
			var value = getHtmlLang();
			expect(value).to.equal(defaultLangCode);
		});
	});

	it('should return HTML element lang attribute value', function() {
		var value = getHtmlLang();
		expect(getElementsByTagName.calledWith('html')).to.be.true;
		expect(getAttribute.calledWith('lang')).to.be.true;
		expect(value).to.equal('ab-CD');
	});

});