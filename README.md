# לומדים SQL · Learn SQL on Northwind

A static website of study and practice pages in SQL for high-school students in the data track (מגמת מידע ונתונים). All pages use the **Northwind** database as it is served by [sql-practice.com](https://www.sql-practice.com/), where students run their queries in the browser.

The pages are in Hebrew (right-to-left); SQL code is left-to-right. Every query on the site was run against the site's database (`northwind.db`), and every result shown on the answer pages comes from that data.

## Viewing the site

- **Locally:** open `index.html` in any browser. No build step, server or installation is needed. The fonts load from Google Fonts; without an internet connection the pages fall back to Arial.
- **Online:** the repository can be served by GitHub Pages from the `main` branch.

`index.html` is the whole navigation of the site, in one file. It holds the list of every topic and document (the `TOPICS` data at the bottom of the file) and shows one view at a time, chosen by the part of the URL after `#`:

- `index.html` — the home page: how to work with sql-practice.com, and one card per topic.
- `index.html#<topic-id>` — one topic (for example `#practice`): its documents in order, with a short description of each, and links to the previous and next topic.
- `index.html#q=<text>` — search results: every document whose title or description contains the text. The search box at the top of every view searches as you type; it ignores niqqud, geresh/gershayim, quote marks, hyphens and underscores, and highlights the matches. It searches only the titles and descriptions, not the content of the pages.

## Working with sql-practice.com

- In the combobox in the top row of the site, choose **northwind.db**.
- The site runs **SQLite**. Use `LIMIT` instead of `TOP`, `||` to join text, `julianday(b) - julianday(a)` for the days between dates, `SUBSTR`, `IFNULL` and `date('now')`. The site adds `YEAR()`, `MONTH()`, `DAY()`, `LEN()` and `CONCAT()`, and statistical functions: `MEDIAN`, `MODE` (NULL on a tie), `STDEV` and `VARIANCE` (sample, n − 1), `LOWER_QUARTILE`, `UPPER_QUARTILE`, `SQRT`, `LOG` (natural log), `EXP`, `POWER`.
- The site shows only the result of the first statement in the editor; run each step of a two-step question on its own.
- Table and field names are lowercase with an underscore between words: `order_details`, `unit_price`.
- `order_details` has no price. The price of a line is `p.unit_price * od.quantity * (1 - od.discount)`, after `JOIN products AS p ON p.product_id = od.product_id`.
- The dates on the site are 20 years later than in the classic Northwind: the orders run from 2016-07-04 to 2018-05-06.

## Contents

| Topic | File | Description |
|---|---|---|
| Northwind database | `database-01-tables.html` | Short reference: the 11 tables, field names and types only |
| | `database-02-schema.html` | Detailed reference: relationship map, keys, a description and an example value for every field, notes on the data |
| SQL formula sheet | `formulas-01-sql-sheet.html` | Statement structure, order of execution, functions, JOIN, CASE, subqueries, SQLite vs SQL Server, common mistakes |
| Lessons (מצגות לשיעור) | `lessons-01-foreign-keys.html` | Animated presentation on primary and foreign keys: why data is split into tables, PK and FK, what a foreign key prevents, a `JOIN` that follows the foreign key, the many-to-many link through `order_details`, and a map of all the relationships in Northwind, with review questions |
| | `lessons-02-join-groupby.html` | Animated presentation: how the engine runs one query on `orders` and `customers` step by step (nested-loop `JOIN`, `INNER` vs `LEFT JOIN`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`), with review questions |
| | `lessons-03-groupby-steps.html` | Animated presentation of `GROUP BY` without `JOIN`: customers by city (`COUNT(*)`), orders by shipper (`COUNT(*)`, `SUM(freight)`), the same query filtered with `HAVING` (groups) and with `WHERE` (rows), a `WHERE` vs `HAVING` comparison and review questions |
| | `lessons-04-join-products.html` | Animated presentation: how `SELECT categories.*, products.*` with a `JOIN` builds its output row by row, then `GROUP BY` category name with `COUNT(*)` and `AVG(unit_price)`; the top 5 best-selling products with their price (`SUM`, `ORDER BY`, `LIMIT 5`) and revenue by country (`SUM(p.unit_price * od.quantity)`, sorted by revenue) with quantity and average price (a four-table `JOIN`), with review questions |
| Practice | `practice-01-30-questions.html` | 30 graded questions, each on two pages (question; query, result and detailed explanation). Slides or document view |
| | `practice-02-90-questions.html` | 90 questions parallel to the 30 (three per question), same format, no subqueries |
| | `practice-03-25-questions.html` | 25 of the 90 questions, questions only, with the structure of the tables each one needs. Print-ready. **Hidden:** not listed in `index.html`; open it by its file name |
| Statistics in SQL | `statistics-01-measures-regression.html` | 20 questions with full solutions: measures of center and spread, how close a distribution is to normal (Pearson skewness, the 68–95–99.7 rule), linear regression (slope, intercept, r). Uses the site's `MEDIAN`, `MODE`, `STDEV`, `VARIANCE`, `LOWER_QUARTILE`, `UPPER_QUARTILE` |
| Homework (עבודות בית) | `assignments-01-homework.html` | 25 new questions to hand in, parallel to the practice sheet, questions only. Print-ready |

In the presentations (`lessons-*`), every animation is preceded by an explanation or query-analysis slide: the question in words, what each clause of the query means (hovering a card highlights its line in the query), the steps the engine has to take, and what the result will look like.

All the question sets are graded in the same five stages: aggregate functions, `GROUP BY`, `HAVING`, grouping over several tables (`JOIN`), and a challenge.

## Building and updating index.html

`index.html` is the only navigation file of the site. These rules apply every time it is created or changed.

### Principles

1. **One file for all lists.** Every list of documents (home page, topic lists, search results) is shown by `index.html`. Do not create separate list pages.
2. **Data and code are separate.** The content is in one place: the `TOPICS` data in the `<script>` at the bottom of the file. The code under it builds every view from that data. Adding, changing or removing a document means editing `TOPICS` only.
3. **Each document is listed once.** A document has exactly one line in `TOPICS`, inside its topic.
4. **Search covers only the lists.** Whatever should be findable must be written in the title (`t`) or the description (`d`).

### The data: topics

| Field | Meaning | Rules |
|---|---|---|
| `id` | Topic id, used in the URL (`#practice`) and in the back links of the topic's pages | Lowercase English letters and hyphens, the same as the file-name prefix of the topic's pages. `q` is reserved. **Never change it after it is published** |
| `title` | Topic name, in Hebrew | Shown on the card and as the title of the topic view. Searched |
| `count` | Summary under the title, for example `"3 דפים · 145 שאלות"` | Written by hand. **Update it whenever a document is added or removed** |
| `desc` | Text of the card on the home page | One or two short sentences |
| `lead` | Text under the title of the topic view | May be longer than `desc` |
| `items` | The topic's documents | See below |

Current topic ids: `database`, `formulas`, `lessons`, `practice`, `statistics`, `assignments`.

### The data: documents

| Field | Meaning | Rules |
|---|---|---|
| `no` | Number shown beside the title | Two digits as a string (`"03"`), equal to the `NN` in the file name |
| `href` | The file | File name relative to the site root. A `.pdf` opens in a new tab automatically |
| `t` | Title | Hebrew, as on the page itself. Searched |
| `q` | Chip on the right | `"25 שאלות"` for question pages, otherwise a short label such as `"דף עזר"` |
| `d` | Description | One to three sentences. Plain text; SQL words may be wrapped in `<code>…</code>`. Searched |
| `homework` | `homework:true` marks a homework to hand in | Shows the "עבודת בית" tag. Every homework goes in the topic `assignments` (עבודות בית), the one list of homework on the site. Leave it out for any other page |

### Writing the strings

- Every value is a JavaScript string in double quotes, and every entry ends with a comma. **A single missing comma or quote stops the whole page from showing**, so open the page after every change.
- Inside a string use the Hebrew marks ׳ and ״, never a plain `"`. If a plain double quote is unavoidable, write it as `\"`.
- Do not use `&`, `<` or `>` outside a `<code>` tag; write "ו" instead of `&`.

## Repository layout

```
learn_sql/
├── index.html                       all navigation: home page, topic lists (#<topic-id>) and search (#q=…)
├── database-NN-<name>.html          Northwind database reference (01 short tables, 02 detailed schema)
├── formulas-NN-<name>.html          SQL formula sheet
├── lessons-NN-<name>.html           animated presentations for class (01 primary and foreign keys, 02 JOIN and GROUP BY, 03 GROUP BY step by step, 04 JOIN products and categories)
├── practice-NN-<name>.html          practice question sets (01 thirty, 02 ninety, 03 twenty-five)
├── statistics-NN-<name>.html         statistics in SQL (01 measures, normality and regression)
├── assignments-NN-<name>.html       homework (01 questions)
├── font-size.js                     text-size control shown on every page
├── README.md
└── LICENSE                          CC0 1.0 Universal
```

Every page is a single self-contained HTML file: styles and scripts are inline, there is no framework, and the only external resource is Google Fonts (Rubik, Assistant, JetBrains Mono). Pages support light and dark mode automatically. The one shared file is `font-size.js`, which adds a text-size control (א− / 100% / א+, from 85% to 200%) to every page; the chosen size is remembered across pages and visits in the same browser. The pages set their sizes in `px`, so the control scales the whole page with CSS `zoom`. In the question viewers and the presentations the control sits in the navigation bar (an element with `id="fs-slot"`); on other pages it floats in the bottom-left corner.

## Adding a new page

1. **Name the file** `<topic>-NN-<short-name>.html`, where `NN` is the page's order within its topic.
2. **Copy the layout** of an existing page of the same kind: a question viewer (`practice-01-30-questions.html`, two pages per question with slides and document views) or a question sheet (`practice-03-25-questions.html`).
3. **Check every query on sql-practice.com** (northwind.db) and copy the results from there.
4. **Add the text-size control** with `<script src="font-size.js"></script>` just before `</head>`, and a back link `<a class="site-back" href="index.html#<topic-id>">→ חזרה לנושא: …</a>` at the top of the page.
5. **Register the page in `index.html`**: add its entry to `TOPICS` and update the topic's `count`.
6. **Commit and push** to `main`.

## Answer keys

Solutions to homework are kept **outside this repository**, in the private folder `learn_sql-answers` next to it, so students cannot see them on GitHub or on the published site. Never add them to this folder.

## License

The content is released under [CC0 1.0 Universal](LICENSE). It may be freely copied, adapted and used for teaching.
