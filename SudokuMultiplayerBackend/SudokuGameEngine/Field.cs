﻿namespace SudokuGameEngine
{
    /// <summary>
    /// Klasa pola na planszy sudoku
    /// </summary>
    public class Field
    {

        private int value;
        private bool isBlocked;

        /// <summary>
        /// Wartość pola 0,2,3,4,5,6,7,8,9 lub 0 jeśli niewypełnione
        /// </summary>
        public int Value { get => value; set => this.value = value; }

        /// <summary>
        /// Właściwość mówiąca, czy pole jest wypełnione od początku gry i czy można je edytować
        /// </summary>
        public bool IsBlocked { get => isBlocked; set => isBlocked = value; }
    }
}
