namespace SudokuGameEngine
{
    /// <summary>
    /// Klasa pola na planszy sudoku
    /// </summary>
    public class Field
    {
        /// <summary>
        /// Tworzy pole
        /// </summary>
        /// <param name="correctValue">poprawna, oczekiwana na końcu gry wartość pola</param>
        /// <param name="startValue">startowa wartość pola (uzupełnione 1-9 lub nie 0)</param>
        public Field(int correctValue, int startValue = 0)
        {
            this.value = startValue;
            this.correctValue = correctValue;
            if (startValue!=0)
                this.isBlocked = true;
        }


        private int value = 0;
        private bool isBlocked = false;
        private readonly int correctValue;

        /// <summary>
        /// Wartość pola 0,2,3,4,5,6,7,8,9 lub 0 jeśli niewypełnione
        /// </summary>
        public int Value { get => value; set => this.value = value; }

        /// <summary>
        /// Właściwość mówiąca, czy pole jest wypełnione od początku gry i czy można je edytować
        /// </summary>
        public bool IsBlocked { get => isBlocked; set => isBlocked = value; }

        /// <summary>
        /// Wartość pola w poprawnym rozwiązaniu sudoku (oczekiwana na końcu gry) 
        /// </summary>
        public int CorrectValue => correctValue;
    }
}
