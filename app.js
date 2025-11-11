import app from "./client.js";
import { getFoldingPaper, saveState } from "./datahandler.js";
import blocks from "./blocks.js";
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

commands.space = async ({ ack, body: { user_id }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	if (!foldingPaper.folds[user_id]) foldingPaper.folds[user_id] = 0;
	const folds = foldingPaper.folds[user_id];
	console.log(blocks.space(folds));
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