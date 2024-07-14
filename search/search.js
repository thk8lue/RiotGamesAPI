const apiKey = 'RGAPI-820f5bca-268a-4021-b40a-a26ac26dec88';
const item_null = './item_null.png';
const port = 3000;

let puuid;
let matchIdArr = [];
let matchData = [];

async function search() {
    const gameName = document.getElementById('gameNameInput').value;
    const tagLine = document.getElementById('tagLineInput').value;
    console.log(`${gameName}#${tagLine}`);
    await getPuuid(gameName, tagLine);
    await getMatchId()
    await getMatchData()
    await printData()
}

async function getPuuid(gameName, tagLine) {
    const res = await fetch(
        `http://localhost:${port}/puuid/?gameName=${gameName}&tagLine=${tagLine}`
        ,{
            "headers":{
            "origin":"https://asia.api.riotgames.com/",
            "Access-Control-Allow-Origin":"*",
            }
        }
    )

    let resJson = await res.json();

    puuid = await resJson.puuid

    await console.log(`${gameName}#${tagLine}: ${puuid}`);
}

async function getMatchId(){
    const res = await fetch(
        `http://localhost:${port}/matchId/?puuid=${puuid}`
        ,{
            "headers":{
            "origin":"https://asia.api.riotgames.com/",
            "Access-Control-Allow-Origin":"*",
            }
        }
    )

    let resJson = await res.json();

    matchIdArr = [...resJson]

    await console.log(matchIdArr);
}

async function getMatchData(){
    for (let i = 0; i < 10; i++)
   {
        const res = await fetch(
            `http://localhost:${port}/matchData/?matchId=${matchIdArr[i]}`
            ,{
                "headers":{
                "origin":"https://asia.api.riotgames.com/",
                "Access-Control-Allow-Origin":"*",
                }
            }
        )
    
        let resJson = await res.json();

        await matchData.push({participantsIndex: resJson.metadata.participants.indexOf(puuid)})
        //참가자 인덱스

        async function winCheck(){
            if(resJson.metadata.participants.indexOf(puuid) < 5){
                matchData[i].team = 0
            } else { // index > 4 
                matchData[i].team = 1      
            } 
        }
        //레드팀 퍼플팀

        await winCheck();
        matchData[i].win = await resJson.info.teams[matchData[i].team].win
        //승패

        matchData[i].championName = await resJson.info.participants[matchData[i].participantsIndex].championName
        //챔피언 이름

        matchData[i].gameMode = await resJson.info.queueId
        //게임 모드 id

        matchData[i].kills = await resJson.info.participants[matchData[i].participantsIndex].kills
        matchData[i].deaths = await resJson.info.participants[matchData[i].participantsIndex].deaths
        matchData[i].assists = await resJson.info.participants[matchData[i].participantsIndex].assists
        //KDA

        matchData[i].spell1Id = await resJson.info.participants[matchData[i].participantsIndex].summoner1Id
        matchData[i].spell2Id = await resJson.info.participants[matchData[i].participantsIndex].summoner2Id
        //스펠

        matchData[i].runeMainId = await resJson.info.participants[matchData[i].participantsIndex].perks.styles[0].selections[0].perk
        matchData[i].runeSubId = await resJson.info.participants[matchData[i].participantsIndex].perks.styles[1].style
        //룬

        matchData[i].item0Id = await resJson.info.participants[matchData[i].participantsIndex].item0
        matchData[i].item1Id = await resJson.info.participants[matchData[i].participantsIndex].item1
        matchData[i].item2Id = await resJson.info.participants[matchData[i].participantsIndex].item2
        matchData[i].item3Id = await resJson.info.participants[matchData[i].participantsIndex].item3
        matchData[i].item4Id = await resJson.info.participants[matchData[i].participantsIndex].item4
        matchData[i].item5Id = await resJson.info.participants[matchData[i].participantsIndex].item5
        matchData[i].item6Id = await resJson.info.participants[matchData[i].participantsIndex].item6
        //아이템


        
        await console.log(`Rune: ${matchData[i].spell1Id} ${matchData[i].spell2Id}`)

    }
}

async function printData(){
    await matchData.forEach(
        element => {
            const li = document.createElement('li')
            li.setAttribute('class', 'row');
            document.getElementById('table').appendChild(li);

            const winDiv = document.createElement('div')
            winDiv.setAttribute('class', 'win');
            document.getElementById('table').appendChild(li);
            if(element.win){
                const winVal = document.createTextNode('승리')
                winDiv.appendChild(winVal)
            } else {
                const winVal = document.createTextNode('패배')
                winDiv.appendChild(winVal)
            }
            document.getElementById('table').appendChild(li).append(winDiv)

            const champDiv = document.createElement('div')
            champDiv.setAttribute('class', 'champDiv')
            const champImg = document.createElement('img')
            champImg.setAttribute('class','champImg')
            champImg.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${element.championName}.png`)
            document.getElementById('table').appendChild(li).appendChild(champDiv).append(champImg)

            const kdaDiv = document.createElement('div')
            kdaDiv.setAttribute('class', 'kdaDiv')
            const kdaVal = document.createTextNode(`${element.kills} / ${element.deaths} / ${element.assists}`)
            kdaDiv.appendChild(kdaVal)
            document.getElementById('table').appendChild(li).append(kdaDiv)

            const spellDiv = document.createElement('div')
            spellDiv.setAttribute('class', 'spellDiv')
            const spell1Img = document.createElement('img')
            spell1Img.setAttribute('class','spell1Img')
            switch(element.spell1Id){
                case 21:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerBarrier.png`)
                break
                case 1:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerBoost.png`)
                break
                case 2202:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerCherryFlash.png`)
                break
                case 2201:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerCherryHold.png`)
                break
                case 14:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerDot.png`)
                break
                case 3:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerExhaust.png`)
                break
                case 4:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerFlash.png`)
                break
                case 6:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerHaste.png`)
                break
                case 7:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerHeal.png`)
                break
                case 13:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerMana.png`)
                break
                case 30:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerPoroRecall.png`)
                break
                case 31:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerPoroThrow.png`)
                break
                case 39:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSnowURFSnowball_Mark.png`)
                break
                case 32:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSnowball.png`)
                break
                case 11:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSmite.png`)
                break
                case 12:
                spell1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerTeleport.png`)
                break
            }

            const spell2Img = document.createElement('img')
            spell2Img.setAttribute('class','spell2Img')
            switch(element.spell2Id){
                case 21:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerBarrier.png`)
                break
                case 1:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerBoost.png`)
                break
                case 2202:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerCherryFlash.png`)
                break
                case 2201:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerCherryHold.png`)
                break
                case 14:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerDot.png`)
                break
                case 3:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerExhaust.png`)
                break
                case 4:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerFlash.png`)
                break
                case 6:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerHaste.png`)
                break
                case 7:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerHeal.png`)
                break
                case 13:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerMana.png`)
                break
                case 30:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerPoroRecall.png`)
                break
                case 31:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerPoroThrow.png`)
                break
                case 39:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSnowURFSnowball_Mark.png`)
                break
                case 32:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSnowball.png`)
                break
                case 11:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerSmite.png`)
                break
                case 12:
                spell2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/spell/SummonerTeleport.png`)
                break
            }

            document.getElementById('table').appendChild(li).appendChild(spellDiv).append(spell1Img, spell2Img)
            

            const runeDiv = document.createElement('div')
            runeDiv.setAttribute('class', 'runeDiv')
            const rune1Img = document.createElement('img')
            rune1Img.setAttribute('class','rune1Img')
            switch(element.runeMainId){
                case 8112:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Domination/Electrocute/Electrocute.png`)
                break;
                case 8124:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Domination/Predator/Predator.png`)
                break;
                case 8128:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png`)
                break;
                case 9923:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png`)
                break;
                case 8351:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png`)
                break;
                case 8360:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png`)
                break;
                case 8369:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png`)
                break;
                case 8005:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png`)
                break;
                case 8008:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png`)
                break;
                case 8021:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png`)
                break;
                case 8010:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Precision/Conqueror/Conqueror.png`)
                break;
                case 8437:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png`)
                break;
                case 8439:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png`)
                break;
                case 8465:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Resolve/Guardian/Guardian.png`)
                break;
                case 8214:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png`)
                break;
                case 8229:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png`)
                break;
                case 8230:
                rune1Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png`)
                break;
            }

            const rune2Img = document.createElement('img')
            rune2Img.setAttribute('class','rune2Img')
            switch(element.runeSubId){
                case 8100:
                rune2Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/7200_Domination.png`)
                break;
                case 8300:
                rune2Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/7203_Whimsy.png`)
                break;
                case 8000:
                rune2Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/7201_Precision.png`)
                break;
                case 8400:
                rune2Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/7204_Resolve.png`)
                break;
                case 8200:
                rune2Img.setAttribute('src',`https://ddragon.canisback.com/img/perk-images/Styles/7202_Sorcery.png`)
                break;
            }

            document.getElementById('table').appendChild(li).appendChild(runeDiv).append(rune1Img, rune2Img)

            const itemDiv = document.createElement('div')
            itemDiv.setAttribute('class', 'itemDiv')

            
            const item0Img = document.createElement('img')
            item0Img.setAttribute('class','item0Img')
            const item1Img = document.createElement('img')
            item1Img.setAttribute('class','item1Img')
            const item2Img = document.createElement('img')
            item2Img.setAttribute('class','item2Img')
            const item3Img = document.createElement('img')
            item3Img.setAttribute('class','item3Img')
            const item4Img = document.createElement('img')
            item4Img.setAttribute('class','item4Img')
            const item5Img = document.createElement('img')
            item5Img.setAttribute('class','item5Img')
            const item6Img = document.createElement('img')
            item6Img.setAttribute('class','item6Img')
            
            if(element.item0Id == 0){
                item0Img.setAttribute('src',`./item_null.png`)
            } else {
                item0Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item0Id}.png`)
            }

            if(element.item1Id == 0){
                item1Img.setAttribute('src',`./item_null.png`)
            } else {
                item1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item1Id}.png`)
            }

            if(element.item2Id == 0){
                item2Img.setAttribute('src',`./item_null.png`)
            } else {
                item2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item2Id}.png`)
            }

            if(element.item3Id == 0){
                item3Img.setAttribute('src',`./item_null.png`)
            } else {
                item3Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item3Id}.png`)
            }

            if(element.item4Id == 0){
                item4Img.setAttribute('src',`./item_null.png`)
            } else {
                item4Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item4Id}.png`)
            }

            if(element.item5Id == 0){
                item5Img.setAttribute('src',`./item_null.png`)
            } else {
                item5Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item5Id}.png`)
            }

            if(element.item6Id == 0){
                item6Img.setAttribute('src',`./item_null.png`)
            } else {
                item6Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item6Id}.png`)
            }
            
            // item0Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item0Id}.png`)
            // item1Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item1Id}.png`)
            // item2Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item2Id}.png`)
            // item3Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item3Id}.png`)
            // item4Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item4Id}.png`)
            // item5Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item5Id}.png`)
            // item6Img.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${element.item6Id}.png`)

            document.getElementById('table').appendChild(li).appendChild(itemDiv)
            .append(item0Img, item1Img, item2Img, item3Img, item4Img, item5Img, item6Img)



        })
}

search()