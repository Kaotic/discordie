"use strict";

const IBase = require("./IBase");
const Utils = require("../core/Utils");
const Message = require("../models/Message");

const rest = require("../networking/rest");

class IMessage extends IBase {
	constructor(discordie, messageId) {
		super(Message, (key) => {
			const value = this._discordie._messages.get(this._messageId)[key];
			if(value) {
				if(key == "author")
					return this._discordie.Users.get(value.id);
				if(key == "mentions")
					return value.map(u => this._discordie.Users.get(u.id));
			}
			return value;
		});

		this._discordie = discordie;
		this._messageId = messageId;
		Utils.privatify(this);
		Object.freeze(this);
	}
	isEdited() {
		return this.editedTimestamp != null;
	}
	get isPrivate() {
		return this._discordie._channels.isPrivate(this.channel_id);
	}
	get channel() {
		if(this.isPrivate) {
			return this._discordie.DirectMessageChannels.get(this.channel_id);
		}
		return this._discordie.Channels.get(this.channel_id);
	}
	get guild() {
		return this.channel.guild;
	}
	edit(content, mentions) {
		return new Promise((rs, rj) => {
			rest(this._discordie).channels.patchMessage(this.channel_id, this.id, content, mentions)
			.then(() => rs(this))
			.catch(rj);
		});
	}
	delete() {
		return rest(this._discordie).channels.deleteMessage(this.channel_id, this.id);
	}
	reply(content, mentions, tts) {
		let m = [this.author];
		if(mentions && mentions.length > 0) {
			m = m.concat(mentions);
		}
		return this.channel.sendMessage(`${this.author.mention}, ${content}`, mentions, tts);
	}
}

module.exports = IMessage;