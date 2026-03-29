document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    const studentCount = document.getElementById('studentCount');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('studentModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');

    let students = JSON.parse(localStorage.getItem('students')) || [];
    let editMode = false;

    // Hiển thị danh sách học sinh
    function renderStudents(data = students) {
        studentList.innerHTML = '';
        data.forEach((s, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>HS-${index + 1001}</td>
                <td><strong>${s.fullName}</strong></td>
                <td>${s.dob}</td>
                <td>${s.className}</td>
                <td>${s.email}</td>
                <td class="actions">
                    <button onclick="editStudent('${s.id}')" class="btn-success"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteStudent('${s.id}')" class="btn-danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            studentList.appendChild(tr);
        });
        studentCount.innerText = data.length;
    }

    // Thêm hoặc cập nhật học sinh
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('studentId').value || Date.now().toString();
        const newStudent = {
            id,
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            className: document.getElementById('className').value,
            email: document.getElementById('email').value
        };

        if (editMode) {
            students = students.map(s => s.id === id ? newStudent : s);
        } else {
            students.push(newStudent);
        }

        saveAndRender();
        closeModal();
    });

    // Xóa học sinh
    window.deleteStudent = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
            students = students.filter(s => s.id !== id);
            saveAndRender();
        }
    };

    // Sửa học sinh
    window.editStudent = (id) => {
        const s = students.find(s => s.id === id);
        if (s) {
            document.getElementById('studentId').value = s.id;
            document.getElementById('fullName').value = s.fullName;
            document.getElementById('dob').value = s.dob;
            document.getElementById('className').value = s.className;
            document.getElementById('email').value = s.email;
            
            modalTitle.innerText = "Cập nhật thông tin";
            editMode = true;
            modal.style.display = 'block';
        }
    };

    // Tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = students.filter(s => 
            s.fullName.toLowerCase().includes(term) || 
            s.className.toLowerCase().includes(term)
        );
        renderStudents(filtered);
    });

    function saveAndRender() {
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    // Modal Control
    openModalBtn.onclick = () => {
        studentForm.reset();
        document.getElementById('studentId').value = '';
        modalTitle.innerText = "Thêm học sinh mới";
        editMode = false;
        modal.style.display = 'block';
    };

    function closeModal() {
        modal.style.display = 'none';
    }

    closeBtn.onclick = closeModal;
    window.onclick = (e) => {
        if (e.target == modal) closeModal();
    };

    // Khởi tạo ban đầu
    renderStudents();
});