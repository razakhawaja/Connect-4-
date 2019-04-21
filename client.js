// 2010006
const socket = io()
const buttons = []

const buttonClickHandler = ev => {
	ev.preventDefault()
	socket.emit('buttonPress', ev.target.value, socket.id)
}

socket.on('updatedGrid', uGrid => {
	clientBoard = uGrid
	createGridwButtons() // update client side grid with server side grid
	setState("") // display everything
})

const bttns = new Array() // Clickable butons on the top.
const topButtons = () => {
	for (let i=1; i<=7;i++)
	{
		bttns[i] = React.createElement('input', {type: 'submit', value: i, style: {backgroundColor: "#979191"}, onClick: buttonClickHandler})
	}
}

const setState = (win) => {
	ReactDOM.render(
		React.createElement('div',{style: {backgroundColor: "Black", textAlign: "left", fontFamily: "Verdana"}},
			React.createElement('h1', {style: {color: "White", fontWeight: "bold"}}, "C0NNECT 4"),
			React.createElement('p', {style: {color: "Grey"}}, "Press the column number to drop your marker in it."),
			React.createElement('p', {style: {color: "Grey"}}, "First one to get 4 markers in a row wins"),
			React.createElement('p', {style: {color: "Grey"}}, x),
			React.createElement('div',null, bttns),
			React.createElement('div',null, myBoard),
			React.createElement('h1', {style: {color: "White"}}, win),
			),
		 document.getElementById('root')
		)
}

myBoard = new Array()
const createGridwButtons = () => {
	for(i=0;i<6;i++)
	{
		col = new Array()
		for(j=0;j<7;j++)
		{
			if (clientBoard[i][j] === 'X')
			{
				col[j] = React.createElement('input',{type: 'submit',value: clientBoard[i][j], style: {backgroundColor: "Black"}, disabled: true})
			}
			else if (clientBoard[i][j] === 'O')
			{
				col[j] = React.createElement('input',{type: 'submit',value: clientBoard[i][j], style: {backgroundColor: "#16149F"}, disabled: true})
			}
			else
			{
				col[j] = React.createElement('input',{type: 'submit',value: clientBoard[i][j], disabled: true})
			} 
		}
		myBoard[i] = React.createElement('div',null,col)
	}	
}

socket.on('Waiting', () => 
	{
		ReactDOM.render(React.createElement('p', null, "Waiting for other player..."), document.getElementById('root'))
	})

socket.on('left', () => 
{
	ReactDOM.render(React.createElement('p', null, "Other player left. :( "), document.getElementById('root'))
})

socket.on('Win', data => 
{
	console.log('Player won.')
	socket.emit('gameover')
	setState(data)

})

let x = ""
socket.on('p1', data => {
	x = React.createElement('p', null, data)
})

socket.on('p2', data => {
	x = React.createElement('p', null, data)

})

let clientBoard = new Array() // The backend board on the client side.
socket.on('StartGame', init_board => {
	topButtons()
	clientBoard = init_board
	createGridwButtons() // 2D Array of buttons
	setState("")
})
