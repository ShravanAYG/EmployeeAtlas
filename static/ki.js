// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Profile Section
    const profileUpload = document.getElementById('profile-upload');
    const profilePic = document.getElementById('profile-pic');
    
    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Time Tracking
    let entryTime = null;
    let exitTime = null;
    
    document.getElementById('clock-in').addEventListener('click', function() {
        entryTime = new Date('November 23, 2024 09:00:00');
        document.getElementById('entry-time').textContent = formatTime(entryTime);
        updateWorkingHours();
    });

    document.getElementById('clock-out').addEventListener('click', function() {
        if (entryTime) {
            exitTime = new Date('November 23, 2024 17:30:00');
            document.getElementById('exit-time').textContent = formatTime(exitTime);
            updateWorkingHours();
            calculateSalaryAdjustments();
        }
    });

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function updateWorkingHours() {
        if (entryTime && exitTime) {
            const hours = (exitTime - entryTime) / (1000 * 60 * 60);
            document.getElementById('working-hours').textContent = hours.toFixed(2);
        }
    }

    // Attendance Tracking
    let totalDays = 20; // Assuming 20 working days per month
    let presentDays = 18; // Example value
    
    function updateAttendance() {
        const percentage = (presentDays / totalDays) * 100;
        document.getElementById('attendance-percentage').textContent = `${percentage.toFixed(1)}%`;
        
        // Update progress circle color based on attendance
        const progressCircle = document.querySelector('.progress-circle');
        if (percentage >= 90) {
            progressCircle.style.backgroundColor = '#4CAF50';
        } else if (percentage >= 75) {
            progressCircle.style.backgroundColor = '#FFC107';
        } else {
            progressCircle.style.backgroundColor = '#F44336';
        }
    }

    // Salary Calculations
    function calculateSalaryAdjustments() {
        const fixedSalary = parseFloat(document.getElementById('fixed-salary').value) || 0;
        let finalSalary = fixedSalary;
        
        // Calculate overtime increment
        if (entryTime && exitTime) {
            const workingHours = (exitTime - entryTime) / (1000 * 60 * 60);
            if (workingHours > 8) {
                const overtimeHours = workingHours - 8;
                const incrementPercentage = overtimeHours * 2; // 2% per overtime hour
                const increment = (fixedSalary * incrementPercentage) / 100;
                finalSalary += increment;
                document.getElementById('increment-percentage').textContent = `+${incrementPercentage.toFixed(1)}%`;
            }
        }
        
        // Calculate attendance penalty
        const attendancePercentage = (presentDays / totalDays) * 100;
        if (attendancePercentage < 90) {
            const penaltyPercentage = (90 - attendancePercentage) * 0.5; // 0.5% penalty per percentage below 90%
            const penalty = (fixedSalary * penaltyPercentage) / 100;
            finalSalary -= penalty;
            document.getElementById('decrement-percentage').textContent = `-${penaltyPercentage.toFixed(1)}%`;
        }
        
        document.getElementById('final-salary-amount').textContent = `₹${finalSalary.toFixed(2)}`;
    }

    // Rankings System
    const rankingsData = [
        { name: "John Doe", performanceScore: 95, attendance: 98 },
        { name: "Jane Smith", performanceScore: 92, attendance: 95 },
        { name: "Bob Johnson", performanceScore: 88, attendance: 92 },
        { name: "Alice Brown", performanceScore: 85, attendance: 90 },
        { name: "Charlie Wilson", performanceScore: 82, attendance: 88 }
    ];
   
    function updateRankings() {
        const rankingsBody = document.getElementById('rankings-body');
        rankingsBody.innerHTML = '';
        
        rankingsData.sort((a, b) => b.performanceScore - a.performanceScore)
            .forEach((employee, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${employee.name}</td>
                    <td>${employee.performanceScore}%</td>
                    <td>${employee.attendance}%</td>
                `;
                rankingsBody.appendChild(row);
            });
    }

    // Initial calls
    updateAttendance();
    updateRankings();

    // Event listeners for salary updates
    document.getElementById('fixed-salary').addEventListener('input', calculateSalaryAdjustments);
});