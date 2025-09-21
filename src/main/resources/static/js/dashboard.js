document.addEventListener('DOMContentLoaded', () => {
    const dashboardUsernameSpan = document.getElementById('dashboardUsername');
    const myComplaintsLink = document.getElementById('myComplaintsLink');
    const submitComplaintLink = document.getElementById('submitComplaintLink');
    const myComplaintsSection = document.getElementById('myComplaintsSection');
    const submitComplaintSection = document.getElementById('submitComplaintSection');
    const newComplaintForm = document.getElementById('newComplaintForm');
    const complaintListDiv = document.getElementById('complaintList');
    const complaintMessageP = document.getElementById('complaintMessage');
    const noComplaintsMessage = document.getElementById('noComplaintsMessage');
    const logoutBtn = document.getElementById('logoutBtn');

    // Modal elements
    const complaintDetailModal = document.getElementById('complaintDetailModal');
    const modalCloseButton = complaintDetailModal.querySelector('.close-button');
    const modalComplaintTitle = document.getElementById('modalComplaintTitle');
    const modalComplaintStatus = document.getElementById('modalComplaintStatus');
    const modalSubmissionDate = document.getElementById('modalSubmissionDate');
    const modalComplaintDescription = document.getElementById('modalComplaintDescription');
    const modalAdminResponse = document.getElementById('modalAdminResponse');
    const adminResponseSection = complaintDetailModal.querySelector('.admin-response-section');


    // Check if token exists, redirect to login if not
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username'); // Assuming you store username on login
    if (!token || !username) {
        window.location.href = '/'; // Redirect to home/login page
        return;
    }

    dashboardUsernameSpan.textContent = username;

    // Function to show a specific section and hide others
    function showSection(sectionToShow, linkToActivate) {
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
            link.classList.remove('active');
        });

        sectionToShow.classList.add('active');
        linkToActivate.classList.add('active');
    }

    // Event listeners for sidebar navigation
    myComplaintsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(myComplaintsSection, myComplaintsLink);
        fetchMyComplaints(); // Load complaints when "My Complaints" is clicked
    });

    submitComplaintLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(submitComplaintSection, submitComplaintLink);
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userId'); // If you store user ID
        window.location.href = '/'; // Redirect to login page
    });

    // --- Complaint Submission ---
    newComplaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('complaintTitle').value;
        const description = document.getElementById('complaintDescription').value;

        complaintMessageP.textContent = ''; // Clear previous messages
        complaintMessageP.style.color = 'black';

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                const newComplaint = await response.json();
                complaintMessageP.textContent = 'Complaint submitted successfully!';
                complaintMessageP.style.color = 'green';
                newComplaintForm.reset();
                
                // Optionally switch to My Complaints section and refresh the list
                showSection(myComplaintsSection, myComplaintsLink);
                fetchMyComplaints();

            } else {
                const errorData = await response.text(); // or response.json() if your backend sends JSON error
                complaintMessageP.textContent = `Error submitting complaint: ${errorData}`;
                complaintMessageP.style.color = 'red';
            }
        } catch (error) {
            console.error('Network error:', error);
            complaintMessageP.textContent = 'Network error. Please try again.';
            complaintMessageP.style.color = 'red';
        }
    });

    // --- Fetch and Display My Complaints ---
    async function fetchMyComplaints() {
        complaintListDiv.innerHTML = ''; // Clear existing complaints
        noComplaintsMessage.style.display = 'none'; // Hide message initially

        try {
            const response = await fetch('/api/complaints/my', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const complaints = await response.json();
                if (complaints.length === 0) {
                    noComplaintsMessage.style.display = 'block';
                } else {
                    complaints.forEach(complaint => {
                        const complaintCard = document.createElement('div');
                        complaintCard.classList.add('complaint-card');
                        complaintCard.innerHTML = `
                            <h3>${complaint.title}</h3>
                            <p><strong>Submitted:</strong> ${new Date(complaint.submissionDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span class="status status-${complaint.status}">${complaint.status.replace('_', ' ')}</span></p>
                        `;
                        complaintCard.addEventListener('click', () => showComplaintDetails(complaint));
                        complaintListDiv.appendChild(complaintCard);
                    });
                }
            } else if (response.status === 401 || response.status === 403) {
                // Token expired or invalid, redirect to login
                alert('Session expired. Please log in again.');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('username');
                window.location.href = '/';
            }
            else {
                console.error('Failed to fetch complaints:', response.statusText);
                complaintListDiv.innerHTML = `<p style="color: red; text-align: center;">Error loading complaints.</p>`;
            }
        } catch (error) {
            console.error('Network error fetching complaints:', error);
            complaintListDiv.innerHTML = `<p style="color: red; text-align: center;">Network error. Please try again.</p>`;
        }
    }

    // --- Show Complaint Details Modal ---
    function showComplaintDetails(complaint) {
        modalComplaintTitle.textContent = complaint.title;
        modalComplaintStatus.textContent = complaint.status.replace('_', ' ');
        modalComplaintStatus.className = `status status-${complaint.status}`; // Apply status styling
        modalSubmissionDate.textContent = new Date(complaint.submissionDate).toLocaleString();
        modalComplaintDescription.textContent = complaint.description;
        
        if (complaint.adminResponse) {
            modalAdminResponse.textContent = complaint.adminResponse;
            adminResponseSection.style.display = 'block';
        } else {
            modalAdminResponse.textContent = 'No response from administration yet.';
            modalAdminResponse.classList.add('no-response');
            adminResponseSection.style.display = 'block'; // Still show the section, just with no response text
        }

        complaintDetailModal.style.display = 'flex'; // Use flex to center
    }

    // Close Modal functionality
    modalCloseButton.addEventListener('click', () => {
        complaintDetailModal.style.display = 'none';
        modalAdminResponse.classList.remove('no-response'); // Clean up class
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === complaintDetailModal) {
            complaintDetailModal.style.display = 'none';
            modalAdminResponse.classList.remove('no-response'); // Clean up class
        }
    });

    // Initial load: fetch complaints when dashboard loads
    fetchMyComplaints();
});