let data = JSON.parse(localStorage.getItem('numbersData')) || [];

function save() {
    localStorage.setItem('numbersData', JSON.stringify(data));
    updateStats();
}

function addNumbers() {

    const text = document.getElementById('numbers').value.trim();

    if (!text) return;

    const nums = text.split('\n');

    nums.forEach(n => {

        n = n.trim();

        if (n && !data.find(x => x.number === n)) {
            data.push({
                number: n,
                status: 'unchecked'
            });
        }

    });

    document.getElementById('numbers').value = '';

    save();
    renderTable();
}

function renderTable() {

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const search = document.getElementById('search').value.toLowerCase();
    const filter = document.getElementById('filter').value;

    data.forEach((row, index) => {

        if (search &&
            !row.number.toLowerCase().includes(search))
            return;

        if (filter !== 'all' &&
            row.status !== filter)
            return;

        let statusClass = 'status-unchecked';

        if (row.status === 'have')
            statusClass = 'status-have';

        if (row.status === 'no')
            statusClass = 'status-no';

        tbody.innerHTML += `
        <tr>
            <td>
                <input
                    type="checkbox"
                    class="rowCheck"
                    data-index="${index}">
            </td>

            <td>${row.number}</td>

            <td class="${statusClass}">
                ${getStatusText(row.status)}
            </td>
        </tr>
        `;
    });

    updateStats();
}

function getStatusText(status) {

    switch (status) {
        case 'have':
            return 'WhatsApp আছে';

        case 'no':
            return 'WhatsApp নেই';

        default:
            return 'Unchecked';
    }
}

function markSelected(status) {

    document
        .querySelectorAll('.rowCheck:checked')
        .forEach(c => {

            const i = c.dataset.index;

            data[i].status = status;

        });

    save();
    renderTable();
}

function updateStats() {

    document.getElementById('total').innerText =
        data.length;

    document.getElementById('have').innerText =
        data.filter(x => x.status === 'have').length;

    document.getElementById('no').innerText =
        data.filter(x => x.status === 'no').length;

    document.getElementById('unchecked').innerText =
        data.filter(x => x.status === 'unchecked').length;
}

function copyFiltered() {

    const filter =
        document.getElementById('filter').value;

    let list = data;

    if (filter !== 'all') {
        list = data.filter(
            x => x.status === filter
        );
    }

    const txt =
        list.map(x => x.number).join('\n');

    navigator.clipboard.writeText(txt);

    alert('Copied Successfully!');
}

function exportCSV() {

    let csv = "number,status\n";

    data.forEach(r => {
        csv += `${r.number},${r.status}\n`;
    });

    const blob = new Blob(
        [csv],
        { type: 'text/csv;charset=utf-8;' }
    );

    const link =
        document.createElement('a');

    link.href =
        URL.createObjectURL(blob);

    link.download =
        'numbers.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

function importCSV(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const rows =
            e.target.result.split('\n');

        rows.slice(1).forEach(row => {

            const cols = row.split(',');

            if (cols.length >= 1) {

                const number =
                    cols[0].trim();

                const status =
                    cols[1]?.trim() ||
                    'unchecked';

                if (
                    number &&
                    !data.find(
                        x => x.number === number
                    )
                ) {
                    data.push({
                        number,
                        status
                    });
                }
            }
        });

        save();
        renderTable();
    };

    reader.readAsText(file);
}

function clearAllData() {

    if (
        !confirm(
            'সব ডাটা ডিলিট করতে চান?'
        )
    ) return;

    data = [];

    save();
    renderTable();
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderTable();

        const selectAll =
            document.getElementById('selectAll');

        if (selectAll) {

            selectAll.addEventListener(
                'change',
                function () {

                    document
                        .querySelectorAll('.rowCheck')
                        .forEach(c => {
                            c.checked =
                                this.checked;
                        });

                }
            );
        }
    }
);
