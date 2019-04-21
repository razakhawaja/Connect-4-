// 20100006
const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')

const readFile = f => new Promise((resolve,reject) =>
	fs.readFile(f, (e, d) => e? reject(e):resolve(d)))

const server = http.createServer(async (req,resp) =>
	resp.end(await readFile(req.url.substr(1))))

numwaiting = 0
player1 = ""
player2 = ""
players = []
const io = socketio(server)

let currturn = 0
io.sockets.on('connection', socket=>
	{
			console.log(`${socket.id} connected`)
			players.push(socket.id)
						
			currturn = player1

			if(numwaiting==0)
			{
				player1 = socket.id
				io.to(player1).emit('p1', "You are player 1. Your symbol is X.")
				numwaiting = 1
				socket.emit('Waiting')
			}
			else
			{
				player2 = socket.id
				io.to(player2).emit('p2', "You are player 2. Your symbol is O.")
				io.sockets.emit('StartGame', myBoard)
				numwaiting = 0
			}

		    socket.on('disconnect', () => {
			console.log(`${socket.id} disconnected`)

			if(numwaiting)
				{numwaiting = 0}
			else
				{numwaiting = 1}
			
			io.sockets.emit('left')
			delete players[player1]
			delete players[player2]
			createServerSideGrid() // When players leave, make board null again.
			
			})

			socket.on('gameover', () => {
			delete players[player1]
			delete players[player2]
			
			})

			socket.on('buttonPress', (bPress, id) => {
				let i = 5;
				validmove=false
				while (i >= 0)
				{
					if (myBoard[i][bPress - 1] != '  ')
					{
						i--
					}
					else
					{
						validmove=true
						break
					}
				}

				checkwin = false
				if(validmove)
				{	
					if (id === player1 && id === currturn)
					{
						myBoard[i][bPress - 1] = 'X'
						if (isWin('X') == true)
						{
							checkwin = true
							console.log('WINNER PLAYER1')
							//io.sockets.emit('Win', "Player 1 won!")
							player1 = ""
							player2 = ""
						}
						io.sockets.emit('updatedGrid', myBoard)
						if (checkwin)
						{io.sockets.emit('Win', "Player 1(X) won!")}
						currturn = player2
					}
					else if (id === player2 && id === currturn)
					{
						myBoard[i][bPress - 1] = 'O'
						if (isWin('O') == true)
						{
							checkwin = true
							console.log('WINNER PLAYER2')
							//io.sockets.emit('Win', "Player 2 won!")
							player1 = ""
							player2 = ""
						}
						io.sockets.emit('updatedGrid', myBoard)
						if (checkwin)
						{io.sockets.emit('Win', "Player 2(O) won!")}
						currturn = player1
					}

				}
				})
			
	})

myBoard = new Array()
const createServerSideGrid = () => {
	
	for(i=0;i<6;i++)
	{
		myBoard[i] = new Array()
		for(j=0;j<7;j++)
		{
			myBoard[i][j] = '  '
		}
	}
}

// Got the algo from https://codereview.stackexchange.com/questions/127091/java-connect-four-four-in-a-row-detection-algorithms
hasWon = false
const isWin = s => {
	for (let r = 0; r < 6; r++)
	{
		for (let c = 0; c < 7; c++)
		{
			currPos = myBoard[r][c]
			if (currPos != '  ')
			{
            	if (c + 3 < 7 &&
                currPos == myBoard[r][c+1] && // look right
                currPos == myBoard[r][c+2] &&
                currPos == myBoard[r][c+3])
            	{hasWon = true
            	return hasWon}

				if (r + 3 < 6) {
	                if (currPos == myBoard[r+1][c] && // look up
	                    currPos == myBoard[r+2][c] &&
	                    currPos == myBoard[r+3][c])
	                    {hasWon = true
	                    return hasWon}
	                if (c + 3 < 7 &&
	                    currPos == myBoard[r+1][c+1] && // look up & right
	                   	currPos == myBoard[r+2][c+2] &&
	                    currPos == myBoard[r+3][c+3])
	                    {hasWon = true
	                    return hasWon}
	                if (c - 3 >= 0 &&
	                    currPos == myBoard[r+1][c-1] && // look up & left
	                    currPos == myBoard[r+2][c-2] &&
	                    currPos == myBoard[r+3][c-3])
	                    {hasWon = true
	                    return hasWon}
            	}
			}
		}
	}
}

server.listen(8000, () => console.log('Started'))
createServerSideGrid()
          