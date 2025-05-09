# 🇵🇭 Bisaya++ Programming Language

**Bisaya++** is a **strongly-typed**, **high-level**, **interpreted** Cebuano-based programming language designed to teach programming fundamentals to Cebuanos. With its easy-to-read syntax and native keywords, Bisaya++ aims to make coding accessible, relatable, and fun—especially for beginners who speak the Cebuano language.

---

## 📌 Features

- 🧠 **Cebuano-based syntax** for greater accessibility
- 📦 **Strong typing**: supports NUMERO, LETRA, TINUOD, and TIPIK data types
- 📄 **Single-statement per line rule**
- 🔠 **Case-sensitive variable names**
- 💬 **Native keywords** with clear meaning for Cebuanos
- 🧾 **Built-in I/O**: `IPAKITA`, `DAWAT`
- 🔁 **Control structures**: `KUNG`, `KUNG WALA`, `KUNG DILI`, `ALANG SA`
- 🛠️ **Arithmetic and Logical operators**
- ✅ Supports comments using `--`

---

## 📚 Language Syntax and Structure

All programs begin with `SUGOD` and end with `KATAPUSAN`. Each line should contain a **single statement**.

### 🔡 Data Types

| Type      | Keyword   | Description                              |
|-----------|-----------|------------------------------------------|
| Integer   | `NUMERO`  | Whole number (4 bytes)                   |
| Decimal   | `TIPIK`   | Number with decimal part                 |
| Character | `LETRA`   | A single symbol (e.g. `'a'`)             |
| Boolean   | `TINUOD`  | `"OO"` for true, `"DILI"` for false      |

---

## ➕ Operators

### Arithmetic  
`+`, `-`, `*`, `/`, `%`, `()`  

### Comparison  
`>`, `<`, `>=`, `<=`, `==`, `<>`  

### Logical  
- `UG` (AND)  
- `O` (OR)  
- `DILI` (NOT)  

---

## 🧾 Output & Input

- **Output**: `IPAKITA: <expression>`  
- **Input**: `DAWAT: <var1>, <var2>, ...`

---

## 🔁 Control Flow

### `KUNG` (IF statement)

KUNG (<condition>)
PUNDOK {
   <statements>
}

### `KUNG - KUNG WALA` (IF - ELSE)
KUNG (<condition>)
PUNDOK {
   <statements>
}
KUNG WALA
PUNDOK {
   <statements>
}

### `KUNG - KUNG DILI - KUNG WALA` (IF - ELSE IF - ELSE)
KUNG (<condition>)
PUNDOK {
   <statements>
}
KUNG DILI (<condition>)
PUNDOK {
   <statements>
}
KUNG WALA
PUNDOK {
   <statements>
}

### `ALANG SA` (FOR Loop)

ALANG SA (ctr=1, ctr<=10, ctr++)
PUNDOK {
   IPAKITA: ctr & ' '
}
### Sample Program
SUGOD  
MUGNA NUMERO x, y, z=5  
MUGNA LETRA a_1='n'  
MUGNA TINUOD t="OO"  

x=y=4 
a_1='c' -- this is a comment  

IPAKITA: x & t & z & $ & a_1 & [#] & "last"  
KATAPUSAN
4OO5
c#last





Packages need to download:
readline-sync - npm install readline-sync


