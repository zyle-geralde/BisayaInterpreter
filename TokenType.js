class TokenType {

    //TOKENS
    static NUMERO = "INT"
    static TIPIK = "FLOAT"
    static PLUS = "PLUS"
    static MINUS = "MINUS"
    static MUL = "MUL"
    static DIV = "DIV"
    static LPAREN = "LPAREN"
    static RPAREN = "RPAREN"
    static TT_EOF = "EOF"
    static TT_KEYWORD = 'KEYWORD'
    static TT_PLUS     	= 'PLUS'
    static TT_MINUS    	= 'MINUS'
    static TT_MUL      	= 'MUL'
    static TT_DIV      	= 'DIV'
    static TT_POW = 'POW'
    static TT_IDENTIFIER	= 'IDENTIFIER'

    static TT_SUGOD = "SUGOD"
    static TT_MUGNA = "MUGNA"
    static TT_KATAPUSAN = "KATAPUSAN"

    static TT_NUMERO = "NUMERO"
    static TT_LETRA = "LETRA"
    static TT_TINUOD = "TINUOD"
    static TT_TIPIK = "TIPIK"

    static TT_MINUS = "MINUS"
    static TT_MUL = "MUL"
    static TT_DIV = "DIV"
    static TT_LPAREN = "LPAREN"
    static TT_RPAREN = "RPAREN"

    static TT_IDENTIFIER = "IDENTIFIER"
    static TT_KEYWORD = "KEYWORD"
    static TT_EE = 'EE'
    static TT_NE = 'NE'
    static TT_LT = 'LT'
    static TT_GT = 'GT'
    static TT_LTE = 'LTE'
    static TT_GTE = 'GTE'
    static TT_EQ = "EQ"

    static KEYWORDS = [
        'UG',
        'O',
        'DILI'
    ]

    static TT_NEWLINE = "NEWLINE"
    static TT_COMMA = "COMMA"
    static TT_ASSIGN = "ASSIGN"
    static TT_STRING = "STRING"
    static TT_DTYPE = "DTYPE"
    static TT_IPAKITA = "IPAKITA"
    static TT_CONCAT = "CONCAT"
    static TT_NEXTLINE = "NEXTLINE"
    static TT_VAR_DEC = "VAR_DEC"
    static TT_PRINT = "PRINT"
    static TT_COLON = "COLON"
    static TT_COMMENT = "Comment"
    static TT_DAWATA = "DAWATA"
    static TT_GREATERTHAN = "GreaterThan"
    static TT_LESSTHAN = "LessThan"
    static TT_GREATERTHANOREQUAL = "GreaterThanorEqual"
    static TT_LESSTHANOREQUAL = "LessThanorEqual"
    static TT_EQUAL = "Equal"
    static TT_NOTEQUAL = "NotEqual"
    static TT_AND = "UG"
    static TT_OR = "O"
    static TT_NOT = "DILI"

    static keywords = [TokenType.TT_SUGOD, TokenType.TT_KATAPUSAN]
    static dtype = [TokenType.TT_NUMERO, TokenType.TT_LETRA, TokenType.TT_TINUOD, TokenType.TT_TIPIK]
    static comparisson_operator = [TokenType.TT_GREATERTHAN, TokenType.TT_LESSTHAN, TokenType.TT_GREATERTHANOREQUAL, TokenType.TT_LESSTHANOREQUAL, TokenType.TT_EQUAL, TokenType.TT_NOTEQUAL]
    static logical_Operator = [TokenType.TT_AND, TokenType.TT_OR, TokenType.TT_NOT]

}

module.exports = { TokenType };