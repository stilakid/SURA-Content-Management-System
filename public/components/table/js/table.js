class Table {
    constructor(num_or_columns = 1) {
        this.numOfColumns = num_or_columns;
        this.parentContainer = null;
        this.table = null;
        this.numberOfRows = 0;
    }

    install(parent_container, row_headings, row_body, caption) {
        if (!parent_container) {
            throw "Table: You must provide a div to install the Table into.";
        }
        this.parentContainer = parent_container;

        this.verifyData(row_headings);
        for (let row of row_body) {
            this.verifyData(row);
        }

        let table = this.render(row_headings, row_body, caption);
        this.addToDOM(table, parent_container);
    }

    appendRow(row_data) {
        this.verifyData(row_data);
        let new_row = this.renderRow(row_data, this.numberOfRows);
        this.table.append(new_row);
    }

    insertRow(row_data, row_number) {
        if (row_number < 0 || row_number > this.numberOfRows - 1) {
            throw "Table.insertRow: The specified row number is more than the number of rows currently in the table."
        }
        this.verifyData(row_data);
        let new_row = this.renderRow(row_data, row_number);
        
        if (this.numberOfRows === 0) {
            this.table.append(new_row);
        } else {
            after_new_row = this.table.querySelector(`.row-${row_number}`);
            after_new_row.before(new_row);

            row_number++;
            this.shiftRows(after_new_row, row_number);
        }
    }

    deleteRow(rank) {
        let row = this.table.querySelector(`.row-${rank}`);
        let next_row = row.nextElementSibling;
        this.shiftRows(next_row, rank);

        row.remove();
        this.numberOfRows--;
    }

    /**
     * 
     * @param {*} elem | Topmost row (tr) that needs to be shifted up or down.
     * @param {*} new_rank | New rank for elem
     */
    shiftRows(elem, new_rank) {
        while (this.shiftRow(elem, new_rank)) {
            elem = elem.nextElementSibling;
            new_rank++;
        }
    }

    shiftRow(elem, new_rank) {
        if (elem) {
            elem.removeAttribute('class');
            elem.classList.add(`row-${new_rank}`);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param {*} row_headings | Example: [Rank, Name, Score]
     * @param {*} row_body | Example: [[1, <p>Juben</p>, 100], [0, <p>Rana</p>, 0]]
     * @returns 
     */
    render(row_headings, row_body, caption) {
        let rows = [];
        rows.push(Util.tag('caption', {}, caption));
        let header = this.renderHeaderRow(row_headings);
        if (header !== "") rows.push(header);

        for (let i = 0; i < row_body.length; i++) {
            rows.push(this.renderRow(row_body[i], i + 1));
        }

        this.table = Util.tag('table', {'class': 'nav-display-list'}, rows);
        return this.table;
    }

    /**
     * If row_hedings is null or undefined, then the table will have no heading row.
     * 
     * @param {} row_headings 
     */
     renderHeaderRow(row_headings) {
        if (row_headings) {
            let ths = [];
            for (let i = 0; i < this.numOfColumns; i++) {
                let heading = (row_headings[i]) ? row_headings[i] : `Column ${i + 1}`;
                ths.push(Util.tag('th', {'class': `col-${i}`}, heading));
            }
            this.numberOfRows++;
            return Util.tag('tr', {'class': 'row-0'}, ths);
        } else {
            return "";
        }
    }

    renderRow(row_data, row_number) {
        let tds = [];
        for (let i = 0; i < row_data.length; i++) {
            tds.push(Util.tag('td', {'class': `col-${i}`}, row_data[i]));
        }
        let tr = Util.tag('tr', {'class': `row-${row_number}`}, tds);
        this.numberOfRows++;
        return tr;
    }

    verifyData(data) {
        if (data.length < this.numOfColumns) {
            throw "Table: The data passed into the table has less columns than expected.";
        } else if (data.length < this.numOfColumns) {
            throw "Table: The data passed into the table has more columns than expected.";
        } else {
            return true;
        }
    }

    addToDOM(navbar, parentContainer) {
        parentContainer.append(navbar);
    }


    removeFromDOM() {
        this.tertiaryNavbar.remove();
    }

    _resetInstanceVariables() {
    }
}