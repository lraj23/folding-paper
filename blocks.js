import { foldsInfo } from "./foldsInfo.js";
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
const blocks = {};

blocks.paper = folds => [
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
			text: "The SPACE (yeah, I know) on top of your piece of paper is *" + mmToString2D(landArea(folds)) + "*. On this amount of SPACE, you could fit " + (foldsInfo.paper[folds.toString()] ? foldsInfo.paper[folds.toString()][0] : "something, probably. I didn't research this enough, but if you know, you can submit a request, and I'll look it over!")
		}
	},
	{
		type: "image",
		image_url: foldsInfo.paper[folds.toString()] ? foldsInfo.paper[folds.toString()][1] : "https://blog.lipsumhub.com/wp-content/uploads/2024/07/lorem-ipsum-meaning-in-english-lipsumhub.jpg",
		alt_text: foldsInfo.paper[folds.toString()] ? foldsInfo.paper[folds.toString()][2] : "Lorem Ipsum dolor sit amet, consectetur adipisicing..."
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
			},
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":ballot: Submit Request",
					emoji: true
				},
				value: folds.toString(),
				action_id: "request-paper-" + folds
			}
		]
	}
];

blocks.space = folds => [
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
				value: "unfold-space",
				action_id: "unfold-space"
			}
		] : (folds <= -36 ? [
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":heavy_plus_sign: Fold",
					emoji: true
				},
				value: "fold-space",
				action_id: "fold-space"
			}
		] : [
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":heavy_minus_sign: Unfold",
					emoji: true
				},
				value: "unfold-space",
				action_id: "unfold-space"
			},
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":heavy_plus_sign: Fold",
					emoji: true
				},
				value: "fold-space",
				action_id: "fold-space"
			}
		]))
	},
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "*Stats:*\nDimensions: " + dimensions(folds).map(dimension => "*" + mmToString(dimension) + "*").join(" x ") + "\nPaper thickness: *" + mmToString(dimensions(folds)[2]) + "*\nTotal Surface Area: *" + mmToString2D(surfaceArea(folds)) + "*\nVolume: *" + mmToString3D(6237) + "* (this is constant)"
		}
	},
	{
		type: "divider"
	},
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "The thickness of your piece of paper is *" + mmToString(dimensions(folds)[2]) + "*. The thickness of your paper creates enough SPACE for " + (foldsInfo.space[folds.toString()] ? foldsInfo.space[folds.toString()][0] : "something, probably. I didn't research this enough, but if you know, you can submit a request, and I'll look it over!")
		}
	},
	{
		type: "image",
		image_url: foldsInfo.space[folds.toString()] ? foldsInfo.space[folds.toString()][1] : "https://blog.lipsumhub.com/wp-content/uploads/2024/07/lorem-ipsum-meaning-in-english-lipsumhub.jpg",
		alt_text: foldsInfo.space[folds.toString()] ? foldsInfo.space[folds.toString()][2] : "Lorem Ipsum dolor sit amet, consectetur adipisicing..."
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
			},
			{
				type: "button",
				text: {
					type: "plain_text",
					text: ":ballot: Submit Request",
					emoji: true
				},
				value: folds.toString(),
				action_id: "request-space-" + folds
			}
		]
	}
];

export default blocks;