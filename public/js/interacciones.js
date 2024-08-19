// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

function toggleSubMenu() {
  const subMenu = document.getElementById('subMenu');
  const listItem = subMenu.parentElement;

  // Alterna la clase "active" para mostrar/ocultar el submenú
  listItem.classList.toggle('active');
}


