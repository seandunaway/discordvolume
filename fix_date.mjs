#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs'

let FILE = './spoo.json'

let data = readFileSync(FILE, {encoding: 'utf8'})
let json = JSON.parse(data)

for (let i = 0; i < json.length; i++) {
	let date_string = json[i].d
	let date = new Date(date_string)
	let date_string_fix = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

	// mutate
	json[i].d = date_string_fix
}

writeFileSync(FILE, JSON.stringify(json, undefined, 2))
