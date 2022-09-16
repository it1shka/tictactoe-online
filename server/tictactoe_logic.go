package server

// FUNCTIONS FOR BOARD CHECKING...

func (game *Game) checkBoard() {
	status := game.checkBoardStatus()
	switch status {
	case CrossesWin, ZeroesWin:
		winner := game.winnerOf(status)
		opponent := game.opponent(winner)
		SendWinnerMessageTo(winner)
		SendLooserMessageTo(opponent)
	case Draw:
		SendDrawMessageTo(game.crossesPlayer)
		SendDrawMessageTo(game.zeroesPlayer)
	}

	if status != Unfinished {
		game.finished = true
	}
}

func (game *Game) winnerOf(status BoardStatus) *Player {
	if status == CrossesWin {
		return game.crossesPlayer
	}

	if status == ZeroesWin {
		return game.zeroesPlayer
	}

	return nil
}

type BoardStatus uint

const (
	Unfinished BoardStatus = iota
	Draw
	CrossesWin
	ZeroesWin
)

func (game *Game) checkBoardStatus() BoardStatus {
	withSpaces := false
	for _, row := range game.getAllRows() {
		status := checkRowStatus(row)
		switch status {
		case WithSpaces:
			withSpaces = true
		case FullCrosses:
			return CrossesWin
		case FullZeroes:
			return ZeroesWin
		}
	}
	if withSpaces {
		return Unfinished
	}
	return Draw
}

type RowStatus uint

const (
	WithSpaces RowStatus = iota
	Mixed
	FullCrosses
	FullZeroes
)

func checkRowStatus(row [3]Figure) RowStatus {
	crosses, zeroes := 0, 0
	for i := 0; i < 3; i++ {
		switch row[i] {
		case FigureNothing:
			return WithSpaces
		case FigureCross:
			crosses++
		case FigureZero:
			zeroes++
		}
	}
	if crosses == 3 {
		return FullCrosses
	}
	if zeroes == 3 {
		return FullZeroes
	}
	return Mixed
}

func (game *Game) getAllRows() [][3]Figure {
	rows := [][3]Figure{}
	for i := 0; i < 3; i++ {
		rows = append(rows, game.getRow(i))
		rows = append(rows, game.getColumn(i))
	}
	rows = append(rows, game.getFstDiagonal())
	rows = append(rows, game.getSndDiagonal())
	return rows
}

func (game *Game) getRow(n int) [3]Figure {
	return game.board[n]
}

func (game *Game) getColumn(n int) [3]Figure {
	var col [3]Figure
	for i := 0; i < 3; i++ {
		col[i] = game.board[i][n]
	}
	return col
}

func (game *Game) getFstDiagonal() [3]Figure {
	var diag [3]Figure
	for i := 0; i < 3; i++ {
		diag[i] = game.board[i][i]
	}
	return diag
}

func (game *Game) getSndDiagonal() [3]Figure {
	var diag [3]Figure
	for i := 0; i < 3; i++ {
		diag[i] = game.board[i][2-i]
	}
	return diag
}
