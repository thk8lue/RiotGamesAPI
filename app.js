const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const { readFile } = require('fs');
const port = 3000;

const apiKey = 'RGAPI-820f5bca-268a-4021-b40a-a26ac26dec88';

//쿼리스트링으로 gamename과 tag를 보내면 응답으로 puuid를 받을 수 있다. 
//http://localhost:3000/puuid?gamename=hide%20on%20bush&tagline=kr1
app.use(express.json({ extended: false }))
    .get('/puuid', async function fetchData (req, res) {
        //console.log(req._parsedUrl.query)
        const gameName = req._parsedUrl.query.split('&')[0].substring(9)
        const tagLine = req._parsedUrl.query.split('&')[1].substring(8)
        console.log('gameName: ' + gameName)
        console.log('tagLine: '+ tagLine)
        const {data} = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`)
    res.send(data)
})

//쿼리스트링으로 puuid를 보내면 응답으로 gamename과 tagline을 응답으로 받을 수 있다.
//http://localhost:3000/gamename?puuid=DTEaxP2dz35m0fzi6FN9LiQvh1clbeim8b7ZXdbJwHRK0E1SlJ6CIKYUrT5PTMOc-q22c6RAAEpTew
app.use(express.json({ extended: false }))
    .get('/gameName', async function fetchData (req, res) {
        //console.log(req._parsedUrl.query)
        const puuid = req._parsedUrl.query.substring(6)
        console.log('puuid :' + puuid)
        const {data} = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${apiKey}`)
    res.send(data)
})

//쿼리스트링으로 puuid를 보내면 응답으로 matchId를 받을 수 있다.
//http://localhost:3000/matchId?puuid=DTEaxP2dz35m0fzi6FN9LiQvh1clbeim8b7ZXdbJwHRK0E1SlJ6CIKYUrT5PTMOc-q22c6RAAEpTew
app.use(express.json({ extended: false }))
    .get('/matchId', async function fetchData (req, res) {
        //console.log(req._parsedUrl.query)
        const puuid = req._parsedUrl.query.substring(6)
        const {data} = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`)
    res.send(data)
})

//쿼리스트링으로 matchId를 보내면 matchData를 받을 수 있다.
//http://localhost:3000/matchData?matchId=KR_7102862093
app.use(express.json({ extended: false }))
    .get('/matchData', async function fetchData (req, res) {
        //console.log(req._parsedUrl.query)
        const matchId = req._parsedUrl.query.substring(8)
        const {data} = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`)
    res.send(data)
})

app.use(express.static('home')).get('home/home.html', (req, res) => { 
    readFile('home/home.html', (err, data) => {
        if(err) { res.send('No such file of Directory')}
        res.send(data)
    })
})

app.use(express.static('ranking')).get('ranking/ranking.html', (req, res) => { 
    readFile('ranking/ranking.html', (err, data) => {
        if(err) { res.send('No such file of Directory')}
        res.send(data)
    })
})

app.use(express.static('search')).get('search/search.html', (req, res) => { 
    readFile('search/search.html', (err, data) => {
        if(err) { res.send('No such file of Directory')}
        res.send(data)
    })
})

app.listen(port, () => {
    console.log(`PORT: ${port}`)
})