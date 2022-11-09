import fs from "fs";
import https from "https";
import * as SRC from "src-ts";
import games from "../data.json" assert { type: 'json' };

const uniqueGames = games.filter((game, i) => games.indexOf(game) === i);

const download = (url: string, filepath: string) => {
	https.get(url, res => {
		const CT = res.headers["content-type"];
		const ext = CT?.split("/").at(-1) ?? "";
		res.pipe(fs.createWriteStream(`${filepath}.${ext}`));
	});
}

await Promise.all(uniqueGames.map(async (game_id) => {
	const game = await SRC.getGame(game_id);

	const uri = game.assets["cover-large"].uri;
	const filepath = `./out/${game.names.international.replace(/[\/:']/g, '')}`;

	console.log(`Downloading from ${uri}... (${game.names.international})`);
	download(uri, filepath);
	console.log(`Finished downloading ${uri}.`);
}));