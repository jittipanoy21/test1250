// ฟังก์ชันโหลดข้อมูลจาก localStorage
function loadTransactions() {
    const transactionsJSON = localStorage.getItem('transactions');
    return transactionsJSON ? JSON.parse(transactionsJSON) : [];
}

// ฟังก์ชันบันทึกข้อมูลไปยัง localStorage
function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ฟังก์ชันแสดงรายการล่าสุด
function renderTransactions() {
    const transactions = loadTransactions();
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-data">ไม่มีรายการ</p>';
        return;
    }
    
    // เรียงลำดับรายการล่าสุดอยู่ด้านบน
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTransactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        
        const isIncome = transaction.type === 'income';
        const sign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'income-amount' : 'expense-amount';
        
        let imageHtml = '';
        if (transaction.image) {
            imageHtml = `<img src="${transaction.image}" alt="Receipt">`;
        } else {
            imageHtml = `<i class="fas fa-receipt"></i>`;
        }
        
        transactionEl.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-image">
                    ${imageHtml}
                </div>
                <div class="transaction-details">
                    <div class="transaction-category">${transaction.category}</div>
                    <div class="transaction-note">${transaction.note}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="transaction-amount ${amountClass}">${sign}${transaction.amount.toFixed(2)}</div>
                <div class="transaction-actions">
                    <button class="action-btn delete-btn" onclick="showDeleteModal(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        transactionsList.appendChild(transactionEl);
    });
}

// ฟังก์ชันแสดงโมดอลยืนยันการลบ
function showDeleteModal(id) {
    deletingId = id;
    document.getElementById('delete-modal').style.display = 'flex';
}

// ฟังก์ชันปิดโมดอล
function closeModal() {
    document.getElementById('delete-modal').style.display = 'none';
    deletingId = null;
}

// ฟังก์ชันยืนยันการลบ
function confirmDelete() {
    if (deletingId) {
        let transactions = loadTransactions();
        transactions = transactions.filter(t => t.id !== deletingId);
        saveTransactions(transactions);
        renderTransactions();
        showNotification('ลบรายการเรียบร้อยแล้ว');
        closeModal();
    }
}

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    renderTransactions();
    
    // ตรวจสอบว่ามีการแจ้งเตือนจากหน้าอื่นหรือไม่
    const urlParams = new URLSearchParams(window.location.search);
    const notification = urlParams.get('notification');
    if (notification) {
        showNotification(notification);
        // ล้างพารามิเตอร์ URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});