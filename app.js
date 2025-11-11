import app from "./client.js";
import { getFoldingPaper, saveState } from "./datahandler.js";
import { foldsInfo } from "./foldsInfo.js";
const lraj23UserId = "U0947SL6AKB";
const lraj23BotTestingId = "C09GR27104V";
const gPortfolioDmId = "D09SN86RFC1";
const commands = {};
const zeroFoldDimensions = [210, 297, 0.1];
const dimensions = n => {
	const [f0w, f0h, f0t] = zeroFoldDimensions;
	const factor = Math.pow(0.5, n / 2);
	const widthBetterRoundedParts = (f0w / Math.pow(2, Math.ceil(n / 2))).toString().split(".");
	const width = parseFloat((f0w * factor).toFixed(widthBetterRoundedParts.length === 1 ? 0 : widthBetterRoundedParts[1].length));
	const heightBetterRoundedParts = (f0h / Math.pow(2, Math.ceil(n / 2))).toString().split(".");
	const height = parseFloat((f0h * factor).toFixed(heightBetterRoundedParts.length === 1 ? 0 : heightBetterRoundedParts[1].length));
	const thickness = f0t * Math.pow(2, n);
	return [width, height, thickness];
};
const dimensionsMin = n => [parseFloat((210 / Math.pow(2, n / 2)).toFixed((210 / Math.pow(2, Math.ceil(n / 2))).toString().split(".").length === 1 ? 0 : (210 / Math.pow(2, Math.ceil(n / 2))).toString().split(".")[1].length)), parseFloat((297 / Math.pow(2, n / 2)).toFixed((297 / Math.pow(2, Math.ceil(n / 2))).toString().split(".").length === 1 ? 0 : (297 / Math.pow(2, Math.ceil(n / 2))).toString().split(".")[1].length)), 0.1 * Math.pow(2, n)];
const surfaceArea = n => 2 * dimensions(n)[0] * dimensions(n)[1] + 2 * dimensions(n)[0] * dimensions(n)[2] + 2 * dimensions(n)[1] * dimensions(n)[2];
const landArea = n => dimensions(n)[0] * dimensions(n)[1];
const [mmInNm, mmInΜm, mmInMm, mmInCm, mmInM, mmInKm] = [0.000001, 0.001, 1, 10, 1000, 1000000];
const mmToString = mm => (mm <= 0 ? "0 mm" : (mm < mmInΜm ? (mm / mmInNm) + " nm" : (mm < mmInMm / 10 ? (mm / mmInΜm) + " μm" : (mm < 10 * mmInCm ? mm + " mm" : (mm < mmInM ? (mm / mmInCm) + " cm" : (mm < mmInKm ? (mm / mmInM) + " m" : (mm < 1000 * mmInKm ? (mm / mmInKm) + " km" : (mm / mmInKm).toFixed(0) + " km")))))));
const mmToString2D = mm => (mm <= 0 ? "0 mm" : (mm < (mmInΜm ** 2) ? (mm / (mmInNm ** 2)) + " nm" : (mm < (mmInMm ** 2) / 10 ? (mm / (mmInΜm ** 2)) + " μm" : (mm < 10 * (mmInCm ** 2) ? mm + " mm" : (mm < (mmInM ** 2) ? (mm / (mmInCm ** 2)) + " cm" : (mm < (mmInKm ** 2) ? (mm / (mmInM ** 2)) + " m" : (mm < 1000 * (mmInKm ** 2) ? (mm / (mmInKm ** 2)) + " km" : (mm / (mmInKm ** 2)).toFixed(0) + " km"))))))) + "²";
const mmToString3D = mm => (mm <= 0 ? "0 mm" : (mm < (mmInΜm ** 3) ? (mm / (mmInNm ** 3)) + " nm" : (mm < (mmInMm ** 3) / 10 ? (mm / (mmInΜm ** 3)) + " μm" : (mm < 10 * (mmInCm ** 3) ? mm + " mm" : (mm < (mmInM ** 3) ? (mm / (mmInCm ** 3)) + " cm" : (mm < (mmInKm ** 3) ? (mm / (mmInM ** 3)) + " m" : (mm < 1000 * (mmInKm ** 3) ? (mm / (mmInKm ** 3)) + " km" : (mm / (mmInKm ** 3)).toFixed(0) + " km"))))))) + "³";
const blocks = folds => [
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "Manipulate your piece of paper (you're at " + folds + " fold(s))."
		}
	},
	{
		type: "actions",
		elements: (folds >= 75 ? [
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":heavy_minus_sign: Unfold",
					emoji: true
				},
				value: "unfold",
				action_id: "unfold"
			}
		] : (folds <= -36 ? [
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
		] : [
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
		]))
	},
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "*Stats:*\nDimensions: " + dimensions(folds).map(dimension => "*" + mmToString(dimension) + "*").join(" x ") + "\nSPACE on top of paper: *" + mmToString2D(landArea(folds)) + "*\nTotal Surface Area: *" + mmToString2D(surfaceArea(folds)) + "*\nVolume: *" + mmToString3D(6237) + "* (this is constant)"
		}
	},
	{
		type: "divider"
	},
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "The SPACE (yeah, I know) on top of your piece of paper is *" + mmToString2D(landArea(folds)) + "*. On this amount of SPACE, you could fit " + (foldsInfo[folds.toString()] ? foldsInfo[folds.toString()][0] : "something, nobody really knows what (more like I couldn't find anything that made sense, or I haven't researched enough yet, most likely the latter for obvious reasons). What do you know?")
		}
	},
	{
		type: "image",
		image_url: foldsInfo[folds.toString()] ? foldsInfo[folds.toString()][1] : "https://blog.lipsumhub.com/wp-content/uploads/2024/07/lorem-ipsum-meaning-in-english-lipsumhub.jpg",
		alt_text: foldsInfo[folds.toString()] ? foldsInfo[folds.toString()][2] : "Lorem Ipsum dolor sit amet, consectetur adipisicing..."
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
];

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
		blocks: blocks(folds)
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
		blocks: blocks(folds)
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
		blocks: blocks(folds)
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