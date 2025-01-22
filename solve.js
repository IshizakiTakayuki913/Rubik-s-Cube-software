class State {
	constructor(cp, co, ep, eo, c = [0,1,2,3,4,5]) {
		this.cp = cp
		this.co = co
		this.ep = ep
		this.eo = eo
		this.c 	= c
		// console.log(cp, co, ep, eo);
	}
	apply_move(move) {
		let new_cp = new Array(8);
		let new_co = new Array(8);
		for(let i=0;i<8;i++){
			new_cp[i] = this.cp[move.cp[i]];
			new_co[i] = (this.co[move.cp[i]] + move.co[i]) % 3;
		}

		let new_ep = new Array(12);
		let new_eo = new Array(12);
		for(let i=0;i<12;i++){
			new_ep[i] = this.ep[move.ep[i]]
			new_eo[i] = (this.eo[move.ep[i]] + move.eo[i]) % 2;
		}
		
		// if(typeof move.c === "undefined")
		// 	return new State(new_cp, new_co, new_ep, new_eo, c)

		let new_c = new Array(6);
		for(let i=0;i<6;i++)	new_c[i] = this.c[move.c[i]]
		
		return new State(new_cp, new_co, new_ep, new_eo, new_c);
	}
	
	hand_move(move) {
		let new_cp = new Array(8);
		let new_co = new Array(8);
		// let graph = ". 今前位置 前向き 今、前位置の中にあるのがいる出来場所\n"
		for(let i=0;i<8;i++){
			new_cp[i] = move.cp.indexOf(this.cp[move.cp[i]])
			new_co[i] = (3+move.co[i]+this.co[move.cp[i]]-move.co[move.cp.indexOf(this.cp[move.cp[i]])])%3
			// graph += [
			// 	i,
			// 	move.co[i],
			// 	move.cp[i],
			// 	this.co[move.cp[i]],
			// 	this.cp[move.cp[i]],
			// 	move.cp.indexOf(this.cp[move.cp[i]]),
			// 	move.co[move.cp.indexOf(this.cp[move.cp[i]])],
			// 	(3+move.co[i]+this.co[move.cp[i]]-move.co[move.cp.indexOf(this.cp[move.cp[i]])])%3,
			// ].join(' ')+"\n"
		}

		let new_ep = new Array(12);
		let new_eo = new Array(12);
		for(let i=0;i<12;i++){
			new_ep[i] = move.ep.indexOf(this.ep[move.ep[i]])
			new_eo[i] = (2+move.eo[i]+this.eo[move.ep[i]]-move.eo[move.ep.indexOf(this.ep[move.ep[i]])])%2
		}
		
		if(typeof move.c === "undefined"){
			//console.log(`typeof move.c === "undefined"`)
			return new State(new_cp, new_co, new_ep, new_eo, this.c)
		}

		let new_c = new Array(6)
		for(let i=0;i<6;i++)	new_c[i] = move.c.indexOf(this.c[move.c[i]])
		
		return new State(new_cp, new_co, new_ep, new_eo, new_c)
	}
	
	data_print() {
		//console.log(this.cp)
		//console.log(this.co)
		//console.log(this.ep)
		//console.log(this.eo)
		//console.log(this.c)
	}
}

class Search {
	constructor(){
		this.current_solution = []	//今探索している手順を入れておくスタック
		// console.log(`this.current_solution [${this.current_solution}]`)
	}

	depth_limited_search(state,step, depth){
		//console.log(`depth ${depth}`)
		state.data_print()
		//console.log(state)
		//console.log(step)
		if(depth === 0 && is_solved(state,step)){
				// console.log(`OK depth: ${depth}`)
				// state.data_print()
				return true
		}
		if(depth === 0){
				// console.log(`depth === 0 false`)
				return false
		}
	

		let prev_move = this.current_solution.length === 0 ? undefined :this.current_solution[this.current_solution.length - 1]   //# 1手前の操作
		// console.log(`prev_move [${prev_move}]`)

		for(const move_name of step_move_names){
			// console.log(`move_name [${move_name}]`)
			const a= is_move_available(prev_move, move_name)
			// console.log(`prev_move [${prev_move}] move [${move_name}] t ${a}`)
			if(!a){
				// console.log(`  next`)
				continue
			}

			this.current_solution.push(move_name)
			// console.log(this.current_solution)
			// state.data_print()
			if(this.depth_limited_search(state.apply_move(moves[move_name]),step, depth - 1))
				return true
			this.current_solution.pop()
		}
	}

	
	start_search(state,step, max_length=20, smn){
		// """
		// 再帰関数、目標とする状態になるまで操作数を増やして探索する
		// """
		//console.log(step)
		if	(step.type=="pos&exp")	is_solved = is_solved_1
		else if	(step.type=="exp")	is_solved = is_solved_2
		else if	(step.type=="pos")	is_solved = is_solved_3
		 

		step_move_names = smn
		//console.log(step_move_names)
		//console.log({max_length})

		for(let depth=0;depth<max_length+1;depth++){
			//console.log(`# Start searching length ${depth}`)
			if(this.depth_limited_search(state,step, depth))
				return this.current_solution.join(' ')
		}
		return undefined
	}
}

const inv_face = {
    "U": "D",
    "D": "U",
    "L": "R",
    "R": "L",
    "F": "B",
    "B": "F",
}

const move_reverse = {
	"U": "U'",  "U'": "U",
	"D": "D'",  "D'": "D",
	"L": "L'",  "L'": "L",
	"R": "R'",  "R'": "R",
	"F": "F'",  "F'": "F",
	"B": "B'",  "B'": "B",
	"x": "x'",  "x'": "x",
	"y": "y'",  "y'": "y",
	"z": "z'",  "z'": "z",
}

function is_move_available(prev_move, move){
	// """
	// 前の1手を考慮して次の1手として使える操作であるかを判定する
	// - 同じ面は連続して回さない (e.g. R' R2 は不可)
	// - 対面を回すときは順序を固定する (e.g. D Uは良いが、U Dは不可)
	// """
	if(prev_move == undefined)
			return true  //# 最初の1手はどの操作も可
	prev_face = prev_move[0]  //# 1手前で回した面
	if(prev_face.length>2 || prev_move.length>2)	return true
	if(prev_face == move[0])
			return false //# 同一面は不可
	if(inv_face[prev_face] == move[0])
			return prev_face < move[0] //# 対面のときは、辞書順なら可
	return true
}

function scamble2state(S_S,scramble){
	let scrambled_state = S_S
	// console.log(scrambled_state)
	if(scramble == "")
		return scrambled_state
	
	const scr = scramble.split(" ")
	for(let i=0;i<scr.length;i++){
		const move_state = moves[scr[i]]
		scrambled_state = scrambled_state.apply_move(move_state)
	}
	return scrambled_state
}

function color_re_set(sulb){
	let new_color = new Array(color_data.length)
	for(let i=0;i<color_data.length;i++){
		new_color[i] = color_data[color_modes[sulb][i]]
	}
	return new_color
}

let is_solved

function is_solved_1(state,step){
// 特定の場所の状態だけを調べる
	// console.log(`is_solved`)


	if(state.c[0] != 0 || state.c[1] != 1)	return false

	// console.log(`is_solved`)
	for(let i=0;i<step["c"].length;i++){
		if(state.cp[step["c"][i]] != step["c"][i] || state.co[step["c"][i]] != 0)
			return false
	}
	
	// console.log(`is_solved`)
	for(let i=0;i<step["e"].length;i++){
		if(state.ep[step["e"][i]] != step["e"][i] || state.eo[step["e"][i]] != 0)
			return false
	}

	// console.log(`OK`)
	return true
}

function is_solved_2(state,step){
	// 特定の場所の状態だけを調べる
		// console.log(`is_solved`)
		if(state.c[0] != 0 || state.c[1] != 1)	return false
	
		for(let i=0;i<step["c"].length;i++){
			if(state.cp[step["c"][i]] != step["c"][i] || state.co[step["c"][i]] != 0)
				return false
		}
		
		for(let i=0;i<step["e"].length;i++){
			if(state.ep[step["e"][i]] != step["e"][i] || state.eo[step["e"][i]] != 0)
				return false
		}

		for(let i=0;i<step["co"].length;i++){
			if(state.co[step["co"][i]] != 0)
				return false
		}
		
		for(let i=0;i<step["eo"].length;i++){
			if(state.eo[step["eo"][i]] !=  0)
				return false
		}
	
		return true
	}
	
function is_solved_3(state,step){
	// 特定の場所の状態だけを調べる
	// console.log(`is_solved`)
	// console.log(step)
	if(state.c[0] != 0 || state.c[1] != 1)	return false

	// console.log(`is_solved 1`)
	for(let i=0;i<step["c"].length;i++){
		if(state.cp[step["c"][i]] != step["c"][i] || state.co[step["c"][i]] != 0)
			return false
	}
	
	// console.log(`is_solved 2`)
	for(let i=0;i<step["e"].length;i++){
		if(state.ep[step["e"][i]] != step["e"][i] || state.eo[step["e"][i]] != 0)
			return false
	}

	// console.log(`is_solved 3`)
	// console.log(step["cp"])
	for(let i=0;i<step["cp"].length;i++){
		// console.log(step["cp"][i])
		// console.log(`${state.cp[step["cp"][i][0]]} ${step["cp"][i][1]}`)
		if(state.cp[step["cp"][i][0]] != step["cp"][i][1])
			return false
	}
	
	// console.log(`is_solved 4`)
	for(let i=0;i<step["ep"].length;i++){
		// console.log(step["ep"][i])
		if(state.ep[step["ep"][i][0]] != step["ep"][i][1])
			return false
	}

	// console.log(`OK`)
	return true
}

moves = {
	'U': new State(
		[3, 0, 1, 2, 4, 5, 6, 7],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'R': new State(
		[0, 2, 6, 3, 4, 1, 5, 7],
		[0, 1, 2, 0, 0, 2, 1, 0],
		[0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'L': new State(
		[4, 1, 2, 0, 7, 5, 6, 3],
		[2, 0, 0, 1, 1, 0, 0, 2],
		[11, 1, 2, 7, 4, 5, 6, 0, 8, 9, 10, 3],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'F': new State(
		[0, 1, 3, 7, 4, 5, 2, 6],
		[0, 0, 1, 2, 0, 0, 2, 1],
		[0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11],
		[0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0]
	),
	'D': new State(
		[0, 1, 2, 3, 5, 6, 7, 4],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	),
	'B': new State(
		[1, 5, 2, 3, 0, 4, 6, 7],
		[1, 2, 0, 0, 2, 1, 0, 0],
		[4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11],
		[1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
	),
	'x': new State(
		[3, 2, 6, 7, 0, 1, 5, 4],
		[2, 1, 2, 1, 1, 2, 1, 2],
		[7, 5, 9, 11, 6, 2, 10, 3, 4, 1, 8, 0],
		[0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
		[4, 1, 5, 3, 2, 0],
	),
	'y': new State(
		[3, 0, 1, 2, 7, 4, 5, 6],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10],
		[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		[3, 0, 1, 2, 4, 5],
	),
	'z': new State(
		[4, 0, 3, 7, 5, 1, 2, 6],
		[1, 2, 1, 2, 2, 1, 2, 1],
		[8, 4, 6, 10, 0, 7, 3, 11, 1, 5, 2, 9],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[0, 4, 2, 5, 3, 1],
	),
	'z': new State(
		[4, 0, 3, 7, 5, 1, 2, 6],
		[1, 2, 1, 2, 2, 1, 2, 1],
		[8, 4, 6, 10, 0, 7, 3, 11, 1, 5, 2, 9],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[0, 4, 2, 5, 3, 1],
	),
}

moves_face_c = [
	[0,1,2,3],
	[1,2,5,6],
	[0,3,4,7],
	[2,3,6,7],
	[4,5,6,7],
	[0,1,4,5],
	[0,1,2,3,4,5,6,7],
	[0,1,2,3,4,5,6,7],
	[0,1,2,3,4,5,6,7],
	[1,2,5,6],
	[0,3,4,7],
	[0,1,2,3],
	[4,5,6,7],
	[2,3,6,7],
	[0,1,4,5],
]
 
moves_face_e = [
	[4,5,6,7],
	[1,2,5,9],
	[0,3,7,11],
	[2,3,6,10],
	[8,9,10,11],
	[0,1,4,8],
	[0,1,2,3,4,5,6,7,8,9,10,11],
	[0,1,2,3,4,5,6,7,8,9,10,11],
	[0,1,2,3,4,5,6,7,8,9,10,11],
	[1,2,4,5,6,8,9,10],
	[0,3,4,6,7,8,10,11],
	[0,1,2,3,4,5,6,7],
	[0,1,2,3,8,9,10,11],
	[2,3,5,6,7,9,10,11],
	[0,1,4,5,7,8,9,11],
]

moves_face_cn = [
	[4],
	[1],
	[3],
	[2],
	[5],
	[0],
	[0,1,2,3,4,5],
	[0,1,2,3,4,5],
	[0,1,2,3,4,5],
	[0,1,2,4,5],
	[0,2,3,4,5],
	[0,1,2,3,4],
	[0,1,2,3,5],
	[1,2,3,4,5],
	[0,1,3,4,5],
]

let move_names = []
let step_move_names = []
let move_cross = []
let move_D_corner = []

moves['r'] = moves["L"].apply_move(moves["x"])
moves['l'] = moves["R"].apply_move(moves["x"]).apply_move(moves["x"]).apply_move(moves["x"])
moves['u'] = moves["D"].apply_move(moves["y"])
moves['d'] = moves["U"].apply_move(moves["y"]).apply_move(moves["y"]).apply_move(moves["y"])
moves['f'] = moves["B"].apply_move(moves["z"])
moves['b'] = moves["F"].apply_move(moves["z"]).apply_move(moves["z"]).apply_move(moves["z"])

const faces = Object.keys(moves)
// U D L R B F
// 									U   R L    F    D B    y  z  x   r l   u d   b f
const faces_rad = [-1, -1,1,  -1,   1,1,  -1,-1,-1 ,-1,1, -1,1, -1,1]
for(let i=0;i<faces.length;i++){
	move_names.push(faces[i], faces[i] + '2', faces[i] + '\'')
	moves[faces[i] + '2'] = moves[faces[i]].apply_move(moves[faces[i]])
	moves[faces[i] + '\''] = moves[faces[i]].apply_move(moves[faces[i]]).apply_move(moves[faces[i]])
}

function palms(P){
	let ps = P
	if(typeof P === "String")	ps = [P]
	for(const ms of ps){
		const Sps = ms.split(' ')
		let n_ps = moves[Sps[0]]
		// console.log(n_ps)
		for(let i=1;i<Sps.length;i++){
			// console.log(moves[Sps[i]])
				n_ps = n_ps.apply_move(moves[Sps[i]])
		}
		moves[ms] = n_ps
	}
}

const D_Cross = [
	[
		"U","U'","U2",
		"R","R'","R2",
		"L","L'","L2",
		"y R2 y'","F2",
	],
	[
		"F","F'","F2"
		,"U' R' F","U' R' F R",
	],
]

const D_Corner = [
	[
		"y","y'","y2",
		"U","U'","U2",
		"R U R'",
	],
	[
		"R U R'",
		"U R U' R'",
		"R U' R'",
		"R U2 R' U' R U R'",
	],
]

const F_Edge = [
	[
		"y","y'","y2",
		"U","U'","U2",
		"R U' R' F R' F' R",
	],
	[
		"R' F' R U R U' R' F",
		"R U' R' F R' F' R",
		"U' R' F' R U R U' R' F",
		"U R U' R' F R' F' R",
	],
]

const OLL_Cross = [
	[
		"U",
		"U'",
		"U2",
		"F R U R' U' F'",
		// "F R' F' R U R U' R'",
	],
]

const OLL_Edge = [
	[
		"U",
		"U'",
		"U2",
		"R U R' U R U2 R'",
		// "F R' F' R U R U' R'",
	],
]

const PLL_Cross = [
	[
		"U",
		"U'",
		"U2",
		"R U' R U R U R U' R' U' R2",
		// "F R' F' R U R U' R'",
	],
]

const PLL_Edge = [
	[
		"y",
		"y'",
		"y2",
		"x' U2 R2 U' L' U R2 U' L U' x",
		// "F R' F' R U R U' R'",
	],
]

palms([D_Cross,D_Corner,F_Edge,OLL_Cross,OLL_Edge,PLL_Cross,PLL_Edge].flat(Infinity))

// console.log(move_names)

const set_color_data = [
	{r:0,g:0.05,b:0.95},
	{r:0.89,g:0,b:0},
	{r:0,g:0.75,b:0},
	{r:1,g:0.25,b:0},
	{r:0.9,g:0.9,b:0.9},
	{r:0.9,g:0.95,b:0},
]

// const gray_color_data = [
// 	{r:0,g:0,b:0.4},
// 	{r:0.5,g:0,b:0},
// 	{r:0,g:0.4,b:0},
// 	{r:0.5,g:0.2,b:0},
// 	{r:0.5,g:0.5,b:0.5},
// 	{r:0.5,g:0.5,b:0},
// ]


let color_data = [0,1,2,3,4,5]
// 						青     赤     緑     オ    白     黄      

let color_modes = {
	"x":[4,1,5,3,2,0],
	"y":[3,0,1,2,4,5],
	"z":[0,4,2,5,3,1],
	"r":[4,1,5,3,2,0],
	"l":[5,1,4,3,0,2],
}

const faces2 = Object.keys(color_modes)
// console.log(faces2)
for(let i=0;i<faces2.length;i++){
	let m = [...color_modes[faces2[i]]]
	for(let s=0;s<6;s++)		m[s] = color_modes[faces2[i]][m[s]]
	color_modes[`${faces2[i]}2`] = [...m]
	for(let s=0;s<6;s++)		m[s] = color_modes[faces2[i]][m[s]]
	color_modes[`${faces2[i]}'`] = m
}
// console.log(color_modes)

color_c = [
	[4,3,0],
	[4,0,1],
	[4,1,2],
	[4,2,3],
	[5,0,3],
	[5,1,0],
	[5,2,1],
	[5,3,2],
]

color_e = [
	[0,3],
	[0,1],
	[2,1],
	[2,3],
	[4,0],
	[4,1],
	[4,2],
	[4,3],
	[5,0],
	[5,1],
	[5,2],
	[5,3],
]

color_cn = [
	[0],
	[1],
	[2],
	[3],
	[4],
	[5],
]
const vec	= 'yxxzyzxyzxxyyzz'
// // スタンダード
// let solved_state = new State(	
// 	[0, 1, 2, 3, 4, 5, 6, 7],
// 	[0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5],
// )

// let solved_state = new State(
//   [6,1,0,7,5,2,3,4],
//   [0,1,2,0,2,1,1,2],
//   [1,6,10,3,9,4,5,2,11,7,8,0],
//   [0,1,0,1,0,1,1,1,0,1,0,0],
//   [0,1,2,3,4,5],
// )

// step 12. 14 No
let scrambled_state = new State(
  [4,5,0,7,3,1,6,2],
  [2,1,0,0,1,0,0,2],
  [11,6,7,1,5,2,3,0,8,9,10,4],
  [0,0,0,1,0,1,1,0,0,0,0,1],
  [0,1,2,3,4,5],
)

function rotate(roates ,time = 1000,dist_time = 50){

	const roat_list = roates.split(" ")
	let time_tank = 0
	for(let i=0;i<roat_list.length;i++){
		setTimeout(() => {
			if(roat_list[i][0] <= "Z"){
				// console.log(`A~~Z [${roat_list[i]}]`)
				scrambled_state = scamble2state(scrambled_state,roat_list[i])
			}
			else if( roat_list[i][0] < "x"){
				// console.log(`a~~w [${roat_list[i]}]`)

				const index = faces.indexOf(roat_list[i][0])
				const V = vec[index]
				const rad = roat_list[i][1]
				let size = 1
				if(rad == '\'')	size = -1
				else if(rad == '2')	size = 0
				const cr = ["'", "2", ""]
				const nr = inv_face[roat_list[i][0].toUpperCase()]
				const index_vec = faces.indexOf(V)
				const dist = faces_rad[index]==faces_rad[index_vec]?1:-1

				// console.log(`roat_list[i]>[${roat_list[i]}] faces_rad>[${faces_rad[index]}] index_vec>${faces_rad[index_vec]}\nans>[${faces_rad[index]!=faces_rad[index_vec]?"false":"true"}]`+
				// 						`nr+cr[size+1]>[${nr+cr[size+1]}] V+cr[(size)+1]>${V+cr[(dist*size)+1]} color>[${V+cr[size+1]}]`)


				// scrambled_state = scamble2state(scrambled_state,roat_list[i])
				// scrambled_state = scrambled_state.hand_move(moves[roat_list[i]])
				// color_data = color_re_set(V+cr[size+1])


				scrambled_state = scamble2state(scrambled_state,nr+cr[size+1])
				scrambled_state = scrambled_state.hand_move(moves[V+cr[(dist*size)+1]])
				color_data = color_re_set(V+cr[(dist*size)+1])
			}
			else {
				// console.log(`xyz [${roat_list[i]}]`)
				scrambled_state = scrambled_state.hand_move(moves[roat_list[i]])
				color_data = color_re_set(roat_list[i])
			}
			// console.log(roat_list[i])
			one_rotate(scrambled_state, roat_list[i])
			one_rotate_anim(move_reverse[roat_list[i]],time)
		}, time_tank)
		time_tank += time + dist_time
	}
}

function one_rotate(sc_st,roate){
	// console.log("one_rotate")
	// scrambled_state.data_print()

	const index = faces.indexOf(roate[0])

	const center = model_centers
	const edge = model_edges
	const corner = model_corners

	// const center = full_cube.slice(0, 6)
	// const edge = full_cube.slice(6, 18)
	// const corner = full_cube.slice(18)


	for(let i of moves_face_c[index]){
		let F = corner[i].children
		for(let s=0;s<3;s++)
	  	F[s+1].material.color = set_color_data[color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
	}

	for(let i of moves_face_e[index]){
		let F = edge[i].children
		for(let s=0;s<2;s++)
	  	F[s+1].material.color = set_color_data[color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
	}

	for(let i of moves_face_cn[index]){
		let F = center[i].children
	  F[1].material.color = set_color_data[color_data[color_cn[sc_st.c[i]][0]]]
	}
	// full_cube.removeAttribute('my-animation')
	return sc_st
}

function color_set(sc_st){
	// console.log(`----- color_set ----`)

	const center = model_centers
	const edge = model_edges
	const corner = model_corners

	// console.log(sc_st)

	for(let i=0;i<corner.length;i++){
		let F = corner[i].children
		for(let s=0;s<3;s++)
	  	F[s+1].material.color = set_color_data[color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
	}

	for(let i=0;i<edge.length;i++){
		let F = edge[i].children
		for(let s=0;s<2;s++)
	  	F[s+1].material.color = set_color_data[color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
	}

	for(let i=0;i<center.length;i++){
		let F = center[i].children
	  F[1].material.color = set_color_data[color_data[color_cn[sc_st.c[i]][0]]]
	}
}

function one_rotate_anim(roate,time = 2000){
	full_cube.removeAttribute('my-animation')
	full_cube.setAttribute('my-animation', {
		clip: roate,
		timeScale: 1000/time,
		start: 1,
		end: 0,
		// loop: 'once',
		// timeScale: 1000/time,
		// clampWhenFinished: true,
	})
}

function Compensation_anim(Rota,Time = 2000, Rad){
	const roate = move_reverse[Rota]
	const rad = Math.max(Math.PI/2 - Rad, 0.001)
	const time = Time / 1000
	const StartAt = Rad
	const data = {
		clip: roate,
		timeScale: time,
		start: StartAt,

		// repetitions: "1",
		// timeScale: -1000/time,
		// startAt: StartAt,
		// clampWhenFinished: true,
	}
	full_cube.removeAttribute('my-animation')
	full_cube.setAttribute('my-animation', data)
}

// function Compensation_anim(Rota,Time = 2000, Rad){
// 	roate = move_reverse[Rota]
// 	rad = Math.max(Math.PI/2 - Rad, 0.001)
// 	time = Time  * (Math.PI/2) / rad
// 	StartAt = time - Time
// 	data = {
// 		clip: roate,
// 		timeScale: time/1000,
// 		start: StartAt,

// 		// repetitions: "1",
// 		// timeScale: -1000/time,
// 		// startAt: StartAt,
// 		// clampWhenFinished: true,
// 	}
// 	full_cube.removeAttribute('my-animation')
// 	full_cube.setAttribute('my-animation', data)
// }

let search = new Search()

const solv_step = [
	[
		{
			"type": "pos",
			"c":[],
			"e":[],
			"cp":[],
			"ep":[
				[6,10],
			],
		},
		{
			"type": "pos&exp",
			"c":[],
			"e":[10]
		},
	],
	[
		{
			"type": "pos",
			"c":[],
			"e":[11],
			"cp":[],
			"ep":[
				[6,10],
			],
		},
		{
			"type": "pos&exp",
			"c":[],
			"e":[10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[],
			"e":[8,11],
			"cp":[],
			"ep":[
				[6,10],
			],
		},
		{
			"type": "pos&exp",
			"c":[],
			"e":[8,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[],
			"e":[8,9,11],
			"cp":[],
			"ep":[
				[6,10],
			],
		},
		{
			"type": "pos&exp",
			"c":[],
			"e":[8,9,10,11]
		},
	],


	[
		{
			"type": "pos",
			"c":[],
			"e":[8,9,10,11],
			"cp":[
				[2,6],
			],
			"ep":[],
		},
		{
			"type": "pos&exp",
			"c":[6],
			"e":[8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[7],
			"e":[8,9,10,11],
			"cp":[
				[2,6],
			],
			"ep":[],
		},
		{
			"type": "pos&exp",
			"c":[6,7],
			"e":[8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[4,7],
			"e":[8,9,10,11],
			"cp":[
				[2,6],
			],
			"ep":[],
		},
		{
			"type": "pos&exp",
			"c":[4,6,7],
			"e":[8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[4,5,7],
			"e":[8,9,10,11],
			"cp":[
				[2,6],
			],
			"ep":[],
		},
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[8,9,10,11]
		},
	],


	[
		{
			"type": "pos",
			"c":[4,5,6,7],
			"e":[8,9,10,11],
			"cp":[],
			"ep":[
				[6,2],
			],
		},
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[2,8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[4,5,6,7],
			"e":[3,8,9,10,11],
			"cp":[],
			"ep":[
				[6,2],
			],
		},
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[2,3,8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[4,5,6,7],
			"e":[0,3,8,9,10,11],
			"cp":[],
			"ep":[
				[6,2],
			],
		},
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[0,2,3,8,9,10,11]
		},
	],
	[
		{
			"type": "pos",
			"c":[4,5,6,7],
			"e":[0,1,3,8,9,10,11],
			"cp":[],
			"ep":[
				[6,2],
			],
		},
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[0,1,2,3,8,9,10,11]
		},
	],


	[
		{
			"type": "exp",
			"c":[4,5,6,7],
			"e":[0,1,2,3,8,9,10,11],
			"co":[],
			"eo":[4,5,6,7]
		},
	],
	[
		{
			"type": "exp",
			"c":[4,5,6,7],
			"e":[0,1,2,3,8,9,10,11],
			"co":[0,1,2,3],
			"eo":[4,5,6,7]
		},
	],
	[
		{
			"type": "pos&exp",
			"c":[4,5,6,7],
			"e":[0,1,2,3,4,5,6,7,8,9,10,11],
		},
	],
	[
		{
			"type": "pos&exp",
			"c":[0,1,2,3,4,5,6,7],
			"e":[0,1,2,3,4,5,6,7,8,9,10,11],
		},
	]
]

let solbe_save = undefined
let color_data_save = undefined

function BBB(){
	solbe_save = new State(
		scrambled_state.cp,
		scrambled_state.co,
		scrambled_state.ep,
		scrambled_state.eo,
		scrambled_state.c,
	)
	color_data_save = color_data
	SST = scrambled_state
	let sum_solution = []
	tank = []

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(SST,solv_step[i][1], 1, D_Cross[1]) != undefined){
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=search.current_solution
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(SST,solv_step[i][0], 3, D_Cross[0])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(SST,solv_step[i][1], 1, D_Cross[1])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		SST = SST.hand_move(moves["y"])
	}

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(SST,solv_step[i+4][1], 1, D_Corner[1]) != undefined){
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=search.current_solution
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(SST,solv_step[i+4][0], 4, D_Corner[0])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(SST,solv_step[i+4][1], 1, D_Corner[1])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		SST = SST.hand_move(moves["y"])
	}

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(SST,solv_step[i+8][1], 1, F_Edge[1]) != undefined){
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(SST,solv_step[i+8][0], 4, F_Edge[0])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(SST,solv_step[i+8][1], 1, F_Edge[1])
			SST = scamble2state(SST,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		SST = SST.hand_move(moves["y"])
	}

	t=[]
	search.current_solution = []
	search.start_search(SST,solv_step[12][0], 10, OLL_Cross[0])
	SST = scamble2state(SST,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(SST,solv_step[13][0], 10, OLL_Edge[0])
	SST = scamble2state(SST,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(SST,solv_step[14][0], 10, PLL_Cross[0])
	SST = scamble2state(SST,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(SST,solv_step[15][0], 10, PLL_Edge[0])
	SST = scamble2state(SST,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	// console.log(tank)
	console.log(sum_solution)
	console.log(timeList)

	timeList = new motionList(    
		full_cube,model_centers,model_corners,
		model_edges,bone_centers,bone_corners,bone_edges,
		L_hand ,R_hand,bone_L_hand,bone_R_hand,
		bone_name_model,frameObj
	)
	timeList.ins(scrambled_state, JSON.parse(JSON.stringify(sum_solution)), JSON.parse(JSON.stringify(color_data)))

	setTimeout(() => {
		const scene = document.getElementById('scene').components["cube-mode"]
		scene.Ins_Complete(tank)
	},50)
}

let solve_preview = true
let rote_speed = 2

let full_cube = undefined

let model_centers	=new Array(6)
let model_corners	=new Array(8)
let model_edges		=new Array(12)

let bone_centers	=new Array(6)
let bone_corners	=new Array(8)
let bone_edges		=new Array(12)


let L_hand = undefined
let R_hand = undefined

let bone_L_hand	= {}
let bone_R_hand	= {}

let bone_name_model={}

let frameObj

function raycast_rotate(rote, rad) {
		// if(rad>Math.PI-0.00001)	return
		time = Math.min(Math.floor(rad/(Math.PI/2)*23),23)
		rote_name = [
			"B",			"B'",			"big",			"D",			"D'",
			"F",			"F'",			"Idole",			"L",			"L'",
			"R",			"R'",			"spring",			"U",			"U'",
			"x",			"x'",			"y",			"y'",			"z",			"z'"
	]
		animations = cube.object3D.children[0].animations[rote_name.indexOf(rote)]
		for(ani of animations.tracks){
				if(ani.times.length <= 2) continue
				names = ani.name.split(".")
				bone = names[0]
				// type = names[1]
				bone_name_model[bone].quaternion.set(
						ani.values[time*4],
						ani.values[time*4+1],
						ani.values[time*4+2],
						ani.values[time*4+3]
				)
		}
}

function psd() {
	let t="let solved_state = new State(\n"
	t+="  ["+scrambled_state.cp.join(',')+"],\n"
	t+="  ["+scrambled_state.co.join(',')+"],\n"
	t+="  ["+scrambled_state.ep.join(',')+"],\n"
	t+="  ["+scrambled_state.eo.join(',')+"],\n"
	t+="  ["+scrambled_state.c.join(',')+"],\n"
	t+=")\n"
	console.log(t)
}

function getRuleBySelector(sele){
	var i, j, sheets, rules, rule = null;

	// stylesheetのリストを取得
	sheets = document.styleSheets;
	for(i=0; i<sheets.length; i++){
			// そのstylesheetが持つCSSルールのリストを取得
			rules = sheets[i].cssRules;
			for(j=0; j<rules.length; j++){
					// セレクタが一致するか調べる
					if(sele === rules[j].selectorText){
							rule = rules[j];
							break;
					}
			}
	}
	return rule;
}

const step = [
	[
		// [
			// "U","U'","U2",
			// "R","R'","R2",
			// "L","L'","L2",
			// "y R2 y'","F2",
		// ],
		[
			// "F","F'","F2",
			"U' R' F","U' R' F R",
		],
	],
	[
		// [
			// "y","y'","y2",
			// "U","U'","U2",
			// "R U R'",
		// ],
		[
			"R U R'",
			"U R U' R'",
			"R U' R'",
			"R U2 R' U' R U R'",
		],
	],
	[
		// [
			// "y","y'","y2",
			// "U","U'","U2",
			// "R U' R' F R' F' R",
		// ],
		[
			"R' F' R U R U' R' F",
			"R U' R' F R' F' R",
			"U' R' F' R U R U' R' F",
			"U R U' R' F R' F' R",
		],
	],
	[
		[
			// "U",
			// "U'",
			// "U2",
			"F R U R' U' F'",
			// "F R' F' R U R U' R'",
		],
	],
	[
		[
			// "U",
			// "U'",
			// "U2",
			"R U R' U R U2 R'",
			// "F R' F' R U R U' R'",
		],
	],
	[
		[
			// "U",
			// "U'",
			// "U2",
			"R U' R U R U R U' R' U' R2",
			// "F R' F' R U R U' R'",
		],
	],
	[
		[
			"x' U2 R2 U' L' U R2 U' L U' x",
			// "F R' F' R U R U' R'",
		],
	]
]