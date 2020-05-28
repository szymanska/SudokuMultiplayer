using System;
using System.Collections.Generic;
using System.Text;

namespace SudokuGameEngine
{
    class Board
    {
        /// <summary>
        /// Pola na planszy
        /// </summary>
        private Field[,] fields = new Field[9, 9];

        /// <summary>
        /// Sprawdza czy gra została zakończona poprawnie 
        /// </summary>
        public bool GameOver => IsGameCorrect(true);


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
        /// Metoda sprawdzająca czy gra została poprawnie ukończona
        /// </summary>
        /// <param name="complete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsGameCorrect(bool complete = false)
        {
            for (int row = 0; row < fields.GetLength(0); row++)
            {
                for (int column = 0; column < fields.GetLength(1); column++)
                {
                    if (!IsFieldCorrect(row, column, complete))
                        return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Sprawdza aktualnym stanie gry, czy dane pole jest poprawnie uzupełnione
        /// </summary>
        /// <param name="row">Wiersz</param>
        /// <param name="column">Kolumna</param>
        /// <param name="complete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsFieldCorrect(int row, int column, bool complete = false)
        {
            int segmentRow = row / 3;
            int segmentColumn = column / 3;
            return IsRowCorrect(row, complete) && IsColumnCorrect(column, complete) && IsSegmentCorrect(segmentRow, segmentColumn, complete);
        }

        /// <summary>
        /// Sprawdza, czy wiersz jest poprawnie uzupełniony 
        /// </summary>
        /// <param name="row">Wiersz</param>
        /// <param name="complete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsRowCorrect(int row, bool complete = false)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy kolumna jest poprawnie uzupełniona
        /// </summary>
        /// <param name="column">Kolumna</param>
        /// <param name="complete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsColumnCorrect(int column, bool complete = false)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sprawdza czy segment jest poprawnie uzupełniony 
        /// Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0) 
        /// Np. segment(0,0) zawiera pola:
        /// (0,0) (0,1) (0,2) 
        /// (1,0) (1,1) (1,2) 
        /// (2,0) (2,1) (2,2)
        /// </summary>
        /// <param name="squareRow">Wiersz segmentu</param>
        /// <param name="squareColumn">Kolumna segmentu</param>
        /// <param name="complete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsSegmentCorrect(int squareRow, int squareColumn, bool complete = false)
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
        /// <returns>Tablica jednowymiarowa zawierająca 9 pól z danego segmentu</returns>
        private Field[] GetSquareFields(int squareRow, int squareColumn)
        {
            throw new NotImplementedException();
        }







    }
}
