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

inv_face = {
    "U": "D",
    "D": "U",
    "L": "R",
    "R": "L",
    "F": "B",
    "B": "F"
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

console.log(move_names)

const set_color_data = [
	{r:0,g:0.05,b:0.95},
	{r:0.89,g:0,b:0},
	{r:0,g:0.75,b:0},
	{r:1,g:0.25,b:0},
	{r:0.9,g:0.9,b:0.9},
	{r:0.9,g:0.95,b:0},
]

const gray_color_data = [
	{r:0,g:0,b:0.4},
	{r:0.5,g:0,b:0},
	{r:0,g:0.4,b:0},
	{r:0.5,g:0.2,b:0},
	{r:0.5,g:0.5,b:0.5},
	{r:0.5,g:0.5,b:0},
]


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

// let solved_state = new State(
//   [2,1,7,3,4,5,0,6],
//   [1,1,1,1,0,0,2,0],
//   [7,5,2,1,3,0,6,4,8,9,10,11],
//   [1,1,0,0,0,1,1,0,0,0,0,0],
//   [0,1,2,3,4,5],
// )
// let solved_state = new State(	
// 	[0, 1, 2, 3, 4, 5, 6, 7],
// 	[0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5],
// )
let solved_state = new State(
	[1,7,0,3,5,4,2,6],
	[0,0,0,2,0,0,2,2],
	[2,4,1,6,7,5,3,0,8,9,10,11],
	[1,0,1,0,0,1,0,1,0,0,0,0],
	[0,1,2,3,4,5],
)

function rotate(roates ,time = 1000,dist_time = 50){

	const roat_list = roates.split(" ")
	let time_tank = 0
	for(let i=0;i<roat_list.length;i++){
		setTimeout(() => {
			one_rotate_anim(roat_list[i],time)
		}, time_tank)

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
			one_rotate(scrambled_state, roat_list[i])
		}, time_tank + time)
		time_tank += time + dist_time
	}
}

function one_rotate(sc_st,roate){
	// console.log("one_rotate")
	// scrambled_state.data_print()

	const index = faces.indexOf(roate[0])

	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	// console.log(moves_face_c[index])
	for(let i of moves_face_c[index]){
		corner[i].setAttribute('rotation', {x:0,y:0,z:0})
		corner[i].removeAttribute('animation')
		let F = corner[i].children[0].object3D.children[0].children[0].children
		for(let s=0;s<3;s++)
	  	F[s].material.color = set_color_data[color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
		edge[i].removeAttribute('animation')
		let F = edge[i].children[0].object3D.children[0].children[0].children
		for(let s=0;s<2;s++)
	  	F[s].material.color = set_color_data[color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('rotation', {x:0,y:0,z:0})
		center[i].removeAttribute('animation')
		let F = center[i].children[0].object3D.children[0].children[0].children
	  F[0].material.color = set_color_data[color_data[color_cn[sc_st.c[i]][0]]]
	}
	return sc_st
}

function color_set(sc_st){
	// console.log(`----- color_set ----`)
	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	for(let i=0;i<corner.length;i++){
		let F = corner[i].children[0].object3D.children[0].children[0].children
		for(let s=0;s<3;s++)
	  	F[s].material.color = set_color_data[color_data[color_c[sc_st.cp[i]][(s + 3 - sc_st.co[i]) % 3]]]
	}

	for(let i=0;i<edge.length;i++){
		let F = edge[i].children[0].object3D.children[0].children[0].children
		for(let s=0;s<2;s++)
	  	F[s].material.color = set_color_data[color_data[color_e[sc_st.ep[i]][(s + 2 - sc_st.eo[i]) % 2]]]
	}

	for(let i=0;i<center.length;i++){
		let F = center[i].children[0].object3D.children[0].children[0].children
	  F[0].material.color = set_color_data[color_data[color_cn[sc_st.c[i]][0]]]
	}
}

function one_rotate_anim(roate,time = 2000){
	const index = faces.indexOf(roate[0])
	const rad = roate[1]
	// console.log("roate "+roate+" len "+rotate.length+" index "+index+" rad "+rad)

	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

						// URLFDB
	let size = 1
	if(rad == '\'')	size = -1
	else if(rad == '2')	size = 2

	// console.log(`one_rotate_anim index:${index} size:${size}`)
	// console.log(`one_rotate_anim moves_face_c[index] [${moves_face_c[index]}]`)
	// console.log(`vec.charAt(index) [${vec.charAt(index)}] faces_rad[index] [${faces_rad[index]}]`)

	for(let i of moves_face_c[index]){
		corner[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}
}

function Compensation_anim(roate,time = 5000, From, To){
	const index = faces.indexOf(roate[0])
	const rad = roate[1]
	// console.log("roate "+roate+" len "+rotate.length+" index "+index+" rad "+rad)

	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

						// URLFDB
	let size = 1
	if(rad == '\'')	size = -1
	else if(rad == '2')	size = 2

	// console.log(`one_rotate_anim index:${index} size:${size}`)
	// console.log(`one_rotate_anim moves_face_c[index] [${moves_face_c[index]}]`)
	// console.log(`vec.charAt(index) [${vec.charAt(index)}] faces_rad[index] [${faces_rad[index]}]`)

	for(let i of moves_face_c[index]){
		corner[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: From,
			to: To,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: From,
			to: To,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: From,
			to: To,
			// easing: 'easeOutSine',
			easing: 'linear',
		})
	}
}


let scrambled_state = solved_state

let search = new Search()
let sum_solution = []
let sum_solution2 = []

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

function BBB(){
	solved_state = scrambled_state
	sum_solution = []
	tank = []

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(solved_state,solv_step[i][1], 1, D_Cross[1]) != undefined){
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=search.current_solution
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(solved_state,solv_step[i][0], 3, D_Cross[0])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(solved_state,solv_step[i][1], 1, D_Cross[1])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		solved_state = solved_state.hand_move(moves["y"])
	}

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(solved_state,solv_step[i+4][1], 1, D_Corner[1]) != undefined){
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=search.current_solution
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(solved_state,solv_step[i+4][0], 4, D_Corner[0])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(solved_state,solv_step[i+4][1], 1, D_Corner[1])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		solved_state = solved_state.hand_move(moves["y"])
	}

	for(let i=0;i<4;i++){
		t=[]
		search.current_solution = []
		if(search.start_search(solved_state,solv_step[i+8][1], 1, F_Edge[1]) != undefined){
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}
		else{
			t=[]
			search.current_solution = []
			search.start_search(solved_state,solv_step[i+8][0], 4, F_Edge[0])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=search.current_solution

			search.current_solution = []
			search.start_search(solved_state,solv_step[i+8][1], 1, F_Edge[1])
			solved_state = scamble2state(solved_state,search.current_solution.join(' '))
			t=t.concat(search.current_solution)
		}

		t=t.concat(["y"])

		tank.push(t)

		sum_solution.push(t.join(' ').split(' '))
		solved_state = solved_state.hand_move(moves["y"])
	}

	t=[]
	search.current_solution = []
	search.start_search(solved_state,solv_step[12][0], 10, OLL_Cross[0])
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(solved_state,solv_step[13][0], 10, OLL_Edge[0])
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(solved_state,solv_step[14][0], 10, PLL_Cross[0])
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))

	t=[]
	search.current_solution = []
	search.start_search(solved_state,solv_step[15][0], 10, PLL_Edge[0])
	solved_state = scamble2state(solved_state,search.current_solution.join(' '))
	t=t.concat(search.current_solution)
	tank.push(t)
	sum_solution.push(t.join(' ').split(' '))
	sum_solution2=sum_solution
	
	console.log(tank)
	// console.log(sum_solution)
	setTimeout(() => {
		const scene = document.getElementById('scene').components["cube-mode"]
		scene.Ins_Complete(tank)
	},50)
}


const Pre_movement = [
	"B'.1",
	"B'.1.b",
	"B'.1.f",
	"B.1",
	"B.1.f",
	"Change.1",
	"Change.2",
	"D'.1",
	"D'.1.b",
	"D'.1.f",
	"D.1",
	"D.1.f",
	"F'.1",
	"F'.1.f",
	"F'.2",
	"F'.2.b",
	"F'.2.f",
	"F.1",
	"F.1.b",
	"F.1.f",
	"Idole",
	"L.1",
	"L'.1",
	"U'.1",
	"U'.1.f",
	"U.1",
	"U.1.b",
	"U.1.f",
	"U.2",
	"U.2.b",
	"U.2.f",
	"y'.1",
	"y'.1.b",
	"y.1",
	"y.1.b",
]

const Pre_movement2 = {
	"B.1":	["",".f"],
	"D.1":	["",".f"],
	"F'.1":	["",".f"],
	"F'.2":	[".b","",".f"],
	"L.1":	[""],
	"L'.1":	[""],
	"U'.1":	["",".f"],
	"y.1":	[".b",""],
	"y'.1":	[""],
}

const Lhands = {
	"U'"  :"U'.1" ,
	"D"   :"D.1"  ,
	"L"   :"L.1"  ,
	"L'"  :"L'.1" ,
	"B"   :"B.1"  ,
	"F'"  :"F'.2" ,
	"y"		:"y.1"	,
	"y'"	:"y'.1"	,
	"x'"	:"y'.1"	,
	"x"		:"y'.1"	,
	"l"		:"L.1"	,
	"l'"  :"L'.1"	,
}
const Lhandv = {
	"U'"  :0 ,
	"D"   :0 ,
	"L"   :0 ,
	"L'"  :1 ,
	"B"   :1 ,
	"F'"  :0 ,
	"y"		:0 ,
	"y'"	:0 ,
	"x'"	:0 ,
	"x"		:0 ,
	"l"		:0 ,
	"l'"	:1 ,
}

const Rhands = {
	"U"   :"U'.1"	,
	"D'"  :"D.1" 	,
	"R"   :"L'.1"	,
	"R'"  :"L.1"	,
	"B'"  :"B.1"	,
	"F"   :"F'.1"	,
	"y" 	:"y'.1"	,
	"y'"	:"y.1"	,
	"x'"	:"L.1"	,
	"x"		:"L'.1"	,
	"r"		:"L'.1"	,
	"r'"  :"L.1"	,
}
const Rhandv = {
	"U"   :0 ,
	"D'"  :0 ,
	"R"   :1 ,
	"R'"  :0 ,
	"B'"  :1 ,
	"F"   :1 ,
	"y"	  :0 ,
	"y'"	:0 ,
	"x"		:1 ,
	"x'"	:0 ,
	"r"		:1 ,
	"r'"  :0 ,
}

const Change = [
	{name:"Change.1", int:-1},
	{name:"Change.2", int: 1},
]

let h_v = [0,0]
let movementCount = -1
let move180 = false

let solve_preview = true

function motions(){	
	if(sum_solution2.length > 0 && sum_solution2[0].length == 0) sum_solution2.shift()
	
	if(move180){
		movementCount -= 1
		move180 = false
	}

	if(sum_solution2[0][0][1] == '2'){
		const S2 = sum_solution2[0].shift()
		sum_solution2[0].unshift(S2[0], S2[0])
		move180 = true
	}

	let time_tank = 0
	time_tank += one_motion(sum_solution2[0][0], 4, 16 - sum_solution2.length)
	time_tank += 10
	sum_solution2[0].shift()


	movementCount+=1
	if(solve_preview){
		const solveDiv = document.getElementsByClassName("img-div")
		solveDiv[movementCount].classList.add('now-move')
	}

	const scene = document.getElementById('scene').components["cube-mode"]
	if(sum_solution2[0].length > 0){
		setTimeout(() => {
			scene.data.Execution_move =true
		},time_tank)
	}
	else {
		setTimeout(() => {
			typeName = frame_pos.includes("corner")?"corner":"edge"
			type = frame_pos.includes("corner")?"frame_corner":"frame_edge"
			const frame=document.getElementById(`frame_${typeName}`)
			const Pframe=document.getElementById(`frame`)
			
			// console.log(`frame_pos ${frame_pos} [${Pframe.classList.value.includes(typeName)}]`)
			if(Pframe.classList.value.includes(typeName)){
				// console.log(`--------Change--------    ${typeName}`)

				frame.setAttribute("visible",false)
				// document.getElementById(type).setAttribute("visible",false)
				Pframe.classList.remove(typeName)
				// Pframe.classList.add(typeName)
			}
			
			pointM(frame_pos, false)
			Angle_move(undefined, -1,500)
		},time_tank)

		setTimeout(() => {
			scene.data.step_move = false
		},time_tank+500)
	}
	if(sum_solution2.length == 1 && sum_solution2[0].length == 0){
		movementCount = -1
		move180 = false
		
		scene.Complete()
	}
	
}

function one_motion(sulb,speed,step){
	// const speed=1000.0/S
	const Lhand = document.getElementById("L-hand")
	const Rhand = document.getElementById("R-hand")

	let Rtime = one_hand_move(sulb, speed, Rhand, Rhandv, 1, Rhands[sulb])
	let Ltime = one_hand_move(sulb, speed, Lhand, Lhandv, 0, Lhands[sulb])

	let sum_time = Math.max(Rtime.time,Ltime.time)
	let som_sovle_time = Math.max(Rtime.sovle_time,Ltime.sovle_time)
	// console.log(`R time [${Rtime.time}]  sovle_time [${Rtime.sovle_time}]\n`+
	// 						`L time [${Ltime.time}]  sovle_time [${Ltime.sovle_time}]\n`+
	// 						`sum time [${sum_time}]  sovle_time [${som_sovle_time}]`)

	// console.log(Rtime.move_schedule)
	// console.log(Ltime.move_schedule)

	if(Rtime.sovle_time != -1 && Ltime.sovle_time != -1 && Rtime.sovle_time != Ltime.sovle_time){
		const dis = Rtime.sovle_time - Ltime.sovle_time
		if(dis > 0){
			for(let A of Ltime.move_schedule)	A.time += dis
		}
		else{
			for(let A of Rtime.move_schedule)	A.time -= dis
		}
	}


	if(Rtime.move_schedule != undefined){
		// console.log(`Rtime.move_schedule`)
		for(let s of Rtime.move_schedule){
			setTimeout(() => {
				Rhand.removeAttribute('animation-mixer')
				Rhand.setAttribute('animation-mixer', {
					clip: s.clip,
					loop: 'once',
					timeScale: s.timeScale,
					clampWhenFinished: true,
				})
			},s.time)
		}
	}

	if(Ltime.move_schedule != undefined){
		// console.log(`Ltime.move_schedule`)
		for(let s of Ltime.move_schedule){
			setTimeout(() => {
				Lhand.removeAttribute('animation-mixer')
				Lhand.setAttribute('animation-mixer', {
					clip: s.clip,
					loop: 'once',
					timeScale: s.timeScale,
					clampWhenFinished: true,
				})
			},s.time)
		}
	}
	
	setTimeout(() => {
		Angle_move(sulb, step, parseInt(1000/speed))
		frame_rotate(sulb, step, parseInt(1000/speed), true)
		rotate(sulb, parseInt(1000/speed))
	}, som_sovle_time)
	return sum_time
}

const hand_xyz = []
let frame_pos = ""

function frame_rotate(sulb = undefined, step, time, anime = false){
	let text = "\n\n"
	text+=`hand_xyz [${hand_xyz.length==0?"None":hand_xyz.join(',')}]\n`
	if(step>=12)	return 
	const rote = {
		ce: ["0 180 0","0 90 0","0 0 0","0 -90 0","-90 0 0","90 0 0"],
		e:  [
			"0 -90 90","0 90 -90","0 90 90","0 -90 -90","0 180 0","0 90 0",
			"0 0 0","0 -90 0","0 180 180","0 90 180","0 0 180","0 -90 180"
			],
		c: [
			"0 180 0","0 90 0","0 0 0","0 270 0",
			"0 270 180","0 180 180","0 90 180","0 0 180"
			],
	}

	parts__Angle = [
		10,10,10,10,  6,6,6,6,  2,2,2,2,
	]

	const type = (4 <= step && step < 8)?"c":"e"
	const typeName = type=="c"?"corner":"edge"
	const ss = scrambled_state
	let new_ang = parts__Angle[step]

	text+=`ang ${new_ang} `
	for(han of hand_xyz){		new_ang = moves[han][`${type}p`].indexOf(new_ang);		text+=`-> ${new_ang} `;	}
	text+='\n'
	
	if(sulb != undefined && sulb[0]>"a"){
		if(hand_xyz.length > 0 && hand_xyz.at(-1)[0] == sulb[0] && hand_xyz.at(-1) != sulb )			hand_xyz.pop()
		else			hand_xyz.push(sulb)
	}

	const pos = ss[`${type}p`].indexOf(new_ang)

	const frame=document.getElementById(`frame_${typeName}`)
	const Pframe=document.getElementById(`frame`)
	
	if(!Pframe.classList.value.includes(typeName)){
		// console.log(`--------Change--------    ${typeName}`)

		frame.setAttribute("visible",true)
		document.getElementById(type!="c"?"frame_corner":"frame_edge").setAttribute("visible",false)
		Pframe.classList.remove(type!="c"?"corner":"edge")
		Pframe.classList.add(typeName)
	}

	frame.children[0].setAttribute("rotation",rote[type][pos])
	frame.removeAttribute('animation')
	frame.setAttribute('rotation', {x:0,y:0,z:0})

	if(sulb == undefined){
		pointM(`${typeName}${pos}`)
		text += `--------- undefined NO ${typeName}${pos} ---------\n\n`
		// console.log(text)
		return
	}


	const index = faces.indexOf(sulb[0])
	const mode_parts = type=="c"?moves_face_c:moves_face_e
	const mode = mode_parts[index].indexOf(pos)

	text += `sulb [${sulb}]  type [${type}]  mode [${mode!=-1?mode:"None"}]  pos [${pos}] rote [${rote[type][pos]}]\n`
	// text += `[${.join(',')}]\n`
	text += `index [${index}]\n`
	text += `mode_parts[index] [${mode_parts[index].join(',')}]\n`
	text += `indexOf [${mode_parts[index].indexOf(pos)}]\n`

	if(mode==-1){
		text += `--------- NO rotation ---------\n\n`
		// console.log(text)
		return
	}

	
	const rad = sulb[1]
	const size = (rad=='\'')?-1:((rad=='2')?2:1)
	text+=	`anime [${anime}]  rot [rotation.${vec.charAt(index)}]  to [${faces_rad[index] * 90 * size}]`

	next_pos = moves[sulb][`${type}p`].indexOf(pos)
	frame_pos = `${typeName}${next_pos}`

	// console.log(text+"\n\n")
	if(anime){
		frame.setAttribute('animation', {
			property: 'rotation.'+vec.charAt(index),
			dur: time,
			from: 0,
			to: faces_rad[index] * 90 * size,
			easing: 'linear',
		})
		
		setTimeout(() => {
			pointM(`${typeName}${pos}`,false)
			pointM(`${typeName}${next_pos}`,true)
		},time)
	}
}

function pointM(p,T = true){
	const P = document.getElementById(p).children[0].object3D.children[0].children[0].children
	// console.log(`pointM name [${p}] ${T}`)
	if(T){
		for(let i=0;i<P.length-1;i++){
			P[i].material.side=0
			P[i].material.depthTest=false
			P[i].renderOrder=3
		}
	}
	else{
		for(let i=0;i<P.length-1;i++){
			P[i].material.side=2
			P[i].material.depthTest=true
			P[i].renderOrder=0
		}
	}
}

const Angle_xyz = []
let Angle_pos = ""

function Angle_move(sulb = undefined, step, time){
	return
	let text = "\n\n"
	text+=`hand_xyz [${hand_xyz.length==0?"None":hand_xyz.join(',')}]\n`
	if(step>=12)	return 

	Rotation_Angle = {
		e: [
			[-30,-160],
			[-30,160],
			[-30,40],
			[-30,-40],
			
			[-30,160],
			[-30,40],
			[-30,40],
			[-30,-40],
			
			[30,160],
			[30,40],
			[30,40],
			[30,-40],
		],
		
		c: [
			[-30,-160],
			[-30,160],
			[-30,40],
			[-30,-40],
			
			[30,-160],
			[30,160],
			[30,40],
			[30,-40],  
		]
	}

	parts__Angle = [
		10,10,10,10,  6,6,6,6,  2,2,2,2,
	]


	const type = (4 <= step && step < 8)?"c":"e"
	let ss = scrambled_state
	
	let new_ang = parts__Angle[step]
	
	text+=`ang ${new_ang} `
	for(han of Angle_xyz){
		new_ang = moves[han][`${type}p`].indexOf(new_ang)
		text+=`-> ${new_ang} `
	}
	text+='\n'
	
	
	if(sulb != undefined && sulb[0]>"a"){
		if(Angle_xyz.length > 0 && Angle_xyz.at(-1)[0] == sulb[0] && Angle_xyz.at(-1) != sulb )			Angle_xyz.pop()
		else			Angle_xyz.push(sulb)
	}
	
	let pos = ss[`${type}p`].indexOf(new_ang)
	if(sulb != undefined) pos = moves[sulb][`${type}p`].indexOf(pos)

	let ro  = this.Rotation_Angle[type][pos]

	if(sulb !== undefined)	ss = scamble2state(ss,sulb)

	if(step == -1)	ro = this.Rotation_Angle.c[2]

	text += `sulb [${sulb}]  type [${type}]  pos [${pos}] rote [${ro}]\n`
	text += `parts__Angle [${parts__Angle[step]}] new_ang [${new_ang}]\n`

	const camera = document.getElementById('camera')
	let by = (camera.getAttribute("rotation").y+360)%360
	let ay = (ro[1]+360)%360
	
	text += `[${by}] [${ay}]`

	camera.setAttribute('animation', {
		property: 'rotation',
		dur: time,
		// from: 0,
		to: {x:ro[0], y:ro[1], z:0},
		easing: 'linear',
	})
	
	//console.log(text+"\n\n")
}

function one_hand_move(sulb, speed, hand, hdvec, influence, Su){
	let time = 0,sovle_time = 0
	let move_schedule = []
	if(Su === undefined){
		return {time: -1, sovle_time: -1}
	}

	let index = hdvec[sulb]-h_v[influence]
	let vec_count = h_v[influence]

	if(Su[0] === 'L')	vec_count+=1

	index = Change.find((u) => u.int === index)
	
	if(index !== undefined){
		move_schedule.push({
			clip: index.name,
			timeScale: speed,
			time : time
		})
		time += parseInt(1000/speed)
		vec_count += 1
	}
	h_v[influence] = vec_count % 2

	for(let i=0; i<Pre_movement2[Su].length; i++){
		move_schedule.push({
			clip: `${Su + Pre_movement2[Su][i]}`,
			timeScale: speed,
			time : time
		})
		if(Pre_movement2[Su][i] == ""){
			sovle_time = time
		}
		time+=parseInt(1000/speed)
	}
	return {time,sovle_time,move_schedule}
}

function raycast_rotate(roate,rad){
	const index = faces.indexOf(roate[0])
	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	for(let i of moves_face_c[index]){
		corner[i].object3D.rotation[vec[index]] = rad
	}

	for(let i of moves_face_e[index]){
		edge[i].object3D.rotation[vec[index]] = rad
	}

	for(let i of moves_face_cn[index]){
		center[i].object3D.rotation[vec[index]] = rad
	}
}

function remove_animation(roate){
	const index = faces.indexOf(roate[0])
	corner = document.getElementById("corner").children
	edge = document.getElementById("edge").children
	center = document.getElementById("center").children

	for(let i of moves_face_c[index]){
		corner[i].setAttribute('rotation', {x:0,y:0,z:0})
		corner[i].removeAttribute('animation')
	}

	for(let i of moves_face_e[index]){
		edge[i].setAttribute('rotation', {x:0,y:0,z:0})
		edge[i].removeAttribute('animation')
	}

	for(let i of moves_face_cn[index]){
		center[i].setAttribute('rotation', {x:0,y:0,z:0})
		center[i].removeAttribute('animation')
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
	//console.log(t)
}

function objcetText(obj) {
  this.length = Object.keys(obj).length;
  this.count = 0;
  this.outText = "{\n";
  this.format = function(obj,times){
    var i = 0;
    var _objlength = Object.keys(obj).length;
    for(key in obj){
      i++;
      //階層分のタブを追加
      var tabs = "";
      for(var j = 0; j < times+1; j++){
        tabs += "\t";
      }
      this.outText += tabs + key + ":";
      if(typeof obj[key] == "object"){
        this.outText += "{" + "\n";
        //下層のオブジェクト数を足す
        this.length += Object.keys(obj[key]).length;
        //再帰処理
        this.format(obj[key],times+1);
        if(i == _objlength){
          this.outText += tabs.replace(/(\t?).$/,'$1') + "}\n";
        }
        this.count++;
      }else{
        this.outText += obj[key];
        if(i != _objlength){
          this.outText += ",\n";
        }else{
          this.outText += "\n" + tabs.replace(/(\t?).$/,'$1') + "}\n";
        }
        this.count++;
      }
    }
    if(this.length == this.count){
      return this.outText
    }
  }
  return this.format(obj,0);
}

function cubeOpa(op1,op2=undefined,objfunc = objopacty) {
  const cn = document.getElementById('center').children
  for(let i=0;i<cn.length;i++)
    objfunc(cn[i].children[0], op1,op2)
      
  const c = document.getElementById('corner').children
  for(let i=0;i<c.length;i++)
    objfunc(c[i].children[0], op1,op2)
      
  const e = document.getElementById('edge').children
  for(let i=0;i<e.length;i++)
    objfunc(e[i].children[0], op1,op2)
}
function objopacty(ojb, op1 = 0.5, op2 = undefined) {
  const F = ojb.object3D.children[0].children[0].children
  for(let s=0;s<F.length;s++){
      F[s].material.opacity = op1
      F[s].material.transparent = true
  }
	if(op2 != undefined){
		F[F.length-1].material.opacity = op2
		F[F.length-1].material.transparent = true
	}
}

function objopacty2(ojb, op1 = 0.5, op2 = undefined) {
  const F = ojb.object3D.children[0].children[0].children
	if(op1 != 1){
		for(let s=0;s<F.length;s++){
				F[s].material.opacity = op1
				F[s].material.transparent = true
		}
	}
	if(op2 != undefined){
		F[F.length-1].visible = false
	}
}

function objopacty3(ojb, op1 = 0.5, op2 = undefined) {
  const F = ojb.object3D.children[0].children[0].children
	for(let s=0;s<F.length;s++){
		F[s].renderOrder  = 10
	}
	//console.log("function objopacty3")
}
// cubeOpa(0.8,0)