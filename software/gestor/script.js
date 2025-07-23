document.addEventListener('DOMContentLoaded', () => {
    // --- Menús Colapsables de la Barra Lateral ---
    const navToggles = document.querySelectorAll('.nav-toggle');

    navToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('collapsed');
            // Encuentra el elemento padre '.nav-item'
            const parentNavItem = toggle.closest('.nav-item');
            if (parentNavItem) {
                // Luego, busca el '.submenu' dentro de ese elemento padre
                const submenu = parentNavItem.querySelector('.submenu');
                if (submenu) {
                    submenu.classList.toggle('submenu-content-active');
                }
            }
        });
    });

    // --- Control de Pestañas del Panel Inferior ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.bottom-panel-content');
    const bottomPanel = document.querySelector('.bottom-panel');
    const mainContent = document.querySelector('.main-content');

    // Función para activar una pestaña
    const activateTab = (tabName) => {
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        tabContents.forEach(content => {
            if (content.dataset.tabName === tabName) {
                content.classList.add('show');
                content.classList.remove('hide');
            } else {
                content.classList.add('hide');
                content.classList.remove('show');
            }
        });
    };

    // Event Listeners para los botones de las pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });
    });

    // Función para mostrar el panel inferior y activar una pestaña
    const showBottomPanel = (initialTab = 'structure') => {
        bottomPanel.classList.add('bottom-panel-expanded');
        // Timeout para permitir que la animación CSS se inicie
        setTimeout(() => {
            bottomPanel.querySelector('.bottom-panel-content.show').classList.add('show');
            bottomPanel.querySelector('.bottom-panel-content.show').classList.remove('hide');
            activateTab(initialTab);
        }, 300); // 300ms, coincide con la duración de la transición CSS
    };

    // Función para ocultar el panel inferior
    const hideBottomPanel = () => {
        bottomPanel.classList.remove('bottom-panel-expanded');
        tabContents.forEach(content => {
            content.classList.remove('show');
            content.classList.add('hide');
        });
         // Ocultar el contenido con display:none después de la transición
        setTimeout(() => {
             bottomPanel.querySelector('.bottom-panel-content.show').classList.add('hide'); // Asegura que el contenido se oculte
        }, 300);
    };

    // --- Modal de Creación/Edición de Tabla ---
    const createTableButton = document.querySelector('.create-table-button');
    const editTableButtons = document.querySelectorAll('.edit-table-button');
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const modalCloseButtons = document.querySelectorAll('.modal-close-button');
    const modalTitle = document.getElementById('modal-title');
    const tableNameInput = document.getElementById('table-name');
    const tableEngineSelect = document.getElementById('table-engine');
    const tableCommentTextarea = document.getElementById('table-comment');
    const fieldsContainer = document.getElementById('fields-container');
    const addFieldButton = document.querySelector('.add-field-button');
    const body = document.body;

    const openModal = (isEditing = false, tableName = '') => {
        modal.classList.remove('hide');
        modal.classList.add('visible');
        overlay.classList.remove('hide');
        overlay.classList.add('visible');
        body.classList.add('show-modal'); // Para evitar scroll en el body

        if (isEditing) {
            modalTitle.textContent = `Editar Tabla: ${tableName}`;
            // Llenar campos con datos falsos para edición
            tableNameInput.value = tableName;
            tableEngineSelect.value = 'InnoDB'; // Valor predeterminado
            tableCommentTextarea.value = `Comentario de prueba para ${tableName}.`;
            // Limpiar y añadir campos de ejemplo si fuera necesario
            fieldsContainer.innerHTML = `
                <div class="field-row">
                    <input type="text" class="field-name" value="id_${tableName}" placeholder="Nombre del Campo">
                    <select class="field-type">
                        <option>INT</option>
                        <option>VARCHAR</option>
                        <option>TEXT</option>
                        <option>DATETIME</option>
                        <option>BOOLEAN</option>
                    </select>
                    <label><input type="checkbox" checked> PK</label>
                    <label><input type="checkbox"> Nulo</label>
                    <button class="btn-icon danger remove-field"><i class="fas fa-minus-circle"></i></button>
                </div>
                <div class="field-row">
                    <input type="text" class="field-name" value="campo_extra" placeholder="Nombre del Campo">
                    <select class="field-type">
                        <option>VARCHAR</option>
                        <option>INT</option>
                        <option>TEXT</option>
                        <option>DATETIME</option>
                        <option>BOOLEAN</option>
                    </select>
                    <label><input type="checkbox"> PK</label>
                    <label><input type="checkbox"> Nulo</label>
                    <button class="btn-icon danger remove-field"><i class="fas fa-minus-circle"></i></button>
                </div>
            `;
        } else {
            modalTitle.textContent = 'Crear Nueva Tabla';
            tableNameInput.value = '';
            tableEngineSelect.value = 'InnoDB';
            tableCommentTextarea.value = '';
            fieldsContainer.innerHTML = `
                <div class="field-row">
                    <input type="text" class="field-name" value="id" placeholder="Nombre del Campo">
                    <select class="field-type">
                        <option>INT</option>
                        <option>VARCHAR</option>
                        <option>TEXT</option>
                        <option>DATETIME</option>
                        <option>BOOLEAN</option>
                    </select>
                    <label><input type="checkbox" checked> PK</label>
                    <label><input type="checkbox"> Nulo</label>
                    <button class="btn-icon danger remove-field"><i class="fas fa-minus-circle"></i></button>
                </div>
            `;
        }
        // Añadir event listeners para los nuevos botones de eliminar campo
        fieldsContainer.querySelectorAll('.remove-field').forEach(button => {
            button.addEventListener('click', (e) => e.target.closest('.field-row').remove());
        });
    };

    const closeModal = () => {
        modal.classList.add('hide');
        modal.classList.remove('visible');
        overlay.classList.add('hide');
        overlay.classList.remove('visible');
        body.classList.remove('show-modal');
    };

    createTableButton.addEventListener('click', () => openModal(false));
    editTableButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tableName = e.currentTarget.dataset.tableName;
            openModal(true, tableName);
        });
    });
    modalCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    overlay.addEventListener('click', closeModal); // Cierra modal al hacer clic fuera

    // Funcionalidad estética de añadir campo en el modal
    addFieldButton.addEventListener('click', () => {
        const newFieldRow = document.createElement('div');
        newFieldRow.classList.add('field-row');
        newFieldRow.innerHTML = `
            <input type="text" class="field-name" placeholder="Nombre del Campo">
            <select class="field-type">
                <option>VARCHAR</option>
                <option>INT</option>
                <option>TEXT</option>
                <option>DATETIME</option>
                <option>BOOLEAN</option>
            </select>
            <label><input type="checkbox"> PK</label>
            <label><input type="checkbox"> Nulo</label>
            <button class="btn-icon danger remove-field"><i class="fas fa-minus-circle"></i></button>
        `;
        fieldsContainer.appendChild(newFieldRow);
        newFieldRow.querySelector('.remove-field').addEventListener('click', (e) => e.target.closest('.field-row').remove());
    });

    // --- Botones de "Ver Contenido" de la Tabla ---
    const viewContentButtons = document.querySelectorAll('.view-content-button');
    const contentTableWrapper = document.querySelector('.content-table-wrapper');
    const sqlEditor = document.querySelector('.sql-editor');

    viewContentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tableName = e.currentTarget.dataset.tableName;
            showBottomPanel('content'); // Muestra el panel y activa la pestaña 'Contenido'

            // Simula el cambio de contenido de la tabla
            let tableHtml = '';
            if (tableName === 'usuarios') {
                tableHtml = `
                    <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Fecha Registro</th><th>Acciones</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Juan Pérez</td><td>juan@example.com</td><td>2023-01-15</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>2</td><td>Ana Gómez</td><td>ana@example.com</td><td>2023-02-20</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>3</td><td>Luis Torres</td><td>luis@example.com</td><td>2023-03-01</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>4</td><td>Marta Díaz</td><td>marta@example.com</td><td>2023-04-10</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>5</td><td>Pedro Ruiz</td><td>pedro@example.com</td><td>2023-05-05</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                    </tbody>
                `;
                sqlEditor.value = `SELECT * FROM usuarios;\n\n-- Consulta generada para la tabla ${tableName}`;
            } else if (tableName === 'productos') {
                tableHtml = `
                    <thead><tr><th>ID Producto</th><th>Nombre Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                    <tbody>
                        <tr><td>101</td><td>Laptop X1</td><td>1200.00</td><td>50</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>102</td><td>Monitor Curvo</td><td>350.50</td><td>120</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>103</td><td>Teclado Mecánico</td><td>85.00</td><td>200</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                    </tbody>
                `;
                 sqlEditor.value = `SELECT * FROM productos;\n\n-- Consulta generada para la tabla ${tableName}`;
            } else if (tableName === 'pedidos') {
                 tableHtml = `
                    <thead><tr><th>ID Pedido</th><th>ID Cliente</th><th>Fecha Pedido</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                        <tr><td>P001</td><td>1</td><td>2023-05-10</td><td>1550.00</td><td>Completado</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>P002</td><td>2</td><td>2023-05-12</td><td>350.50</td><td>Pendiente</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>P003</td><td>1</td><td>2023-05-15</td><td>85.00</td><td>Cancelado</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                    </tbody>
                `;
                 sqlEditor.value = `SELECT * FROM pedidos;\n\n-- Consulta generada para la tabla ${tableName}`;
            } else { // Default para otras tablas
                tableHtml = `
                    <thead><tr><th>ID</th><th>Campo1</th><th>Campo2</th><th>Acciones</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Dato A1</td><td>Dato B1</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>2</td><td>Dato A2</td><td>Dato B2</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                        <tr><td>3</td><td>Dato A3</td><td>Dato B3</td><td><button class="btn-icon"><i class="fas fa-edit"></i></button><button class="btn-icon danger"><i class="fas fa-trash-alt"></i></button></td></tr>
                    </tbody>
                `;
                 sqlEditor.value = `SELECT * FROM ${tableName};\n\n-- Consulta generada para la tabla ${tableName}`;
            }
            contentTableWrapper.innerHTML = `<table class="fake-data-table">${tableHtml}</table>`;
        });
    });

     // --- Ocultar Panel Inferior al cambiar de base de datos o vista general ---
     const dbNavigationItems = document.querySelectorAll('.submenu-item a, .sidebar-nav .nav-item:not(.has-submenu) a');
     dbNavigationItems.forEach(item => {
        if (!item.classList.contains('active')) { // No ocultar si es la navegación activa inicial
            item.addEventListener('click', (e) => {
                // Solo ocultar si no es la vista de tablas y no es un item de la BD ya abierto
                if (!e.currentTarget.dataset.view || e.currentTarget.dataset.view !== 'tables') {
                     hideBottomPanel();
                }
            });
        }
     });

    // --- Navegación del árbol de bases de datos para activar el panel de tablas ---
    const dbNameLinks = document.querySelectorAll('.submenu-item a[data-db-name]');
    dbNameLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Simular que se selecciona la DB y se ven sus tablas
            showBottomPanel('structure'); // Abre el panel inferior en la pestaña Estructura por defecto
            // Aquí podrías cambiar el h2 del main-header a "TABLAS de [nombre_db]" estéticamente
        });
    });

    // Activar la vista de tablas por defecto al cargar la página si es necesario
    const initialTableViewLink = document.querySelector('.sub-item a[data-view="tables"]');
    if(initialTableViewLink) {
         initialTableViewLink.addEventListener('click', (e) => {
             e.preventDefault();
             showBottomPanel('structure'); // Abre el panel inferior en la pestaña Estructura
         });
    }

    // Ocultar el panel inferior al inicio (por defecto si no hay tabla seleccionada)
    hideBottomPanel();
});