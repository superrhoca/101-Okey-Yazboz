// Butonlara olay dinleyicileri ekliyoruz
document.getElementById('calculate-btn').addEventListener('click', calculateTotals);
document.getElementById('add-row-btn').addEventListener('click', addRow);

// Toplamları hesaplayan ana fonksiyon
function calculateTotals() {
    // 4 oyuncu için 4 ayrı toplam puanı saklayacak bir dizi
    let totals = [0, 0, 0, 0]; // [M, F, H, N]

    const tableBody = document.getElementById('score-body');
    const rows = tableBody.getElementsByTagName('tr');

    // Her bir satır için döngü başlat
    for (const row of rows) {
        const cells = row.getElementsByTagName('td');
        
        // Her bir sütun (oyuncu) için döngü başlat
        for (let i = 0; i < cells.length; i++) {
            const cellValue = cells[i].innerText.trim();

            if (cellValue === '-') {
                // Kural: Biten oyuncu için 101 puan düş
                totals[i] -= 101;
            } else {
                // Diğer değerleri sayıya çevir ve toplama ekle
                // parseInt(cellValue) || 0; -> hücre boşsa veya geçersizse 0 sayar
                totals[i] += parseInt(cellValue) || 0;
            }
        }
    }

    // Hesaplanan toplamları en alttaki satıra yazdır
    document.getElementById('total-m').innerText = totals[0];
    document.getElementById('total-f').innerText = totals[1];
    document.getElementById('total-h').innerText = totals[2];
    document.getElementById('total-n').innerText = totals[3];
}

// Tabloya yeni bir skor satırı ekleyen fonksiyon
function addRow() {
    const tableBody = document.getElementById('score-body');
    const newRow = document.createElement('tr');
    
    // 4 oyuncu için 4 yeni düzenlenebilir hücre oluştur
    newRow.innerHTML = `
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
    `;
    
    tableBody.appendChild(newRow); // Yeni satırı tablonun sonuna ekle
}