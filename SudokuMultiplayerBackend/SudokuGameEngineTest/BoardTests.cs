using SudokuGameEngine;
using System;
using Xunit;

namespace SudokuGameEngineTest
{
    public class BoardTests
    {
        [Fact]
        public void BoardCreating()
        {
            string puzzle = "004300209005009001070060043006002087190007400050083000600000105003508690042910300";
            string solution = "864371259325849761971265843436192587198657432257483916689734125713528694542916378";
            Board board = new Board(puzzle, solution);
            bool gameOver = board.GameOver;
            Assert.False(gameOver);         
        }
    }
}
