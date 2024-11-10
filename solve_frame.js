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

let move_names = []

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

const vec	= 'yxxzyzxyzxxyyzz'
// // スタンダード
// let solved_state = new State(	
// 	[0, 1, 2, 3, 4, 5, 6, 7],
// 	[0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 1, 2, 3, 4, 5],
// )

let solved_state = new State(
  [6,1,0,7,5,2,3,4],
  [0,1,2,0,2,1,1,2],
  [1,6,10,3,9,4,5,2,11,7,8,0],
  [0,1,0,1,0,1,1,1,0,1,0,0],
  [0,1,2,3,4,5],
)
let scrambled_state = solved_state
// // step 12. 14 No
// let solved_state = new State(
//   [2,0,1,3,4,5,6,7],
//   [2,1,2,1,0,0,0,0],
//   [0,1,7,3,6,4,2,5,8,9,10,11],
//   [0,0,0,0,1,0,1,0,0,0,0,0],
//   [0,1,2,3,4,5],
// )


let rote_speed = 2



const color_c = [
	[4,3,0],
	[4,0,1],
	[4,1,2],
	[4,2,3],
	[5,0,3],
	[5,1,0],
	[5,2,1],
	[5,3,2],
]

const color_e = [
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

const color_cn = [
	[0],
	[1],
	[2],
	[3],
	[4],
	[5],
]