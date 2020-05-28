using System;
using System.Collections.Generic;
using System.Text;

namespace SudokuGameEngine
{
    class Board
    {
        private Field[,] fields = new Field[9, 9];

        /// <summary>
        /// Metoda sprawdzająca czy gra została poprawnie ukończona
        /// </summary>
        /// <returns></returns>
        private bool GameOver() {
            throw new NotImplementedException();
        }

     
        /// <summary>
        /// Wstawienie numeru w odpowiednim polu 
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="value"></param>
        private void InsertField(int x, int y, int value)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy w aktualnym stanie gry dane pole jest poprawnie uzupełnione
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        private bool CheckCorrectness(int x, int y)
        {
            throw new NotImplementedException();
        }

    }
}
