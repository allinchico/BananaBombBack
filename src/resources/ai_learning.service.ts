import { NotFoundException } from '~/utils/exceptions';
import fs from 'fs';

interface caseGrille {
    x: number;
    y: number;
    value: number;
}

interface bestPath{
    firstStep: string; 
    secondStep: string; 
    thirdStep: string;
}

export class AiLearningService {


    formatMap(map: caseGrille[]){
        let posBot = map.filter(caseMap => caseMap.value === 1)[0];
        return map.filter(caseMap => (caseMap.x <= posBot.x + 3) && (caseMap.y <= posBot.y + 3) && (caseMap.x >= posBot.x - 3) && (caseMap.y >= posBot.y - 3))
         
    }
    
    newLearning(mapTest: caseGrille[]){
        //map: string[]
        const DIRECTIONS = [ "LEFT", "UP", "DOWN", "RIGHT"];
        //
        let bestPath: bestPath = {firstStep: "N", secondStep: "N", thirdStep: "N"};
        let bestPathValue = 0;
        for(let k = 1; k<1000; k++){
            let mapTestOG: caseGrille[] = JSON.parse(JSON.stringify(mapTest));
            //console.log("debut recherche d'un chemin")
            let posBot = mapTestOG.filter(coords => coords.value === 1)[0];
            let currentPathValue = 0;
            let pathValue = "";
            for(let j = 1; j<4; j++){ 
                let newPosBot: caseGrille;
                newPosBot = { x: posBot.x, y: posBot.y, value: posBot.value };
                let randomDirection =  DIRECTIONS[Math.floor(Math.random() * 4)];
                //console.log(randomDirection)
                pathValue = pathValue + randomDirection.charAt(0);
                switch(randomDirection){
                    case "LEFT":
                        if(newPosBot.x > 0 && mapTestOG.filter(coords => (coords.x == newPosBot.x - 1) && (coords.y == newPosBot.y) && (coords.value != 0))){
                            newPosBot.x = newPosBot.x - 1;
                            let tmpValue = mapTestOG.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0];
                            newPosBot.value = tmpValue.value;
                            currentPathValue = currentPathValue + newPosBot.value;
                        }
                        break;
                    case "UP":
                        if(newPosBot.y > 0 && mapTestOG.filter(coords => (coords.x == newPosBot.x) && (coords.y == newPosBot.y - 1) && (coords.value != 0))){
                            newPosBot.y = newPosBot.y - 1;
                            let tmpValue = mapTestOG.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0];
                            newPosBot.value = tmpValue.value;
                            currentPathValue = currentPathValue + newPosBot.value;
                        }
                        break;
                    case "DOWN":
                        //ajouter if condition
                        if(mapTestOG.filter(coords => coords.y == newPosBot.y + 1).length && mapTestOG.filter(coords => (coords.x == newPosBot.x) && (coords.y == newPosBot.y + 1) && (coords.value != 0))){
                            newPosBot.y = newPosBot.y + 1;
                            let tmpValue = mapTestOG.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0];
                            newPosBot.value = tmpValue.value;
                            currentPathValue = currentPathValue + newPosBot.value;
                        }
                        break;
                    case "RIGHT":
                        //ajouter if condition
                        if(mapTestOG.filter(coords => coords.x == newPosBot.x + 1).length && mapTestOG.filter(coords => (coords.x == newPosBot.x + 1) && (coords.y == newPosBot.y) && (coords.value != 0))){
                            newPosBot.x = newPosBot.x + 1;
                            let tmpValue = mapTestOG.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0];
                            newPosBot.value = tmpValue.value;
                            currentPathValue = currentPathValue + newPosBot.value;
                        }
                        break;
                    default:
                    console.log("erreur dans la direction");
                }
                //console.log(newPosBot);
                mapTestOG.filter(coords => coords.x == posBot.x && coords.y == posBot.y).forEach(coords=> {coords.value = 3});
                posBot = {x: newPosBot.x, y: newPosBot.y, value: 1};
                }
            if(currentPathValue>bestPathValue){
                bestPathValue = currentPathValue;
                bestPath = {firstStep: pathValue.charAt(0), secondStep: pathValue.charAt(1), thirdStep: pathValue.charAt(2)};
                console.log(mapTestOG)
            }
        }
        console.log(bestPathValue);
        console.log(bestPath);
        let idMap = this.generateIdMap(mapTest);
        this.writeInFile(idMap, bestPath);
        return "ça marche";
    }

    writeInFile(id: string, result: bestPath){
        let path = result.firstStep+result.secondStep+result.thirdStep;
        console.log(process.cwd());
        let data = fs.readFileSync(process.cwd()+'\\src\\resources\\ai_learning_db.json', 'utf-8');
        let JSONdata = JSON.parse(data)
        try {
            JSONdata = {...JSONdata, [id]: path };
            fs.writeFileSync(process.cwd()+'\\src\\resources\\ai_learning_db.json', JSON.stringify(JSONdata))
        } catch (e) {
            console.log(e);
        }
    }


    generateIdMap(map: caseGrille[]){
        let id = "";
        map.forEach(caseGrille => id = id + caseGrille.value);
        return id;
    }
}

