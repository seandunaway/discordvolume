#!/usr/bin/env node

import {writeFileSync} from 'node:fs'

let symbol = 'ES=F'
let interval = '1d'
let date_start = new Date('6/1/2021')
let date_stop = new Date('2/7/2024')

let period1 = date_start.getTime() / 1_000
let period2 = date_stop.getTime() / 1_000

let response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?&interval=${interval}&period1=${period1}&period2=${period2}`)
let json = await response.json()
console.log(json)
let result = json.chart.result[0]

let spoo = []
for (let i = 0; i < result.timestamp.length; i++) {
	let date = new Date(result.timestamp[i] * 1000)
	let date_string = date.toLocaleDateString()
	let price = result.indicators.quote[0].close[i]

	if (!price) continue

	spoo.push({k: date_string, v: price})
	console.info(`${date_string}: ${price}`)
}

writeFileSync('./spoo.json', JSON.stringify(spoo, undefined, 2))
console.info('done!')
