import app from "./client.js";
import { getFoldingPaper, saveState } from "./datahandler.js";
import { blocks, dimensionsMin, mmToString, landArea, mmToString2D } from "./blocks.js";
import {demons} from "./somewheredangerous.js";
const lraj23UserId = "U0947SL6AKB";
const lraj23BotTestingId = "C09GR27104V";
const gPortfolioDmId = "D09SN86RFC1";
const commands = {};

app.message("", async ({ message: { text, channel, channel_type } }) => {
	if ((channel_type === "im") && (channel === gPortfolioDmId)) {
		const info = text.split(";");
		console.log(info[0], commands[info[0]]);
		return commands[info[0]]({
			ack: _ => _,
			body: {
				user_id: info[1],
				channel_id: info[2]
			},
			respond: (response) => {
				if (typeof response === "string") return app.client.chat.postEphemeral({
					channel: info[2],
					user: info[1],
					text: response
				});
				if (!response.channel) response.channel = info[2];
				if (!response.user) response.user = info[1];
				app.client.chat.postEphemeral(response);
			}
		});
	}
});

commands.paper = async ({ ack, body: { user_id: user }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	console.log(user, foldingPaper.folds);
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	const folds = foldingPaper.folds[user];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " fold(s)).",
		blocks: blocks.paper(folds)
	});
	saveState(foldingPaper);
}
app.command("/folding-paper-paper", commands.paper);

app.action("unfold", async ({ ack, body: { user: { id: user } }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	if (foldingPaper.folds[user] > -36) foldingPaper.folds[user]--;
	const folds = foldingPaper.folds[user];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " fold(s)).",
		blocks: blocks.paper(folds)
	});
	saveState(foldingPaper);
});

app.action("fold", async ({ ack, body: { user: { id: user } }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	if (foldingPaper.folds[user] < 75) foldingPaper.folds[user]++;
	const folds = foldingPaper.folds[user];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " fold(s)).",
		blocks: blocks.paper(folds)
	});
	saveState(foldingPaper);
});

const requestPaper = async ({ ack, action: { value }, body: { user: { id: user }, channel: { id: channel }, trigger_id }, msg }) => [await ack(), await app.client.views.open({
	trigger_id,
	view: {
		type: "modal",
		callback_id: "confirm-request-paper-" + value,
		title: {
			type: "plain_text",
			text: "/paper #" + value
		},
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Request to add information for */folding-paper-paper*  on *" + value + "* fold(s)."
				}
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-paper-item"
				},
				label: {
					type: "plain_text",
					text: "Name of the object",
					emoji: true
				},
				optional: false
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-paper-image",
					placeholder: {
						type: "plain_text",
						text: "Can be stolen from the internet!"
					}
				},
				label: {
					type: "plain_text",
					text: "A link for the image",
					emoji: true
				},
				optional: false
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-paper-details",
					placeholder: {
						type: "plain_text",
						text: "Optional"
					}
				},
				label: {
					type: "plain_text",
					text: "Any extra information, like an explanation?",
					emoji: true
				},
				optional: true
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Opened in <#" + channel + "> by <@" + user + ">" + (msg ? "\n\n*_" + msg + "_*" : "")
				}
			}
		],
		submit: {
			type: "plain_text",
			text: ":ballot:  Submit Request"
		}
	}
})];
app.action(/^request-paper-.+$/, requestPaper);

app.view(/^confirm-request-paper-.+$/, async ({ ack, view: { state: { values } }, body: { user: { id: user }, view: { blocks: [{ text: { text: foldsMeta } }, , , , { text: { text: meta } }] }, trigger_id } }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	const value = foldsMeta.split("on *")[1].split("*")[0];
	const name = Object.entries(values).find(info => info[1]["ignore-request-paper-item"])[1]["ignore-request-paper-item"].value;
	const imgUrl = Object.entries(values).find(info => info[1]["ignore-request-paper-image"])[1]["ignore-request-paper-image"].value;
	const additional = Object.entries(values).find(info => info[1]["ignore-request-paper-details"])[1]["ignore-request-paper-details"].value || "";
	const channel = meta.split("<#")[1].split(">")[0];
	const warn = async msg => await requestPaper({
		ack: _ => _,
		action: { value },
		body: {
			user: { id: user },
			channel: { id: channel },
			trigger_id
		},
		msg
	});
	console.log(value, name, imgUrl, additional, user, channel);

	if (!value) return await warn("WHAT");
	foldingPaper.requests.push({ name, imgUrl, additional });
	await app.client.chat.postMessage({
		channel: lraj23BotTestingId,
		text: "<@" + lraj23UserId + "> You have a new suggestion!",
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "<@" + lraj23UserId + "> You have a new suggestion!"
				}
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*<@" + user + ">* suggested that, after *" + value + "* folds, *" + name + "* would fit on *" + mmToString2D(landArea(parseInt(value))) + "*.\n\n\nThey provided this image link: " + imgUrl + (additional ? "\n\n\nThey also provided this extra note: *" + additional + "*" : "")
				}
			}
		]
	});
	saveState(foldingPaper);
});

commands.space = async ({ ack, body: { user_id }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user_id]) foldingPaper.folds[user_id] = 0;
	const folds = foldingPaper.folds[user_id];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " folds(s)).",
		blocks: blocks.space(folds)
	});
};
app.command("/folding-paper-space", commands.space);

app.action("unfold-space", async ({ ack, body: { user: { id: user } }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	if (foldingPaper.folds[user] > -36) foldingPaper.folds[user]--;
	const folds = foldingPaper.folds[user];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " fold(s)).",
		blocks: blocks.space(folds)
	});
	saveState(foldingPaper);
});

app.action("fold-space", async ({ ack, body: { user: { id: user } }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	if (foldingPaper.folds[user] < 75) foldingPaper.folds[user]++;
	const folds = foldingPaper.folds[user];
	await respond({
		text: "Manipulate your piece of paper (you're at " + folds + " fold(s)).",
		blocks: blocks.space(folds)
	});
	saveState(foldingPaper);
});

const requestSpace = async ({ ack, action: { value }, body: { user: { id: user }, channel: { id: channel }, trigger_id }, msg }) => [await ack(), await app.client.views.open({
	trigger_id,
	view: {
		type: "modal",
		callback_id: "confirm-request-space-" + value,
		title: {
			type: "plain_text",
			text: "/space #" + value
		},
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Request to add information for */folding-paper-space* on *" + value + "* fold(s)."
				}
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-space-item"
				},
				label: {
					type: "plain_text",
					text: "Name of the object",
					emoji: true
				},
				optional: false
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-space-image",
					placeholder: {
						type: "plain_text",
						text: "Can be stolen from the internet!"
					}
				},
				label: {
					type: "plain_text",
					text: "A link for the image",
					emoji: true
				},
				optional: false
			},
			{
				type: "input",
				element: {
					type: "plain_text_input",
					action_id: "ignore-request-space-details",
					placeholder: {
						type: "plain_text",
						text: "Optional"
					}
				},
				label: {
					type: "plain_text",
					text: "Any extra information, like an explanation?",
					emoji: true
				},
				optional: true
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Opened in <#" + channel + "> by <@" + user + ">" + (msg ? "\n\n*_" + msg + "_*" : "")
				}
			}
		],
		submit: {
			type: "plain_text",
			text: ":ballot:  Submit Request"
		}
	}
})];
app.action(/^request-space-.+$/, requestSpace);

app.view(/^confirm-request-space-.+$/, async ({ ack, view: { state: { values } }, body: { user: { id: user }, view: { blocks: [{ text: { text: foldsMeta } }, , , , { text: { text: meta } }] }, trigger_id } }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	const value = foldsMeta.split("on *")[1].split("*")[0];
	const name = Object.entries(values).find(info => info[1]["ignore-request-space-item"])[1]["ignore-request-space-item"].value;
	const imgUrl = Object.entries(values).find(info => info[1]["ignore-request-space-image"])[1]["ignore-request-space-image"].value;
	const additional = Object.entries(values).find(info => info[1]["ignore-request-space-details"])[1]["ignore-request-space-details"].value || "";
	const channel = meta.split("<#")[1].split(">")[0];
	const warn = async msg => await requestSpace({
		ack: _ => _,
		action: { value },
		body: {
			user: { id: user },
			channel: { id: channel },
			trigger_id
		},
		msg
	});
	console.log(value, name, imgUrl, additional, user, channel);

	if (!value) return await warn("WHAT");
	foldingPaper.requests.push({ name, imgUrl, additional });
	await app.client.chat.postMessage({
		channel: lraj23BotTestingId,
		text: "<@" + lraj23UserId + "> You have a new suggestion!",
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "<@" + lraj23UserId + "> You have a new suggestion!"
				}
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*<@" + user + ">* suggested that, after *" + value + "* folds, the thickness of a piece of paper, which is *" + mmToString(dimensionsMin(parseInt(value))[2]) + "*, would fit *" + name + "*.\n\n\nThey provided this image link: " + imgUrl + (additional ? "\n\n\nThey also provided this extra note: *" + additional + "*" : "")
				}
			}
		]
	});
	saveState(foldingPaper);
});
app.view(/^confirm-request-space-.+$/, async ({ ack }) => await ack());

app.action(/^ignore-.+$/, async ({ ack }) => await ack());

app.action("cancel", async ({ ack, respond }) => [await ack(), await respond({ delete_original: true })]);

app.action("confirm", async ({ ack }) => await ack());

commands.help = async ({ ack, respond, body: { user_id } }) => [await ack(), await respond("This is the Folding Paper bot! It lets you fold paper while learning about the surface area, volume, etc. _More information will be added eventually..._\nFor more information, check out the readme at https://github.com/lraj23/folding-paper."), user_id === lraj23UserId ? await respond("Test but only for <@" + lraj23UserId + ">. If you aren't him and you see this message, DM him IMMEDIATELY about this!") : null];
app.command("/folding-paper-help", commands.help);

app.message(/secret button/i, async ({ message: { channel, user, thread_ts, ts } }) => await app.client.chat.postEphemeral({
	channel, user,
	text: "<@" + user + "> mentioned the secret button! Here it is:",
	thread_ts: ((thread_ts == ts) ? undefined : thread_ts),
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "<@" + user + "> mentioned the secret button! Here it is:"
			}
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "Secret Button"
					},
					action_id: "button_click"
				}
			]
		}
	]
}));

app.action("button_click", async ({ body: { channel: { id: cId }, user: { id: uId }, container: { thread_ts } }, ack }) => [await ack(), await app.client.chat.postEphemeral({
	channel: cId,
	user: uId,
	text: "You found the secret button. Here it is again.",
	thread_ts,
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "You found the secret button. Here it is again."
			}
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "Secret Button"
					},
					action_id: "button_click"
				}
			]
		}
	]
})]);