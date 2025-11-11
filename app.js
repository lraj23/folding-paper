import app from "./client.js";
import { getFoldingPaper, saveState } from "./datahandler.js";
const lraj23UserId = "U0947SL6AKB";
const lraj23BotTestingId = "C09GR27104V";
const gPortfolioDmId = "C09GR27104V";
const commands = {};
const A4dimensions = [210, 297, 0.1];
const dimensions = n => {
	const [a4w, a4h, a4t] = A4dimensions;
	const factor = Math.pow(2, 2 - (n / 2));
	const widthBetterRoundedParts = (a4w * Math.pow(2, 2 - ((n + n % 2) / 2))).toString().split(".");
	const width = parseFloat((a4w * factor).toFixed(widthBetterRoundedParts.length === 1 ? 0 : widthBetterRoundedParts[1].length));
	const heightBetterRoundedParts = (a4h * Math.pow(2, 2 - ((n + n % 2) / 2))).toString().split(".");
	const height = parseFloat((a4h * factor).toFixed(heightBetterRoundedParts.length === 1 ? 0 : heightBetterRoundedParts[1].length));
	const thickness = a4t * Math.pow(2, n - 4);
	return [width, height, thickness];
}
const dimensionsMin = n => [parseFloat((840 / Math.pow(2, n / 2)).toFixed((840 / Math.pow(2, Math.ceil(n / 2))).toString().split(".").length === 1 ? 0 : (840 / Math.pow(2, Math.ceil(n / 2))).toString().split(".")[1].length)), parseFloat((1188 / Math.pow(2, n / 2)).toFixed((1188 / Math.pow(2, Math.ceil(n / 2))).toString().split(".").length === 1 ? 0 : (1188 / Math.pow(2, Math.ceil(n / 2))).toString().split(".")[1].length)), 0.00625 * Math.pow(2, n)];

app.message("", async () => { });

commands.paper = async ({ ack, body: { user_id: user }, respond }) => {
	await ack();
	let foldingPaper = getFoldingPaper();
	console.log(user, foldingPaper.folds);
	if (user !== lraj23UserId) return await respond("Sorry, this is still in development...");
	if (!foldingPaper.folds[user]) foldingPaper.folds[user] = 0;
	const dims = dimensions(foldingPaper.folds[user] + 4);
	await respond({
		text: "Manipulate your piece of paper (you're at " + foldingPaper.folds[user] + " folds).",
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Manipulate your piece of paper (you're at " + foldingPaper.folds[user] + " folds)."
				}
			},
			{
				type: "actions",
				elements: [
					{
						type: "button",
						text: {
							type: "plain_text",
							text: ":heavy_minus_sign: Unfold",
							emoji: true
						},
						value: "unfold",
						action_id: "unfold"
					},
					{
						type: "button",
						text: {
							type: "plain_text",
							text: ":heavy_plus_sign: Fold",
							emoji: true
						},
						value: "fold",
						action_id: "fold"
					}
				]
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*Stats:*\nDimensions: " + dims.map(dimension => "*" + dimension + " mm*").join(" x ") + "\nVolume: *6237 mm³* (this is constant)"
				}
			},
			{
				type: "actions",
				elements: [
					{
						type: "button",
						text: {
							type: "plain_text",
							text: ":x: Close",
							emoji: true
						},
						value: "cancel",
						action_id: "cancel"
					}
				]
			}
		]
	});
	saveState(foldingPaper);
}
app.command("/folding-paper-paper", commands.paper);

app.action("unfold", async ({ ack }) => await ack());

app.action("fold", async ({ ack }) => await ack());

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