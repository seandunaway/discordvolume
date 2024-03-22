#!/usr/bin/env node

import {env} from 'node:process'
import {writeFileSync} from 'node:fs'

let guild = '519749471102304258'
let channel = '849455257472991243'
let date_start = new Date('2/7/2024')
let date_stop = new Date()
let data_file = './data.tmp.json'

if (!env.auth) throw new Error('auth')

let data = []
let d = new Date(date_start)
while (d <= date_stop) {
	let d_next = new Date(d)
	d_next.setDate(d.getDate() + 1)

	let min_id = date_to_snowflake(d)
	let max_id = date_to_snowflake(d_next)

	let url = `https://discord.com/api/v9/guilds/${guild}/messages/search?&min_id=${min_id}&max_id=${max_id}&sort_by=timestamp&sort_order=asc&offset=0`
	if (channel) url += `&channel_id=${channel}`

	let results
	try {
		let response = await fetch(url, {headers: {'authorization': env.auth}})
		let json = await response.json()
		if (json.retry_after) {
			await sleep(json.retry_after * 1_000)
			continue
		}
		results = json.total_results
	} catch (error) {
		console.error(error)
		continue
	}

	let date_string = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
	data.push({d: date_string, v: results})
	console.info(`${date_string}: ${results}`)

	d = d_next
}

writeFileSync(data_file, JSON.stringify(data, undefined, 2))
console.info('done!')

// https://discord.com/developers/docs/reference#snowflakes
function date_to_snowflake(date = new Date()) {
	let DISCORD_EPOCH = new Date('1/1/2015 UTC')
	let diff = date.getTime() - DISCORD_EPOCH.getTime()
	let binary = diff.toString(2).padStart(42, '0')
	let binary_padded = binary + '00000' + '00000' + '000000000000'
	let snowflake = parseInt(binary_padded, 2)
	return snowflake
}

async function sleep(timeout) {
	return new Promise (function (resolve) {setTimeout(resolve, timeout)})
}
