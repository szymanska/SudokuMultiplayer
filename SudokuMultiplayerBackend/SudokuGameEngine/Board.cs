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
        private bool IsGameCorrect() {
            for(int row=0; row<fields.GetLength(0); row++)
            {
                for (int column=0; column<fields.GetLength(1); column++)
                {
                    if (!IsFieldCorrect(row, column))
                        return false;
                }
            }
            return true;
        }

     
        /// <summary>
        /// Wstawienie numeru w odpowiednim polu 
        /// </summary>
        /// <param name="row"></param>
        /// <param name="column"></param>
        /// <param name="value"></param>
        private void InsertField(int row, int column, int value)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy w aktualnym stanie gry dane pole jest poprawnie uzupełnione
        /// </summary>
        /// <param name="row"></param>
        /// <param name="column"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        private bool IsFieldCorrect(int row, int column)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza, czy wiersz jest poprawnie uzupełniony (mogą być w nim braki) 
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        private bool IsRowCorrect(int row)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy kolumna jest poprawnie uzupełniona (mogą być w niej braki)
        /// </summary>
        /// <param name="column">Kolumna</param>
        /// <returns></returns>
        private bool IsColumnCorrect(int column)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy segment jest poprawnie uzupełniony (mogą być w nim braki) 
        /// Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0) 
        /// Np. segment(0,0) zawiera pola:
        /// (0,0) (0,1) (0,2) 
        /// (1,0) (1,1) (1,2) 
        /// (2,0) (2,1) (2,2)
        /// </summary>
        /// <param name="squareRow">Wiersz segmentu</param>
        /// <param name="squareColumn">Kolumna segmentu</param>
        /// <returns></returns>
        private bool IsSquareCorrect(int squareRow, int squareColumn)
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// Zwraca segment planszy  
        /// /// Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0) 
        /// Np. segment(0,0) zawiera pola:
        /// (0,0) (0,1) (0,2) 
        /// (1,0) (1,1) (1,2) 
        /// (2,0) (2,1) (2,2
        /// </summary>
        /// <param name="squareRow">Wiersz segmentu</param>
        /// <param name="squareColumn">Kolumna segmentu</param>
        /// <returns></returns>
        private Field[] GetSquareFields(int squareRow, int squareColumn)
        {
            throw new NotImplementedException();
        }







    }
}
