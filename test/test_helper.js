import React from 'react';
import jsdom from 'jsdom';
// need this junky jquery as the usual $ will try to reach out to browser enviornment global object
import jquery from 'jquery';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import chai, { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../src/reducers';
import chaiJquery from 'chai-jquery';

// // Set up testing environment to run like a browser in the command line

// when working with browsers we use the window object but in node we use the global object
// create fake dom
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
// fake window document object with keyword variables that mimic browser in cli
global.window = global.document.defaultView;
// tell jquery to only be responsible for this fake instance of dom
const $ = jquery(global.window);

// // build 'renderComponent' helper that should render a given react class
const renderComponent = (ComponentClass, props, state) => {
	// renders a component into a DETACHED DOM, requires a DOM (fake jsdom in this case)
	const componentInstance = TestUtils.renderIntoDocument(
		<Provider store={createStore(reducers, state)}>
			<ComponentClass {...props} />
		</Provider>
	);

	return $(ReactDOM.findDOMNode(componentInstance)); // produces HTML
};

// // build helper for simulating events
$.fn.simulate = (eventName, value) => {
	if (value) this.val(value);
	TestUtils.Simulate[eventName](this[0]);
};

// // setup chai-jquery
chaiJquery(chai, chai.util, $);

export { renderComponent, expect };