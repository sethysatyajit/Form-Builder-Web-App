// Dashboard functionality
async function loadDashboardData() {
    try {
        const data = await apiRequest('/forms');
        updateDashboardStats(data);
        renderFormsList(data);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardStats(data) {
    const totalForms = data.forms.length;
    const totalResponses = data.forms.reduce((sum, form) => {
        return sum + (form.submissions ? form.submissions.length : 0);
    }, 0);
    
    const responseRate = totalForms > 0 ? Math.round((totalResponses / totalForms) * 100) : 0;
    
    document.getElementById('total-forms').textContent = totalForms;
    document.getElementById('total-responses').textContent = totalResponses;
    document.getElementById('response-rate').textContent = `${responseRate}%`;
}

function renderFormsList(data) {
    const formsContainer = document.getElementById('forms-container');
    
    if (data.forms.length === 0) {
        formsContainer.innerHTML = '<p class="empty-prompt">You haven\'t created any forms yet</p>';
        return;
    }
    
    formsContainer.innerHTML = '';
    
    data.forms.forEach(form => {
        const formCard = document.createElement('div');
        formCard.className = 'form-card animate-slideInUp';
        
        const responseCount = form.submissions ? form.submissions.length : 0;
        const createdDate = new Date(form.createdAt).toLocaleDateString();
        
        formCard.innerHTML = `
            <div class="form-card-header">
                <h3 class="form-card-title">${form.title}</h3>
                <p class="form-card-desc">${form.description || 'No description'}</p>
            </div>
            <div class="form-card-body">
                <div class="form-card-meta">
                    <span>${responseCount} responses</span>
                    <span>Created: ${createdDate}</span>
                </div>
            </div>
            <div class="form-card-actions">
                <a href="/form.html?id=${form.id}" target="_blank" class="btn btn-primary btn-sm">
                    <i class="fas fa-link"></i> View Form
                </a>
                <button class="btn btn-success btn-sm" onclick="viewResponses('${form.id}')">
                    <i class="fas fa-chart-bar"></i> Responses
                </button>
            </div>
        `;
        
        formsContainer.appendChild(formCard);
    });
}

async function viewResponses(formId) {
    try {
        const formData = await apiRequest(`/forms/${formId}`);
        showResponsesModal(formData);
    } catch (error) {
        console.error('Failed to load form responses:', error);
        showNotification('Failed to load responses', 'error');
    }
}

function showResponsesModal(formData) {
    const modal = document.getElementById('responses-modal');
    const container = document.getElementById('responses-container');
    
    if (!formData.submissions || formData.submissions.length === 0) {
        container.innerHTML = '<p class="empty-prompt">No responses yet</p>';
    } else {
        container.innerHTML = `
            <h3>${formData.title} - Responses (${formData.submissions.length})</h3>
            <div class="responses-list">
                ${formData.submissions.map((submission, index) => `
                    <div class="response-item">
                        <div class="response-header">
                            <span>Response #${index + 1}</span>
                            <span>${new Date(submission.submittedAt).toLocaleString()}</span>
                        </div>
                        <div class="response-data">
                            ${Object.entries(submission).filter(([key]) => key !== 'id' && key !== 'submittedAt').map(([key, value]) => {
                                const field = formData.fields.find(f => f.id === key);
                                const fieldName = field ? field.question : key;
                                return `
                                    <div class="response-field">
                                        <strong>${fieldName}:</strong>
                                        <span>${Array.isArray(value) ? value.join(', ') : value}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    openModal('responses-modal');
    
    // Add event listener for close button
    document.getElementById('close-responses').addEventListener('click', function() {
        closeModal('responses-modal');
    });
}

// Initialize dashboard when the tab is active
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('dashboard-tab').classList.contains('active')) {
        loadDashboardData();
    }
});