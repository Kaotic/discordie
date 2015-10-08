const Constants = require("../../Constants");
const Events = Constants.Events;
const apiRequest = require("../../core/ApiRequest");

module.exports = function(auth) {
	return new Promise((rs, rj) => {
		apiRequest
		.get("/gateway")
		.auth(this.token)
		.end((err, res) => {
			if(err) {
				this.Dispatcher.emit(Events.REQUEST_GATEWAY_ERROR, {error: err});
				return rj(err, res);
			}
			const event = {gateway: res.body.url};
			this.Dispatcher.emit(Events.REQUEST_GATEWAY_SUCCESS, event);
			rs(event);
		});
	});
}