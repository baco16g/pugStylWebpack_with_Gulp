export default class Event {
	constructor(sender) {
		this.sender = sender;
		this.listeners = [];
	}

	attach(listener) {
		this.listeners.push(listener);
	}

	notify(args) {
		let idx;
		for (idx = 0; idx < this.listeners.length; idx += 1) {
			this.listeners[idx](this.sender, args);
		}
	}
}
