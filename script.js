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
        this.categorySelect = document.getElementById('categorySelect');
        this.categoryFilterSelect = document.getElementById('categoryFilterSelect');
        this.addCategoryBtn = document.getElementById('addCategoryBtn');
        this.categoryModal = document.getElementById('categoryModal');
        this.categoryNameInput = document.getElementById('categoryNameInput');
        this.saveCategoryBtn = document.getElementById('saveCategoryBtn');
        this.cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.completedCount = document.getElementById('completedCount');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Settings elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPage = document.getElementById('settingsPage');
        this.backBtn = document.getElementById('backBtn');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.settingsCategoryList = document.getElementById('settingsCategoryList');
        this.exportDataBtn = document.getElementById('exportData');
        this.generateTestDataBtn = document.getElementById('generateTestData');
        this.clearAllDataBtn = document.getElementById('clearAllData');
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
        this.confirmActionBtn = document.getElementById('confirmActionBtn');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Category filter listener
        this.categoryFilterSelect.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.render();
        });

        this.addCategoryBtn.addEventListener('click', () => this.openCategoryModal());
        this.saveCategoryBtn.addEventListener('click', () => this.saveCategory());
        this.cancelCategoryBtn.addEventListener('click', () => this.closeCategoryModal());
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Settings event listeners
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.backBtn.addEventListener('click', () => this.closeSettings());
        
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.themeOptions.forEach(o => o.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.changeTheme(e.currentTarget.dataset.theme);
            });
        });
        
        this.exportDataBtn.addEventListener('click', () => this.exportData());
        this.generateTestDataBtn.addEventListener('click', () => this.generateTestData());
        this.clearAllDataBtn.addEventListener('click', () => this.confirmClearAllData());
        this.cancelConfirmBtn.addEventListener('click', () => this.closeConfirmModal());
        
        this.categoryModal.addEventListener('click', (e) => {
            if (e.target === this.categoryModal) {
                this.closeCategoryModal();
            }
        });
        
        this.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) {
                this.closeConfirmModal();
            }
        });

        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedColor = e.target.dataset.color;
            });
        });

        // Todo list event listener (moved outside render to prevent duplicate listeners)
        this.todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(e.target.dataset.id);
            } else if (e.target.closest('.delete-btn')) {
                const id = e.target.closest('.delete-btn').dataset.id;
                this.deleteTodo(id);
            }
        });
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
        this.todos = this.todos.filter(t => t.id !== id);
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

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveToStorage();
        this.render();
    }

    updateStats() {
        const completed = this.todos.filter(todo => todo.completed).length;
        this.completedCount.textContent = completed;
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
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                todoItem.draggable = true;
                todoItem.dataset.id = todo.id;
                todoItem.dataset.index = index;
                todoItem.innerHTML = `
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
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
                    <div class="todo-actions">
                        <button class="todo-btn delete-btn" data-id="${todo.id}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4h12M5 4V2.5C5 2.22386 5.22386 2 5.5 2h5c.27614 0 .5.22386.5.5V4m2 0v9.5c0 .2761-.2239.5-.5.5h-9c-.27614 0-.5-.2239-.5-.5V4h10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                `;
                this.todoList.appendChild(todoItem);
                
                // Add drag and drop event listeners
                this.addDragAndDropListeners(todoItem);
            });
        }
        
        this.updateCategoryUI();
        this.updateStats();
    }

    addDragAndDropListeners(todoItem) {
        let draggedElement = null;
        let draggedIndex = null;

        todoItem.addEventListener('dragstart', (e) => {
            draggedElement = todoItem;
            draggedIndex = parseInt(todoItem.dataset.index);
            todoItem.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', todoItem.innerHTML);
        });

        todoItem.addEventListener('dragend', (e) => {
            todoItem.classList.remove('dragging');
            // Remove all drag-over classes
            document.querySelectorAll('.drag-over').forEach(item => {
                item.classList.remove('drag-over');
            });
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
            
            if (draggedElement && draggedElement !== todoItem) {
                const dropIndex = parseInt(todoItem.dataset.index);
                this.reorderTodos(draggedIndex, dropIndex);
            }
        });
    }

    reorderTodos(fromIndex, toIndex) {
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
        if (toIndex >= filteredTodos.length - 1) {
            // Moving to the end
            toActualIndex = this.todos.length;
        } else {
            // Find the todo at the drop position
            const targetTodo = filteredTodos[toIndex + (fromIndex < toIndex ? 1 : -1)];
            if (targetTodo) {
                toActualIndex = this.todos.findIndex(t => t.id === targetTodo.id);
            } else {
                toActualIndex = this.todos.length;
            }
        }
        
        // Insert at new position
        this.todos.splice(toActualIndex, 0, draggedTodo);
        
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
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
