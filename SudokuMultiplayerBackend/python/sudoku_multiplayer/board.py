import numpy as np


class Board:
    @classmethod
    def from_origin(cls, puzzle, solution, board_size=(9, 9)):
        """
        Tworzy nową, początkową planszę sudoku
        :param puzzle: napis składający się z cyfr - wartości pól - sudoku do ułożenia
        :param solution: napis składający się z cyfr - wartości pól - rozwiązanie sudoku
        :param board_size: wielkość planszy sudoku
        """
        board_length = board_size[0] * board_size[1]
        if len(puzzle) != board_length or len(solution) != board_length:
            raise Exception("Puzzle or solution length is incorrect")
        fields = []
        for row in range(board_size[0]):
            for column in range(board_size[1]):
                index = row * 9 + column
                start_value = int(puzzle[index])
                correct_value = int(solution[index])
                if start_value == 0:
                    is_blocked = False
                else:
                    is_blocked = True
                field = {
                    "value": start_value,
                    "is_blocked": is_blocked,
                    "correct_value": correct_value
                }
                fields.append(field)
        fields = np.array(fields).reshape((board_size[0], board_size[1]))
        return Board(fields)

    def insert_field(self, row, column, value):
        """
        Wstawienie numeru w odpowiednim polu
        :param row: wiersz
        :param column: kolumna
        :param value: wartość, 0 oznacza pole niewypełnione
        """
        self.validate_row(row)
        self.validate_column(column)
        self.validate_field_value(value)
        if self.fields[row][column]["is_blocked"]:
            raise Exception("This field is blocked, it should not be allowed to edit it!")
        self.fields[row][column]["value"] = value

    @staticmethod
    def validate_field_value(value):
        """
        Sprawdza czy dana wartość pola jest dozwolona
        :param value: wartość pola
        """
        if value < 0 or value > 9:
            raise Exception("Value should be from integer range <0,9>")

    @staticmethod
    def validate_column(column):
        """
        sprawdza czy dany numer kolumny jest dozwolony
        :param column: numer kolumny
        """
        if column < 0 or column > 8:
            raise Exception("Column should be from integer range <0,8>")

    @staticmethod
    def validate_row(row):
        """
        sprawdza czy dany numer wiersza jest dozwolony
        :param row: numer wiersza
        """
        if row < 0 or row > 8:
            raise Exception("Row should be from integer range <0,8>")

    def is_game_correct(self, check_complete=False):
        """
        Metoda sprawdzająca czy gra została poprawnie ukończona
        :param check_complete:Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry
        """
        for i in range(9):
            if not self.is_row_correct(i, check_complete):
                return False
            if not self.is_column_correct(i, check_complete):
                return False

        for seg_row in range(3):
            for seg_col in range(3):
                if not self.is_segment_correct(seg_row, seg_col, check_complete):
                    return False

        return True

    def get_sudoku_iterator(self):
        """
        Zwraca iterator po planszy sudoku
        """
        return np.nditer(self.fields, flags=['multi_index', 'refs_ok'])

    def is_row_correct(self, row, check_complete):
        """
        Sprawdza, czy wiersz jest poprawnie uzupełniony
        :param row: wiersz
        :param check_complete:Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry
        """
        self.validate_row(row)
        row_fields = self.fields[row]
        if check_complete and not self.is_complete(row_fields):
            return False
        return self.is_correct(row_fields)

    def is_column_correct(self, column, check_complete):
        """
        Sprawdza czy kolumna jest poprawnie uzupełniona
        :param column: kolumna
        :param check_complete: Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry
        """
        self.validate_column(column)
        column_fields = [row[column] for row in self.fields]
        if check_complete and not self.is_complete(column_fields):
            return False
        return self.is_correct(column_fields)

    def is_segment_correct(self, segment_row, segment_column, check_complete):
        """
        Sprawdza czy segment jest poprawnie uzupełniony
        Plansza podzielona jest na 9 segmentów, 3 wiersze (numerowane od 0) i 3 kolumny (numerowane od 0)
        Np. segment(0,0) zawiera pola:
        (0,0) (0,1) (0,2)
        (1,0) (1,1) (1,2)
        (2,0) (2,1) (2,2)
        :param segment_row: wiersz segmentu
        :param segment_column: kolumna segmentu
        :param check_complete: Sprawdza czy wszystkie pola są uzupełnione - potrzebne przy sprawdzaniu końca gry
        """
        element_row = int(segment_row * 3)
        element_column = int(segment_column * 3)
        segment_fields = np.reshape(self.fields[element_row:element_row + 3, element_column:element_column + 3], 9)
        if check_complete and not self.is_complete(segment_fields):
            return False
        return self.is_correct(segment_fields)

    def is_complete(self, row_fields):
        """
        Sprawdza, czy wszystkie pola są wypełnione
        :param row_fields:
        """
        self.validate_rule_fields_count(row_fields)
        for field in row_fields:
            if field["value"] == 0:
                return False
        return True

    @staticmethod
    def validate_rule_fields_count(fields):
        """
        Sprawdza czy liczba pól do określenia spełnienia reguł gry jest prawidłowa
        :param fields: pola do sprawdzenia
        """
        length = len(fields)
        if len(fields) != 9:
            raise Exception("Incorrect fields range provided. Should be length 9")

    def is_correct(self, column_fields):
        """
        Sprawdza, czy wartości podanego zakresu są poprawnie uzupełnione (czy liczby się nie powtarzają)
        :param column_fields:
        """
        self.validate_rule_fields_count(column_fields)
        values = [field["value"] for field in column_fields]
        _, counts = np.unique(values, return_counts=True)
        maximum_count = np.max(counts)
        if maximum_count > 1:
            return False
        else:
            return True

    def __init__(self, fields):
        """
        Tworzy nową planszę
        :param fields: tablica tablic słowników oznaczających pola
            pola zawierają informację:
                "value" - aktualna wartość pola
                "correct_value" - poprawna wartość pola na koniec gry
                "is_blocked" - czy jest zablokowane (niemożliwe do edycji)
        """
        self.fields = fields


    def print(self, correct=False):
        """
        Drukuje sudoku na konsolę
        :param correct: flaga - czy drukować aktualny stan, czy rozwiązanie
        """
        if correct:
            val = "correct_value"
        else:
            val = "value"
        print("\n " + 30 * "-")
        for row in range(9):
            print("|", end=" ")
            for column in range(9):
                if (column + 1) % 3 == 0:
                    print(self.fields[row][column][val], end=" | ")
                else:
                    print(self.fields[row][column][val], end="  ")
            if (row + 1) % 3 == 0:
                print("\n" + 30 * "-")
            else:
                print()

