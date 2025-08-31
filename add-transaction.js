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

// ฟังก์ชันแสดงตัวอย่างภาพจาก URL
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const img = preview.querySelector('img');
    
    if (input.value) {
        img.src = input.value;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// ฟังก์ชันจัดการการอัปโหลดไฟล์
function handleFileSelect(fileInput, previewId, imageUrlInputId) {
    const file = fileInput.files[0];
    const preview = document.getElementById(previewId);
    const img = preview.querySelector('img');
    const imageUrlInput = document.getElementById(imageUrlInputId);
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.src = e.target.result;
            preview.style.display = 'block';
            
            // เก็บข้อมูลรูปภาพเป็น Data URL
            imageUrlInput.value = e.target.result;
        };
        
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        imageUrlInput.value = '';
    }
}

// ฟังก์ชันเปลี่ยนแท็บ
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // อัปเดตแท็บที่ active
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // อัปเดตฟอร์มที่แสดง
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
}

// ฟังก์ชันจัดการฟอร์ม
function setupForms() {
    // ฟอร์มรายรับ
    document.getElementById('income-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit('income');
    });
    
    // ฟอร์มรายจ่าย
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit('expense');
    });
    
    // ตั้งค่าการอัปโหลดไฟล์
    document.getElementById('income-file').addEventListener('change', function() {
        handleFileSelect(this, 'income-preview', 'income-image');
    });
    
    document.getElementById('expense-file').addEventListener('change', function() {
        handleFileSelect(this, 'expense-preview', 'expense-image');
    });
    
    // ป้องกันการส่งฟอร์มโดยกด Enter บนมือถือ
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    const form = this.closest('form');
                    const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
                    const currentIndex = inputs.indexOf(this);
                    
                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    } else {
                        this.blur();
                    }
                }
            }
        });
    });
}

// ฟังก์ชันจัดการการส่งฟอร์ม
function handleFormSubmit(type) {
    const category = document.getElementById(`${type}-category`).value;
    const amount = parseFloat(document.getElementById(`${type}-amount`).value);
    const note = document.getElementById(`${type}-note`).value || 'ไม่มีหมายเหตุ';
    const image = document.getElementById(`${type}-image`).value;
    
    if (!amount || amount <= 0) {
        showNotification('กรุณากรอกจำนวนเงินที่ถูกต้อง');
        return;
    }
    
    // โหลดรายการปัจจุบัน
    const transactions = loadTransactions();
    
    // เพิ่มรายการใหม่
    transactions.push({
        id: Date.now(),
        type: type,
        category,
        amount,
        note,
        image,
        date: new Date().toISOString().split('T')[0]
    });
    
    // บันทึกลง localStorage
    saveTransactions(transactions);
    
    // รีเซ็ตฟอร์ม
    document.getElementById(`${type}-form`).reset();
    document.getElementById(`${type}-preview`).style.display = 'none';
    
    showNotification('บันทึก' + (type === 'income' ? 'รายรับ' : 'รายจ่าย') + 'เรียบร้อยแล้ว');
    
    // กลับไปยังหน้าหลักหลังจากบันทึก
    setTimeout(() => {
        window.location.href = 'dashboard.html?notification=บันทึกข้อมูลเรียบร้อยแล้ว';
    }, 1000);
}

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupForms();
    
    // เพิ่มการรองรับการลากและวางไฟล์
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#4285f4';
            this.style.backgroundColor = '#f0f7ff';
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = 'transparent';
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            if (files.length && files[0].type.startsWith('image/')) {
                const formId = this.closest('form').id;
                const fileInput = document.getElementById(`${formId}-file`);
                fileInput.files = files;
                
                const previewId = `${formId}-preview`;
                const imageInput = document.getElementById(`${formId}-image`);
                handleFileSelect(fileInput, previewId, imageInput.id);
            }
        });
    });
});