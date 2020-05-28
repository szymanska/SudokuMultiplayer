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
            if (row < 0 || row > 8)
                throw new ArgumentException("Row should be from integer range <0,8>");

            if (column < 0 || column > 8)
                throw new ArgumentException("Column should be from integer range <0,8>");

            if (value < -1 || value > 9 || value == 0)
                throw new ArgumentException("Value should be from set {-1, 1, 2, 3, 4, 5, 6, 7, 8, 9}");

            if (fields[row, column].IsBlocked)
                throw new ArgumentException("This field is blocked, it should not be allowed to edit it");

            fields[row, column].Value = value;
        }

        /// <summary>
        /// Metoda sprawdzająca czy gra została poprawnie ukończona
        /// </summary>
        /// <param name="checkComplete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsGameCorrect(bool checkComplete = false)
        {
            for (int row = 0; row < fields.GetLength(0); row++)
            {
                for (int column = 0; column < fields.GetLength(1); column++)
                {
                    if (!IsFieldCorrect(row, column, checkComplete))
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
        /// <param name="checkComplete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsFieldCorrect(int row, int column, bool checkComplete = false)
        {
            int segmentRow = row / 3;
            int segmentColumn = column / 3;
            return IsRowCorrect(row, checkComplete) && IsColumnCorrect(column, checkComplete) && IsSegmentCorrect(segmentRow, segmentColumn, checkComplete);
        }

        /// <summary>
        /// Sprawdza, czy wiersz jest poprawnie uzupełniony 
        /// </summary>
        /// <param name="row">Wiersz</param>
        /// <param name="checkComplete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsRowCorrect(int row, bool checkComplete = false)
        {
            List<Field> rowFields = GetRowFields(row);
            if (checkComplete && !isComplete(rowFields))
                return false;
            return isCorrect(rowFields);
        }

        /// <summary>
        /// Sprawdza czy kolumna jest poprawnie uzupełniona
        /// </summary>
        /// <param name="column">Kolumna</param>
        /// <param name="checkComplete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsColumnCorrect(int column, bool checkComplete = false)
        {
            List<Field> columnFields = GetColumnFields(column);
            if (checkComplete && !isComplete(columnFields))
                return false;
            return isCorrect(columnFields);
        }

        /// <summary>
        /// Sprawdza czy segment jest poprawnie uzupełniony 
        /// Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0) 
        /// Np. segment(0,0) zawiera pola:
        /// (0,0) (0,1) (0,2) 
        /// (1,0) (1,1) (1,2) 
        /// (2,0) (2,1) (2,2)
        /// </summary>
        /// <param name="segmentRow">Wiersz segmentu</param>
        /// <param name="segmentColumn">Kolumna segmentu</param>
        /// <param name="checkComplete">Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry</param>
        /// <returns></returns>
        private bool IsSegmentCorrect(int segmentRow, int segmentColumn, bool checkComplete = false)
        {
            List<Field> segment = GetSegmentFields(segmentRow, segmentColumn);
            if (checkComplete && !isComplete(segment))
                return false;
            return isCorrect(segment);
        }

        /// <summary>
        /// Zwraca pola z danego segmentu planszy  
        /// /// Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0) 
        /// Np. segment(0,0) zawiera pola:
        /// (0,0) (0,1) (0,2) 
        /// (1,0) (1,1) (1,2) 
        /// (2,0) (2,1) (2,2
        /// </summary>
        /// <param name="segmentRow">Wiersz segmentu</param>
        /// <param name="segmentColumn">Kolumna segmentu</param>
        /// <returns>Tablica jednowymiarowa zawierająca 9 pól z danego segmentu</returns>
        private List<Field> GetSegmentFields(int segmentRow, int segmentColumn)
        {
            if (segmentColumn > 2 || segmentColumn < 0 || segmentRow > 2 || segmentRow < 0)
                throw new ArgumentException("SegmentRow and SegmentColumn should be integer from range <0,2>");

            List<Field> segment = new List<Field>();
            int firstElementRow = segmentRow * 3;
            int firstElementColumn = segmentColumn * 3;

            for (int row = 0; row < 3; row++)
            {
                for (int column = 0; column < 3; column++)
                {
                    segment.Add(fields[firstElementRow + row, firstElementColumn + column]);
                }
            }
            return segment;
        }

        /// <summary>
        /// Zwraca pola z danej kolumny planszy
        /// </summary>
        /// <param name="column">Kolumna</param>
        /// <returns>Tablica jednowymiarowa zawierająca 9 pól z podanej kolumny</returns>
        private List<Field> GetColumnFields(int column)
        {
            if (column < 0 || column > 8)
                throw new ArgumentException("Column should be integer from range <0,8>");


            List<Field> columnFields = new List<Field>();
            for (int row = 0; row < fields.GetLength(0); row++)
            {
                columnFields.Add(fields[row, column]);
            }
            return columnFields;
        }

        /// <summary>
        /// Zwraca pola z danego wiersza planszy
        /// </summary>
        /// <param name="row">Wiersz</param>
        /// <returns>Tablica jednowymiarowa zawierająca 9 pól z podanego wiersza</returns>
        private List<Field> GetRowFields(int row)
        {
            if (row < 0 || row > 8)
                throw new ArgumentException("Row should be integer from range <0,8>");

            List<Field> rowFields = new List<Field>();
            for (int column = 0; column < fields.GetLength(1); column++)
            {
                rowFields.Add(fields[row, column]);
            }
            return rowFields;
        }

        /// <summary>
        /// Sprawdza, czy wszystkie pola są wypełnione
        /// </summary>
        /// <param name="fieldsRange">Wiersz, kolumna lub segment</param>
        /// <returns>Prawda, jeśli wszystkie są wypełnione</returns>
        private bool isComplete(List<Field> fieldsRange)
        {
            if (fieldsRange.Count != 9)
                throw new ArgumentException("Incorrect fieldsRange provided. Should be length 9");

            foreach (Field field in fieldsRange)
            {
                if (field.Value == -1)
                    return false;
            }
            return true;
        }

        /// <summary>
        /// Sprawdza, czy wartości podanego zakresu są poprawnie uzupełnione (czy liczby się nie powtarzają) 
        /// Nie wszystkie pola muszą być wypełnione
        /// </summary>
        /// <param name="fieldsRange">Wiersz, kolumna lub segment</param>
        /// <returns>Prawda, jeśli poprawnie wypełnione</returns>
        private bool isCorrect(List<Field> fieldsRange)
        {
            if (fieldsRange.Count != 9)
                throw new ArgumentException("Incorrect fieldsRange provided. Should be length 9");

            ISet<int> usedValues = new HashSet<int>();
            foreach (Field field in fieldsRange)
            {
                if (field.Value == -1)
                    continue;
                if (usedValues.Contains(field.Value))
                    return false;
                usedValues.Add(field.Value);
            }
            return true;
        }







    }
}
