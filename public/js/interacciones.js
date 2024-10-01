let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');
const openSidebarButton = document.querySelector('.menu-icon'); // Asume que este es el botón que abre el sidebar

// Abre el sidebar
function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

// Cierra el sidebar
function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// Cierra el sidebar si se hace clic fuera de él
document.addEventListener('click', function(event) {
  const target = event.target;

  // Verifica si el clic está fuera del sidebar y si la resolución es menor a 992px
  if (window.innerWidth < 992 && sidebarOpen && !sidebar.contains(target)) {
    closeSidebar();
  }
});

// Evita que el clic en el botón que abre el sidebar cierre el sidebar
openSidebarButton.addEventListener('click', function(event) {
  event.stopPropagation();  // Detiene la propagación del evento
  openSidebar();            // Abre el sidebar
});

function toggleSubMenu() {
  const subMenu = document.getElementById('subMenu');
  const listItem = subMenu.parentElement;

  // Alterna la clase "active" para mostrar/ocultar el submenú
  listItem.classList.toggle('active');
}


