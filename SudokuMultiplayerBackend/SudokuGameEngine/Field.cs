using System;

namespace SudokuGameEngine
{
    public class Field
    {
        private int number;

        private bool isBlocked;

        public int Number { get => number; set => number = value; }
        public bool IsBlocked { get => isBlocked; set => isBlocked = value; }
    }
}
