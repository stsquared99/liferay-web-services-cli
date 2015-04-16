#!/usr/bin/env node

var _ = require('lodash');
var async = require('async');
var utils = require('../../lib/utils');

var getUserAction = require('../../actions/get-company-users');
var getUserActionRouter = require('../../method-routers/get-user-router');

function getUser(userInfo) {
	if (userInfo.length) {
		// Get Users from provided info
		async.timesSeries(
			userInfo.length,
			function(n, asyncCallback) {
				var getUserAction = getUserActionRouter(userInfo[n]);

				require(getUserAction)(userInfo[n], function(error, response) {
					if (!error) {
						asyncCallback(null, response);
					}
				});
			},
			function(error, results) {
				if (!error) {
					for (var i = 0, length = results.length; i < length; i++) {
						console.log('');
						console.log('Got User:');
						utils.printJSON(JSON.parse(results[i]));
						console.log('');
					}
				}
			}
		);
	}
	else {
		// Get all users in the company
		getUserAction(function(error, response) {
			if (!error) {
				var users = JSON.parse(response);

				console.log('');

				_.forEach(users, function(user) {
					console.log('Got User:');
					user = _.pick(user, ['screenName', 'firstName', 'lastName', 'emailAddress', 'userId']);

					utils.printJSON(user);
					console.log('');
				})
			}
		});
	}
}

module.exports = getUser;