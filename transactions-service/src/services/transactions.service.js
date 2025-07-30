import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import createError from "http-errors";
import {
    getGenerations,
    buildWorkbook,
    buildGenerationsRelationship,
    outOfPatternPlayers
} from "../utils/team-generations.util.js";
import httpStatus from "http-status";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TeamGenerationsService {
    async buildGenerations(body) {
        try {
            const team = body.team.replace(/ /g, "_").toUpperCase();
            const fileName = `players_${team}.json`;
            const inputFilePath = path.resolve(__dirname, "..", "..", "data-output", fileName);
            const rawTeamPlayersData = fs.readFileSync(inputFilePath, "utf8").toString();
            const outputFilePath = path.resolve(__dirname, "..", "..", "data-output", `players_${team}.xlsx`);
            const teamPlayers = JSON.parse(rawTeamPlayersData);
            const generations = getGenerations(teamPlayers);
            const generationsCompare = [];
            const playersOutOfPattern = outOfPatternPlayers(teamPlayers).map(player => ({
                nome: player.nome,
                numero: player.numero,
                idadeAtual: player.idadeAtual,
                idadeFimDoMes: player.idadeFimDoMes
            }));

            buildGenerationsRelationship(team, generations, generationsCompare);

            const workbook = buildWorkbook(generationsCompare);

            await workbook.xlsx.writeFile(outputFilePath)
                .then(() => {
                    console.log(`File saved as ${outputFilePath}`);
                })
                .catch(error => {
                    console.error("Error saving the file:", error);
                    throw error;
                });

            return {
                team,
                hasPlayersOutOfPattern: playersOutOfPattern.length > 0,
                playersOutOfPattern,
            };
        } catch (error) {
            throw createError(httpStatus.BAD_REQUEST, error.message || 'Houve um problema ao gerar a escadinha do seu time.');
        }
    }
}

export default TeamGenerationsService;
