const apiKey = 'RGAPI-820f5bca-268a-4021-b40a-a26ac26dec88';
const port = 3000;
let rankData = [];

async function ranking() {
  console.log(apiKey);
  await getLeagueData(apiKey);
  await getSummonerData(rankData);
  await getGameName(rankData);
  await printData(rankData);
  await console.log(rankData)
}

async function getLeagueData(key) {
  const res = await fetch(
    `https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${key}`,
  )
  // 리그 데이터 호출

  const resJson = await res.json();
  //응답 받은 데이터를 JSON으로 변환

  const leagueData = await resJson.entries.sort(function (a, b) {
    return b.leaguePoints - a.leaguePoints
  })
  //랭킹 순으로 정렬

  
  await leagueData.forEach(
    element => rankData.push({
      summonerId: element.summonerId,
      leaguePoints: element.leaguePoints,
      wins: element.wins,
      losses: element.losses,
    })
  )
  //배열에 저장
  
  //await console.log(rankData)
}

async function getSummonerData(rankData) {
  for (let i = 0; i < 10; i++) {

      let res = await fetch(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/${rankData[i].summonerId}?api_key=${apiKey}`
      )


    let resJson = await res.json();
    //응답 받은 데이터를 JSON으로 변환

    rankData[i].puuid = resJson.puuid;
    //puuid 값을 rankData에 추가

    rankData[i].profileIconId = resJson.profileIconId;
    //iconId 값을 rankData에 추가

    await console.log(rankData[i].puuid);

  }
}

async function getGameName(rankData) {
  for (let i = 0; i < 10; i++) {
    let res = await fetch(
      `http://localhost:${port}/gameName/?puuid=${rankData[i].puuid}`
      ,{
        "headers":{
          "origin":"https://asia.api.riotgames.com/",
          "Access-Control-Allow-Origin":"*",
        }
      }
    )

    let resJson = await res.json();
    //응답 받은 데이터를 JSON으로 변환

    rankData[i].gameName = resJson.gameName;
    //gameName 값을 rankData에 추가 
    rankData[i].tagLine = resJson.tagLine;
    //tagLine 값을 rankData에 추가

    await console.log(`${rankData[i].gameName}#${rankData[i].tagLine}`);
  }
}

async function printData(rankData) {
    
  await rankData.forEach(
    element => {
      const li = document.createElement('li')
      li.setAttribute('class', 'row');

      const icondiv = document.createElement('div')
      icondiv.setAttribute('class', 'icondiv')
      const iconimg = document.createElement('img')
      iconimg.setAttribute('class','icon')
      iconimg.setAttribute('src',`https://ddragon.leagueoflegends.com/cdn/14.12.1/img/profileicon/${element.profileIconId}.png`)
      document.getElementById('table').appendChild(li).appendChild(icondiv).append(iconimg)
      

      const summonerNameDiv = document.createElement('div')
      summonerNameDiv.setAttribute('class','summonerName')
      const summonerNameVal = document.createTextNode(`${element.gameName}#${element.tagLine}`)
      summonerNameDiv.appendChild(summonerNameVal)
      document.getElementById('table').appendChild(li).append(summonerNameDiv)
      
      const lpDiv = document.createElement('div')
      lpDiv.setAttribute('class','leaguePoints')
      const lpVal = document.createTextNode(element.leaguePoints)
      lpDiv.appendChild(lpVal)
      document.getElementById('table').appendChild(li).append(lpDiv)

      const winsDiv = document.createElement('div')
      winsDiv.setAttribute('class','wins')
      const winsVal = document.createTextNode(element.wins)
      winsDiv.appendChild(winsVal)
      document.getElementById('table').appendChild(li).append(winsDiv)

      const lossesDiv = document.createElement('div')
      lossesDiv.setAttribute('class','losses')
      const lossesVal = document.createTextNode(element.losses)
      lossesDiv.appendChild(lossesVal)
      document.getElementById('table').appendChild(li).append(lossesDiv)
    }
  )
  

}

ranking()
