// Form Builder functionality
document.addEventListener('DOMContentLoaded', function() {
    let formData = {
        title: 'Untitled Form',
        description: '',
        fields: []
    };
    
    let currentFieldId = null;
    
    // Initialize form builder
    initFormBuilder();
    
    function initFormBuilder() {
        // Add event listeners to field options
        const fieldOptions = document.querySelectorAll('.field-option');
        fieldOptions.forEach(option => {
            option.addEventListener('click', function() {
                const fieldType = this.getAttribute('data-type');
                addFieldToForm(fieldType);
            });
        });
        
        // Form title and description changes
        const formTitleInput = document.querySelector('.form-title-input');
        const formDescInput = document.querySelector('.form-desc-input');
        
        formTitleInput.addEventListener('change', function() {
            formData.title = this.value || 'Untitled Form';
        });
        
        formDescInput.addEventListener('change', function() {
            formData.description = this.value;
        });
        
        // Preview form button
        document.getElementById('preview-form').addEventListener('click', function() {
            previewForm();
        });
        
        // Save form button
        document.getElementById('save-form').addEventListener('click', function() {
            saveForm();
        });
        
        // Get link button
        document.getElementById('get-link').addEventListener('click', function() {
            if (formData.id) {
                showShareableLink();
            }
        });
        
        // Close preview button
        document.getElementById('close-preview').addEventListener('click', function() {
            closeModal('preview-modal');
        });
        
        // Copy link button
        document.getElementById('copy-link').addEventListener('click', function() {
            copyToClipboard(document.getElementById('shareable-link'));
            showNotification('Link copied to clipboard!', 'success');
        });
        
        // Close link modal button
        document.getElementById('close-link').addEventListener('click', function() {
            closeModal('link-modal');
        });
    }
    
    function addFieldToForm(type) {
        const fieldId = 'field-' + Date.now();
        const field = {
            id: fieldId,
            type: type,
            question: 'Untitled Question',
            required: false
        };
        
        // Set default properties based on field type
        switch(type) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'number':
            case 'date':
                field.placeholder = '';
                break;
            case 'radio':
            case 'checkbox':
            case 'dropdown':
                field.options = ['Option 1', 'Option 2'];
                break;
        }
        
        formData.fields.push(field);
        renderFormField(field);
        selectField(fieldId);
        
        // Enable get link button if form has fields
        if (formData.fields.length > 0) {
            document.getElementById('get-link').disabled = false;
        }
    }
    
    function renderFormField(field) {
        const previewContainer = document.getElementById('form-preview-container');
        const emptyPrompt = previewContainer.querySelector('.empty-prompt');
        
        if (emptyPrompt) {
            emptyPrompt.remove();
        }
        
        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-field';
        fieldElement.setAttribute('data-field-id', field.id);
        
        let fieldHTML = '';
        
        switch(field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
                fieldHTML = `
                    <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                    <input type="${field.type}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                `;
                break;
            case 'textarea':
                fieldHTML = `
                    <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                    <textarea placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                `;
                break;
            case 'radio':
                fieldHTML = `
                    <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                    ${field.options.map((option, index) => `
                        <div class="option">
                            <input type="radio" id="${field.id}-${index}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''}>
                            <label for="${field.id}-${index}">${option}</label>
                        </div>
                    `).join('')}
                `;
                break;
            case 'checkbox':
                fieldHTML = `
                    <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                    ${field.options.map((option, index) => `
                        <div class="option">
                            <input type="checkbox" id="${field.id}-${index}" name="${field.id}[]" value="${option}">
                            <label for="${field.id}-${index}">${option}</label>
                        </div>
                    `).join('')}
                `;
                break;
            case 'dropdown':
                fieldHTML = `
                    <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                    <select ${field.required ? 'required' : ''}>
                        <option value="">Select an option</option>
                        ${field.options.map(option => `
                            <option value="${option}">${option}</option>
                        `).join('')}
                    </select>
                `;
                break;
        }
        
        fieldElement.innerHTML = fieldHTML;
        
        // Add edit and delete buttons
        const actions = document.createElement('div');
        actions.className = 'field-actions';
        actions.innerHTML = `
            <button class="btn-edit"><i class="fas fa-edit"></i></button>
            <button class="btn-delete"><i class="fas fa-trash"></i></button>
        `;
        
        fieldElement.appendChild(actions);
        
        // Add event listeners for actions
        fieldElement.querySelector('.btn-edit').addEventListener('click', function() {
            selectField(field.id);
        });
        
        fieldElement.querySelector('.btn-delete').addEventListener('click', function() {
            deleteField(field.id);
        });
        
        // Add selection on click
        fieldElement.addEventListener('click', function(e) {
            if (!e.target.closest('.field-actions')) {
                selectField(field.id);
            }
        });
        
        previewContainer.appendChild(fieldElement);
    }
    
    function selectField(fieldId) {
        currentFieldId = fieldId;
        
        // Highlight selected field
        document.querySelectorAll('.form-field').forEach(field => {
            field.classList.remove('selected');
        });
        
        const selectedField = document.querySelector(`[data-field-id="${fieldId}"]`);
        if (selectedField) {
            selectedField.classList.add('selected');
        }
        
        // Show field properties
        showFieldProperties(fieldId);
    }
    
    function showFieldProperties(fieldId) {
        const field = formData.fields.find(f => f.id === fieldId);
        if (!field) return;
        
        const propertiesContainer = document.getElementById('properties-container');
        propertiesContainer.innerHTML = '';
        
        let propertiesHTML = `
            <div class="property-group">
                <label>Question</label>
                <input type="text" class="property-question" value="${field.question}" placeholder="Enter question">
            </div>
            <div class="property-group">
                <label>
                    <input type="checkbox" class="property-required" ${field.required ? 'checked' : ''}>
                    Required
                </label>
            </div>
        `;
        
        // Add type-specific properties
        switch(field.type) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'number':
            case 'date':
                propertiesHTML += `
                    <div class="property-group">
                        <label>Placeholder</label>
                        <input type="text" class="property-placeholder" value="${field.placeholder || ''}" placeholder="Enter placeholder text">
                    </div>
                `;
                break;
            case 'radio':
            case 'checkbox':
            case 'dropdown':
                propertiesHTML += `
                    <div class="property-group">
                        <label>Options</label>
                        <div class="options-container">
                            ${field.options.map((option, index) => `
                                <div class="option-input">
                                    <input type="text" value="${option}" class="property-option" data-index="${index}" placeholder="Option ${index + 1}">
                                    <button class="btn-remove-option" data-index="${index}"><i class="fas fa-times"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-add-option">Add Option</button>
                    </div>
                `;
                break;
        }
        
        propertiesContainer.innerHTML = propertiesHTML;
        
        // Add event listeners for property changes
        propertiesContainer.querySelector('.property-question').addEventListener('change', function() {
            field.question = this.value;
            updateFieldInPreview(fieldId);
        });
        
        propertiesContainer.querySelector('.property-required').addEventListener('change', function() {
            field.required = this.checked;
            updateFieldInPreview(fieldId);
        });
        
        if (propertiesContainer.querySelector('.property-placeholder')) {
            propertiesContainer.querySelector('.property-placeholder').addEventListener('change', function() {
                field.placeholder = this.value;
                updateFieldInPreview(fieldId);
            });
        }
        
        // Options management
        if (propertiesContainer.querySelector('.property-option')) {
            propertiesContainer.querySelectorAll('.property-option').forEach(input => {
                input.addEventListener('change', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    field.options[index] = this.value;
                    updateFieldInPreview(fieldId);
                });
            });
            
            propertiesContainer.querySelectorAll('.btn-remove-option').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (field.options.length > 1) {
                        field.options.splice(index, 1);
                        showFieldProperties(fieldId);
                        updateFieldInPreview(fieldId);
                    }
                });
            });
            
            propertiesContainer.querySelector('.btn-add-option').addEventListener('click', function() {
                field.options.push('New Option');
                showFieldProperties(fieldId);
                updateFieldInPreview(fieldId);
            });
        }
    }
    
    function updateFieldInPreview(fieldId) {
        const field = formData.fields.find(f => f.id === fieldId);
        if (!field) return;
        
        const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
        if (!fieldElement) return;
        
        // Update question
        const label = fieldElement.querySelector('label');
        if (label) {
            const questionText = field.question + (field.required ? ' <span class="required">*</span>' : '');
            label.innerHTML = questionText;
        }
        
        // Update required attribute
        const inputs = fieldElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (field.required) {
                input.setAttribute('required', 'required');
            } else {
                input.removeAttribute('required');
            }
        });
        
        // Update placeholder if exists
        const placeholderElement = fieldElement.querySelector('[placeholder]');
        if (placeholderElement && field.placeholder !== undefined) {
            placeholderElement.setAttribute('placeholder', field.placeholder);
        }
        
        // Update options if needed
        if (field.options && (field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown')) {
            // For simplicity, we'll just re-render the entire field
            fieldElement.remove();
            renderFormField(field);
            selectField(fieldId);
        }
    }
    
    function deleteField(fieldId) {
        // Remove from data
        formData.fields = formData.fields.filter(f => f.id !== fieldId);
        
        // Remove from preview
        const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
        if (fieldElement) {
            fieldElement.remove();
        }
        
        // Clear properties panel if this was the selected field
        if (currentFieldId === fieldId) {
            currentFieldId = null;
            document.getElementById('properties-container').innerHTML = '<p class="empty-prompt">Select a field to edit its properties</p>';
        }
        
        // Show empty prompt if no fields left
        if (formData.fields.length === 0) {
            const previewContainer = document.getElementById('form-preview-container');
            previewContainer.innerHTML = '<p class="empty-prompt">Drag form elements here to start building</p>';
            document.getElementById('get-link').disabled = true;
        }
    }
    
    function previewForm() {
        const previewContainer = document.getElementById('form-preview');
        previewContainer.innerHTML = '';
        
        // Create form preview
        const form = document.createElement('form');
        form.className = 'preview-form';
        
        // Add title and description
        const title = document.createElement('h2');
        title.textContent = formData.title;
        form.appendChild(title);
        
        if (formData.description) {
            const description = document.createElement('p');
            description.textContent = formData.description;
            description.className = 'form-description';
            form.appendChild(description);
        }
        
        // Add fields
        formData.fields.forEach(field => {
            const fieldElement = document.createElement('div');
            fieldElement.className = 'preview-field';
            
            let fieldHTML = '';
            
            switch(field.type) {
                case 'text':
                case 'email':
                case 'number':
                case 'date':
                    fieldHTML = `
                        <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                        <input type="${field.type}" name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                    `;
                    break;
                case 'textarea':
                    fieldHTML = `
                        <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                        <textarea name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                    `;
                    break;
                case 'radio':
                    fieldHTML = `
                        <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                        ${field.options.map((option, index) => `
                            <div class="option">
                                <input type="radio" id="preview-${field.id}-${index}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''}>
                                <label for="preview-${field.id}-${index}">${option}</label>
                            </div>
                        `).join('')}
                    `;
                    break;
                case 'checkbox':
                    fieldHTML = `
                        <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                        ${field.options.map((option, index) => `
                            <div class="option">
                                <input type="checkbox" id="preview-${field.id}-${index}" name="${field.id}[]" value="${option}">
                                <label for="preview-${field.id}-${index}">${option}</label>
                            </div>
                        `).join('')}
                    `;
                    break;
                case 'dropdown':
                    fieldHTML = `
                        <label>${field.question} ${field.required ? '<span class="required">*</span>' : ''}</label>
                        <select name="${field.id}" ${field.required ? 'required' : ''}>
                            <option value="">Select an option</option>
                            ${field.options.map(option => `
                                <option value="${option}">${option}</option>
                            `).join('')}
                        </select>
                    `;
                    break;
            }
            
            fieldElement.innerHTML = fieldHTML;
            form.appendChild(fieldElement);
        });
        
        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Submit';
        submitButton.className = 'btn btn-primary';
        submitButton.addEventListener('click', function() {
            submitPreviewForm(form);
        });
        
        form.appendChild(submitButton);
        previewContainer.appendChild(form);
        
        // Show modal
        openModal('preview-modal');
    }
    
    function submitPreviewForm(form) {
        // This would normally submit to the server
        // For preview, we'll just show a message
        showNotification('Form submission would be processed here', 'info');
        closeModal('preview-modal');
    }
    
    async function saveForm() {
        if (formData.fields.length === 0) {
            showNotification('Please add at least one field to your form', 'warning');
            return;
        }
        
        try {
            const saveButton = document.getElementById('save-form');
            const originalText = saveButton.innerHTML;
            
            // Show loading state
            saveButton.innerHTML = '<div class="loading"></div> Saving...';
            saveButton.disabled = true;
            
            const result = await apiRequest('/forms', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            formData.id = result.formId;
            document.getElementById('get-link').disabled = false;
            
            showNotification('Form saved successfully!', 'success');
            
            // Update dashboard if it's visible
            if (document.getElementById('dashboard-tab').classList.contains('active')) {
                loadDashboardData();
            }
        } catch (error) {
            console.error('Failed to save form:', error);
        } finally {
            // Restore button state
            const saveButton = document.getElementById('save-form');
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
        }
    }
    
    function showShareableLink() {
        if (!formData.id) {
            showNotification('Please save your form first', 'warning');
            return;
        }
        
        const linkInput = document.getElementById('shareable-link');
        const currentUrl = window.location.origin;
        // Fixed the shareable link to point to the form.html page
        linkInput.value = `${currentUrl}/form.html?id=${formData.id}`;
        
        openModal('link-modal');
    }
    
    function copyToClipboard(element) {
        element.select();
        document.execCommand('copy');
    }
});