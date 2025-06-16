let guests = [];
let guestIdCounter = 0;
const MAX_GUESTS = 10;

const guestForm = document.getElementById('guestForm');
const guestNameInput = document.getElementById('guestName');
const guestCategorySelect = document.getElementById('guestCategory');
const addGuestBtn = document.getElementById('addGuestBtn');
const guestList = document.getElementById('guestList');
const emptyState = document.getElementById('emptyState');
const guestStats = document.getElementById('guestStats');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    guestForm.addEventListener('submit', handleAddGuest);
});

function handleAddGuest(e) {
    e.preventDefault();
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;

    if (!name || guests.length >= MAX_GUESTS) {
        showToast(`Guest List Full! Maximum ${MAX_GUESTS} guests allowed!`, 'error');
        return;
    }

    guests.push({ id: ++guestIdCounter, name, category, rsvpStatus: 'Not Attending', addedAt: new Date() });
    guestNameInput.value = '';
    guestCategorySelect.value = 'Friend';
    updateUI();
    showToast(`Guest Added! ${name} has been added!`, 'success');
}

function removeGuest(guestId) {
    const guest = guests.find(g => g.id === guestId);
    guests = guests.filter(g => g.id !== guestId);
    updateUI();
    if (guest) showToast(`Guest Removed: ${guest.name} has left!`, 'info');
}

function toggleRSVP(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
        guest.rsvpStatus = guest.rsvpStatus === 'Attending' ? 'Not Attending' : 'Attending';
        updateUI();
    }
}

function editGuest(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    const guestCard = document.querySelector(`[data-guest-id="${guestId}"]`);
    const nameElement = guestCard.querySelector('.guest-name');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = guest.name;

    nameElement.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => saveEdit(guest, input, nameElement));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit(guest, input, nameElement);
        else if (e.key === 'Escape') cancelEdit(input, nameElement);
    });
}

function saveEdit(guest, input, nameElement) {
    const newName = input.value.trim();
    if (newName) {
        guest.name = newName;
        showToast('Guest Updated!', 'success');
    }
    input.replaceWith(nameElement);
    nameElement.textContent = guest.name;
    updateUI();
}

function cancelEdit(input, nameElement) {
    input.replaceWith(nameElement);
}

function updateUI() {
    guestStats.textContent = `${guests.filter(g => g.rsvpStatus === 'Attending').length} attending • ${guests.length}/${MAX_GUESTS} guests`;
    guestList.innerHTML = guests.length ? renderGuestList() : '<p>No guests added.</p>';
    addGuestBtn.disabled = guests.length >= MAX_GUESTS;
}

function renderGuestList() {
    return guests.map(guest => `
        <div class="guest-card" data-guest-id="${guest.id}">
            <span class="guest-name">${guest.name}</span>
            <span>${guest.category}</span>
            <span>${guest.rsvpStatus}</span>
            <button onclick="toggleRSVP(${guest.id})">Toggle RSVP</button>
            <button onclick="editGuest(${guest.id})">Edit</button>
            <button onclick="removeGuest(${guest.id})">Remove</button>
        </div>
    `).join('');
}

function showToast(message, type) {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
