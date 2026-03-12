class TodoApp {
    constructor() {
        this.todos = [];
        this.categories = [
            { id: 'general', name: 'General', color: '#6366f1' }
        ];
        this.currentFilter = 'all';
        this.currentCategory = 'general';
        this.selectedColor = '#6366f1';
        this.currentTheme = 'purple';
        this.deleteMode = false;
        this.barChart = null;
        this.pieChart = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadFromStorage();
        this.applyTheme();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.categorySelect = document.getElementById('categorySelect');
        this.categoryFilterSelect = document.getElementById('categoryFilterSelect');
        this.addCategoryBtn = document.getElementById('addCategoryBtn');
        this.categoryModal = document.getElementById('categoryModal');
        this.categoryNameInput = document.getElementById('categoryNameInput');
        this.saveCategoryBtn = document.getElementById('saveCategoryBtn');
        this.cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        this.completedCount = document.getElementById('completedCount');
        
        // Edit controls
        this.editBtn = document.getElementById('editBtn');
        this.editControls = document.getElementById('editControls');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.deleteModeBtn = document.getElementById('deleteModeBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        
        // Settings page elements
        this.settingsPage = document.getElementById('settingsPage');
        this.backBtn = document.getElementById('backBtn');
        this.settingsCategoryList = document.getElementById('settingsCategoryList');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.generateTestDataBtn = document.getElementById('generateTestData');
        this.clearAllDataBtn = document.getElementById('clearAllDataBtn');
        this.confirmModal = document.getElementById('confirmModal');
        this.cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        this.confirmClearBtn = document.getElementById('confirmClearBtn');
        
        // Stats elements
        this.completedCount = document.getElementById('completedCount');
        this.activeCount = document.getElementById('activeCount');
        
        // Dashboard elements
        this.dashboardBtn = document.getElementById('dashboardBtn');
        this.dashboardPage = document.getElementById('dashboardPage');
        this.backToMainBtn = document.getElementById('backToMainBtn');
        this.dashboardCompletedCount = document.getElementById('dashboardCompletedCount');
        this.dashboardActiveCount = document.getElementById('dashboardActiveCount');
        this.dashboardTotalCount = document.getElementById('dashboardTotalCount');
        this.dashboardCategoriesCount = document.getElementById('dashboardCategoriesCount');
        this.barChartCanvas = document.getElementById('barChart');
        this.pieChartCanvas = document.getElementById('pieChart');
    }

    attachEventListeners() {
        // Add null checks for all elements
        if (this.addBtn) this.addBtn.addEventListener('click', () => this.addTodo());
        if (this.todoInput) {
            this.todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTodo();
            });
        }

        if (this.filterButtons) {
            this.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    this.render();
                });
            });
        }

        // Category filter listener
        if (this.categoryFilterSelect) {
            this.categoryFilterSelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.render();
            });
        }

        if (this.addCategoryBtn) this.addCategoryBtn.addEventListener('click', () => this.openCategoryModal());
        if (this.saveCategoryBtn) this.saveCategoryBtn.addEventListener('click', () => this.saveCategory());
        if (this.cancelCategoryBtn) this.cancelCategoryBtn.addEventListener('click', () => this.closeCategoryModal());

        // Edit controls event listeners
        if (this.editBtn) this.editBtn.addEventListener('click', () => this.showEditControls());
        if (this.deleteModeBtn) this.deleteModeBtn.addEventListener('click', () => this.toggleDeleteMode());
        if (this.cancelEditBtn) this.cancelEditBtn.addEventListener('click', () => this.hideEditControls());

        // Settings page event listeners
        if (this.settingsBtn) this.settingsBtn.addEventListener('click', () => this.openSettings());
        if (this.backBtn) this.backBtn.addEventListener('click', () => this.closeSettings());
        
        // Dashboard event listeners
        if (this.dashboardBtn) this.dashboardBtn.addEventListener('click', () => this.openDashboard());
        if (this.backToMainBtn) this.backToMainBtn.addEventListener('click', () => this.closeDashboard());
        
        if (this.themeOptions) {
            this.themeOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    this.themeOptions.forEach(o => o.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    this.changeTheme(e.currentTarget.dataset.theme);
                });
            });
        }
        
        if (this.exportDataBtn) this.exportDataBtn.addEventListener('click', () => this.exportData());
        if (this.generateTestDataBtn) {
            console.log('Generate test data button found:', this.generateTestDataBtn);
            this.generateTestDataBtn.addEventListener('click', () => {
                console.log('Generate test data button clicked');
                this.generateTestData();
            });
        }
        if (this.clearAllDataBtn) this.clearAllDataBtn.addEventListener('click', () => this.confirmClearAllData());
        if (this.cancelConfirmBtn) this.cancelConfirmBtn.addEventListener('click', () => this.closeConfirmModal());
        
        if (this.categoryModal) {
            this.categoryModal.addEventListener('click', (e) => {
                if (e.target === this.categoryModal) {
                    this.closeCategoryModal();
                }
            });
        }
        
        if (this.confirmModal) {
            this.confirmModal.addEventListener('click', (e) => {
                if (e.target === this.confirmModal) {
                    this.closeConfirmModal();
                }
            });
        }

        if (document.querySelectorAll('.color-option')) {
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                    e.target.classList.add('selected');
                    this.selectedColor = e.target.dataset.color;
                });
            });
        }

        // Todo list event listener
        if (this.todoList) {
            this.todoList.addEventListener('click', (e) => {
                const todoItem = e.target.closest('.todo-item');
                console.log('Click event on todoList, target:', e.target);
                console.log('Todo clicked:', todoItem);
                console.log('Delete mode:', this.deleteMode);
                
                if (this.deleteMode && todoItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    const todoId = todoItem.dataset.id;
                    console.log('Attempting to delete todo with ID:', todoId);
                    this.deleteTodo(todoId);
                } else if (todoItem && !this.deleteMode) {
                    // Click on todo item to toggle completion
                    this.toggleTodo(todoItem.dataset.id);
                }
            });
            
            // Also add click listener to each todo item during render
            this.todoList.addEventListener('mousedown', (e) => {
                const todoItem = e.target.closest('.todo-item');
                console.log('Mousedown on todoList, target:', e.target);
                console.log('Todo item found:', todoItem);
                console.log('Delete mode on mousedown:', this.deleteMode);
            });
        }
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        // Get selected category from the dropdown
        const selectedCategoryId = this.categorySelect.value;
        
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            categoryId: selectedCategoryId,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.sortTodos();
        this.saveToStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            this.sortTodos();
            this.saveToStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        console.log('Deleting todo with ID:', id);
        console.log('Current todos before delete:', this.todos);
        
        this.todos = this.todos.filter(t => t.id !== id);
        
        console.log('Current todos after delete:', this.todos);
        
        this.saveToStorage();
        this.render();
    }

    sortTodos() {
        this.todos.sort((a, b) => {
            // If both are completed or both are active, sort by creation date (newest first)
            if (a.completed === b.completed) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            // If one is completed and one is active, active comes first
            if (!a.completed && b.completed) {
                return -1;
            }
            if (a.completed && !b.completed) {
                return 1;
            }
            return 0;
        });
    }

    getFilteredTodos() {
        let filtered = this.todos;

        // Apply category filter (if not 'all')
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(todo => todo.categoryId === this.currentCategory);
        }

        // Apply status filter
        switch (this.currentFilter) {
            case 'active':
                return filtered.filter(todo => !todo.completed);
            case 'completed':
                return filtered.filter(todo => todo.completed);
            default:
                return filtered;
        }
    }

    openCategoryModal() {
        this.categoryModal.classList.add('active');
        this.categoryNameInput.value = '';
        this.categoryNameInput.focus();
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        document.querySelector('.color-option[data-color="#6366f1"]').classList.add('selected');
        this.selectedColor = '#6366f1';
    }

    closeCategoryModal() {
        this.categoryModal.classList.remove('active');
    }

    saveCategory() {
        const name = this.categoryNameInput.value.trim();
        if (!name) return;

        const category = {
            id: Date.now().toString(),
            name: name,
            color: this.selectedColor
        };

        this.categories.push(category);
        this.closeCategoryModal();
        this.saveToStorage();
        this.updateCategoryUI();
    }

    updateCategoryUI() {
        // Update category select in input area
        this.categorySelect.innerHTML = '';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === this.currentCategory) {
                option.selected = true;
            }
            this.categorySelect.appendChild(option);
        });
        
        // Update category filter dropdown
        this.categoryFilterSelect.innerHTML = '<option value="all">All Categories</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === this.currentCategory) {
                option.selected = true;
            }
            this.categoryFilterSelect.appendChild(option);
        });
    }

    getCategoryCount(categoryId) {
        return this.todos.filter(todo => todo.categoryId === categoryId).length;
    }

    showEditControls() {
        this.editBtn.style.display = 'none';
        this.editControls.style.display = 'flex';
    }

    hideEditControls() {
        this.editBtn.style.display = 'block';
        this.editControls.style.display = 'none';
        this.deleteMode = false;
        this.deleteModeBtn.textContent = 'Delete Mode';
        this.deleteModeBtn.classList.remove('active');
    }

    toggleDeleteMode() {
        console.log('Toggling delete mode, current state:', this.deleteMode);
        this.deleteMode = !this.deleteMode;
        console.log('New delete mode state:', this.deleteMode);
        
        if (this.deleteMode) {
            this.deleteModeBtn.textContent = 'Exit Delete Mode';
            this.deleteModeBtn.classList.add('active');
            this.todoList.style.cursor = 'pointer';
            console.log('Delete mode activated');
        } else {
            this.deleteModeBtn.textContent = 'Delete Mode';
            this.deleteModeBtn.classList.remove('active');
            this.todoList.style.cursor = 'move';
            console.log('Delete mode deactivated');
        }
        
        // Re-render to update todo item classes
        this.render();
    }

    updateStats() {
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = this.todos.filter(todo => !todo.completed).length;
        
        if (this.completedCount) this.completedCount.textContent = completed;
        if (this.activeCount) this.activeCount.textContent = active;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            this.emptyState.style.display = 'block';
            this.todoList.style.display = 'none';
        } else {
            this.emptyState.style.display = 'none';
            this.todoList.style.display = 'flex';
            
            filteredTodos.forEach((todo, index) => {
                const category = this.categories.find(c => c.id === todo.categoryId);
                const todoItem = document.createElement('li');
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} ${this.deleteMode ? 'delete-mode' : ''}`;
                todoItem.draggable = !this.deleteMode;
                todoItem.dataset.id = todo.id;
                todoItem.dataset.index = index;
                todoItem.innerHTML = `
                    <div class="todo-content">
                        <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                        <div class="todo-meta">
                            <div class="todo-category">
                                <span class="todo-category-color" style="background: ${category?.color || '#6366f1'};"></span>
                                ${category?.name || 'General'}
                            </div>
                            <div class="todo-date">${this.formatDate(todo.createdAt)}</div>
                        </div>
                    </div>
                `;
                this.todoList.appendChild(todoItem);
                
                // Always add click listener for delete mode detection
                todoItem.addEventListener('click', (e) => {
                    console.log('Todo item clicked directly, delete mode:', this.deleteMode);
                    if (this.deleteMode) {
                        e.preventDefault();
                        e.stopPropagation();
                        const todoId = todoItem.dataset.id;
                        console.log('Deleting todo with ID:', todoId);
                        this.deleteTodo(todoId);
                    } else {
                        // Normal click to toggle completion
                        this.toggleTodo(todoItem.dataset.id);
                    }
                });
                
                // Add drag and drop event listeners only if not in delete mode
                if (!this.deleteMode) {
                    this.addDragAndDropListeners(todoItem);
                }
            });
        }
        
        this.updateCategoryUI();
    }

    addDragAndDropListeners(todoItem) {
        let dragStartTime = 0;
        let dragTimer = null;
        let isDragging = false;
        let hasDragged = false;

        todoItem.addEventListener('mousedown', (e) => {
            dragStartTime = Date.now();
            hasDragged = false;
            dragTimer = setTimeout(() => {
                isDragging = true;
            }, 200); // Start drag after 200ms hold
        });

        todoItem.addEventListener('mouseup', (e) => {
            const dragEndTime = Date.now();
            const dragDuration = dragEndTime - dragStartTime;
            
            clearTimeout(dragTimer);
            
            // Only toggle if it was a quick click and no dragging occurred
            if (!isDragging && !hasDragged && dragDuration < 200) {
                // This was a click, not a drag
                this.toggleTodo(todoItem.dataset.id);
            }
            
            isDragging = false;
            hasDragged = false;
        });

        todoItem.addEventListener('dragstart', (e) => {
            isDragging = true;
            hasDragged = true;
            todoItem.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', todoItem.innerHTML);
            // Store dragged info globally for access in drop handler
            window.currentDraggedElement = todoItem;
            window.currentDraggedIndex = parseInt(todoItem.dataset.index);
        });

        todoItem.addEventListener('dragend', (e) => {
            todoItem.classList.remove('dragging');
            // Remove all drag-over classes
            document.querySelectorAll('.drag-over').forEach(item => {
                item.classList.remove('drag-over');
            });
            // Clear global drag state
            window.currentDraggedElement = null;
            window.currentDraggedIndex = null;
            isDragging = false;
            hasDragged = true; // Mark that dragging occurred
        });

        todoItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!todoItem.classList.contains('dragging')) {
                todoItem.classList.add('drag-over');
            }
        });

        todoItem.addEventListener('dragleave', (e) => {
            todoItem.classList.remove('drag-over');
        });

        todoItem.addEventListener('drop', (e) => {
            e.preventDefault();
            todoItem.classList.remove('drag-over');
            
            // Use global drag state instead of local variables
            if (window.currentDraggedElement && window.currentDraggedElement !== todoItem) {
                const dropIndex = parseInt(todoItem.dataset.index);
                this.reorderTodos(window.currentDraggedIndex, dropIndex);
            }
        });
    }

    reorderTodos(fromIndex, toIndex) {
        console.log('Reordering from', fromIndex, 'to', toIndex);
        
        const filteredTodos = this.getFilteredTodos();
        const draggedTodo = filteredTodos[fromIndex];
        
        if (!draggedTodo) return;
        
        // Find the actual todo in the main array
        const draggedTodoId = draggedTodo.id;
        const fromActualIndex = this.todos.findIndex(t => t.id === draggedTodoId);
        
        if (fromActualIndex === -1) return;
        
        // Remove from current position in main array
        this.todos.splice(fromActualIndex, 1);
        
        // Find the target position in main array
        let toActualIndex;
        if (toIndex >= filteredTodos.length) {
            // Moving to the end
            toActualIndex = this.todos.length;
        } else {
            // Find the todo at the drop position
            const targetTodo = filteredTodos[toIndex];
            if (targetTodo) {
                toActualIndex = this.todos.findIndex(t => t.id === targetTodo.id);
                // If dragging forward, insert after target; if backward, insert before target
                if (fromIndex < toIndex) {
                    toActualIndex += 1;
                }
            } else {
                toActualIndex = this.todos.length;
            }
        }
        
        // Insert at new position
        this.todos.splice(toActualIndex, 0, draggedTodo);
        
        console.log('Reordered todos:', this.todos.map(t => t.text));
        
        // Don't sort - maintain the manual order
        // this.sortTodos();
        
        this.saveToStorage();
        this.render();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
            }
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('theme', this.currentTheme);
        localStorage.setItem('currentCategory', this.currentCategory);
    }

    loadFromStorage() {
        const savedTodos = localStorage.getItem('todos');
        const savedCategories = localStorage.getItem('categories');
        const savedTheme = localStorage.getItem('theme');
        const savedCategory = localStorage.getItem('currentCategory');
        
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
            this.sortTodos();
        }
        
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        }
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        if (savedCategory) {
            this.currentCategory = savedCategory;
        }
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        this.themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        this.saveToStorage();
    }

    openSettings() {
        this.settingsPage.classList.add('active');
        this.renderSettingsCategories();
    }

    closeSettings() {
        this.settingsPage.classList.remove('active');
    }

    renderSettingsCategories() {
        if (!this.settingsCategoryList) {
            console.log('settingsCategoryList element not found');
            return;
        }
        
        this.settingsCategoryList.innerHTML = '';
        
        this.categories.forEach(category => {
            if (category.id === 'general') return; // Don't show General category in settings
            
            const categoryItem = document.createElement('div');
            categoryItem.className = 'settings-category-item';
            categoryItem.innerHTML = `
                <div class="settings-category-info">
                    <span class="settings-category-color" style="background: ${category.color};"></span>
                    <span class="settings-category-name">${category.name}</span>
                    <span class="settings-category-count">${this.getCategoryCount(category.id)} tasks</span>
                </div>
                <button class="delete-category-btn" data-id="${category.id}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m2 0v9.5c0 .2761-.2239.5-.5.5h-9c-.27614 0-.5-.2239-.5-.5V4h10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
            this.settingsCategoryList.appendChild(categoryItem);
        });
        
        // Add event listener for delete buttons
        this.settingsCategoryList.addEventListener('click', (e) => {
            if (e.target.closest('.delete-category-btn')) {
                const categoryId = e.target.closest('.delete-category-btn').dataset.id;
                this.deleteCategory(categoryId);
            }
        });
    }

    deleteCategory(categoryId) {
        // Move todos from deleted category to General
        this.todos.forEach(todo => {
            if (todo.categoryId === categoryId) {
                todo.categoryId = 'general';
            }
        });
        
        this.categories = this.categories.filter(c => c.id !== categoryId);
        
        if (this.currentCategory === categoryId) {
            this.currentCategory = 'general';
        }
        
        this.saveToStorage();
        this.renderSettingsCategories();
        this.render();
    }

    exportData() {
        const data = {
            todos: this.todos,
            categories: this.categories,
            theme: this.currentTheme,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    confirmClearAllData() {
        this.confirmMessage.textContent = 'Are you sure you want to clear all data? This action cannot be undone.';
        this.confirmActionBtn.onclick = () => this.clearAllData();
        this.confirmModal.classList.add('active');
    }

    clearAllData() {
        this.todos = [];
        this.categories = [
            { id: 'general', name: 'General', color: '#6366f1' }
        ];
        this.currentCategory = 'general';
        this.currentFilter = 'all';
        
        this.saveToStorage();
        this.closeConfirmModal();
        this.closeSettings();
        this.render();
    }

    closeConfirmModal() {
        this.confirmModal.classList.remove('active');
    }

    generateTestData() {
        console.log('generateTestData function called');
        
        // Add test categories first
        const testCategories = [
            { id: 'work', name: 'Work', color: '#10b981' },
            { id: 'personal', name: 'Personal', color: '#f59e0b' },
            { id: 'shopping', name: 'Shopping', color: '#ef4444' },
            { id: 'health', name: 'Health', color: '#8b5cf6' }
        ];
        
        testCategories.forEach(category => {
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            }
        });
        
        // Clear existing test todos to avoid duplicates
        const testTexts = [
            'Complete project proposal',
            'Review quarterly reports', 
            'Buy groceries',
            'Morning workout',
            'Call dentist',
            'Team meeting preparation',
            'Read 20 pages of book',
            'Weekly meal prep'
        ];
        
        // Remove existing test todos
        this.todos = this.todos.filter(todo => !testTexts.includes(todo.text));
        
        // Add test todos with proper timestamps
        const now = Date.now();
        const testTodos = [
            {
                id: (now + 1).toString(),
                text: 'Team meeting preparation',
                completed: false,
                categoryId: 'work',
                createdAt: new Date(now - 900000).toISOString(), // 15 minutes ago
                completedAt: null
            },
            {
                id: (now + 2).toString(),
                text: 'Read 20 pages of book',
                completed: false,
                categoryId: 'personal',
                createdAt: new Date(now - 2700000).toISOString(), // 45 minutes ago
                completedAt: null
            },
            {
                id: (now + 3).toString(),
                text: 'Buy groceries',
                completed: false,
                categoryId: 'shopping',
                createdAt: new Date(now - 1800000).toISOString(), // 30 minutes ago
                completedAt: null
            },
            {
                id: (now + 4).toString(),
                text: 'Complete project proposal',
                completed: false,
                categoryId: 'work',
                createdAt: new Date(now - 3600000).toISOString(), // 1 hour ago
                completedAt: null
            },
            {
                id: (now + 5).toString(),
                text: 'Review quarterly reports',
                completed: false,
                categoryId: 'work',
                createdAt: new Date(now - 7200000).toISOString(), // 2 hours ago
                completedAt: null
            },
            {
                id: (now + 6).toString(),
                text: 'Morning workout',
                completed: true,
                categoryId: 'health',
                createdAt: new Date(now - 86400000).toISOString(), // 1 day ago
                completedAt: new Date(now - 43200000).toISOString() // 12 hours ago
            },
            {
                id: (now + 7).toString(),
                text: 'Call dentist',
                completed: true,
                categoryId: 'personal',
                createdAt: new Date(now - 172800000).toISOString(), // 2 days ago
                completedAt: new Date(now - 86400000).toISOString() // 1 day ago
            },
            {
                id: (now + 8).toString(),
                text: 'Weekly meal prep',
                completed: true,
                categoryId: 'health',
                createdAt: new Date(now - 259200000).toISOString(), // 3 days ago
                completedAt: new Date(now - 172800000).toISOString() // 2 days ago
            }
        ];
        
        // Add all test todos
        testTodos.forEach(todo => {
            this.todos.push(todo);
        });
        
        // Reset filters to show all todos
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        
        // Update filter buttons
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Sort todos properly
        this.sortTodos();
        
        // Save and render
        this.saveToStorage();
        this.render();
        this.closeSettings();
        
        console.log('Test data generated:', {
            categories: this.categories,
            todos: this.todos,
            filteredCount: this.getFilteredTodos().length
        });
    }

    // Dashboard methods
    openDashboard() {
        this.dashboardPage.classList.add('active');
        this.updateDashboardStats();
        this.renderCharts();
    }

    closeDashboard() {
        this.dashboardPage.classList.remove('active');
        // Destroy charts to free memory
        if (this.barChart) {
            this.barChart.destroy();
            this.barChart = null;
        }
        if (this.pieChart) {
            this.pieChart.destroy();
            this.pieChart = null;
        }
    }

    updateDashboardStats() {
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = this.todos.filter(todo => !todo.completed).length;
        const total = this.todos.length;
        const categories = this.categories.length;
        
        if (this.dashboardCompletedCount) this.dashboardCompletedCount.textContent = completed;
        if (this.dashboardActiveCount) this.dashboardActiveCount.textContent = active;
        if (this.dashboardTotalCount) this.dashboardTotalCount.textContent = total;
        if (this.dashboardCategoriesCount) this.dashboardCategoriesCount.textContent = categories;
    }

    renderCharts() {
        this.renderBarChart();
        this.renderPieChart();
    }

    renderBarChart() {
        const ctx = this.barChartCanvas.getContext('2d');
        
        // Prepare data for bar chart
        const categoryLabels = this.categories.map(cat => cat.name);
        const completedData = this.categories.map(cat => 
            this.todos.filter(todo => todo.categoryId === cat.id && todo.completed).length
        );
        const activeData = this.categories.map(cat => 
            this.todos.filter(todo => todo.categoryId === cat.id && !todo.completed).length
        );
        
        // Destroy existing chart if it exists
        if (this.barChart) {
            this.barChart.destroy();
        }
        
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [
                    {
                        label: 'Completed',
                        data: completedData,
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Active',
                        data: activeData,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    renderPieChart() {
        const ctx = this.pieChartCanvas.getContext('2d');
        
        // Prepare data for pie chart
        const categoryData = this.categories.map(cat => 
            this.todos.filter(todo => todo.categoryId === cat.id).length
        );
        const categoryLabels = this.categories.map(cat => cat.name);
        const categoryColors = this.categories.map(cat => cat.color);
        
        // Destroy existing chart if it exists
        if (this.pieChart) {
            this.pieChart.destroy();
        }
        
        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
