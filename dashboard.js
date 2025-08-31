// ฟังก์ชันโหลดข้อมูลจาก localStorage
function loadTransactions() {
    const transactionsJSON = localStorage.getItem('transactions');
    return transactionsJSON ? JSON.parse(transactionsJSON) : [];
}

// ฟังก์ชันคำนวณยอดรวม
function calculateTotals() {
    const transactions = loadTransactions();
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });
    
    const totalBalance = totalIncome - totalExpense;
    
    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
    document.getElementById('total-balance').textContent = totalBalance.toFixed(2);
    
    return { totalIncome, totalExpense, totalBalance };
}

// ฟังก์ชันอัปเดตแผนภูมิ
function updateChart() {
    const { totalIncome, totalExpense } = calculateTotals();
    const ctx = document.getElementById('chart').getContext('2d');
    
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['รายรับ', 'รายจ่าย'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    '#4caf50',
                    '#f44336',
                ],
                borderWidth: 1,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value.toFixed(2)} บาท (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    updateChart();
    
    // ตรวจสอบว่ามีการแจ้งเตือนจากหน้าอื่นหรือไม่
    const urlParams = new URLSearchParams(window.location.search);
    const notification = urlParams.get('notification');
    if (notification) {
        showNotification(notification);
        // ล้างพารามิเตอร์ URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

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