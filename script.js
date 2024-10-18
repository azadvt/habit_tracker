const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const clearCompletedButton = document.getElementById('clear-completed');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function renderHabits() {
	habitList.innerHTML = '';
	habits.forEach((habit, index) => {
		const li = document.createElement('li');
		li.textContent = habit.name;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = habit.completed;
		checkbox.addEventListener('change', () => {
			habit.completed = checkbox.checked;
			saveHabits();
			renderHabits();
		});

		if (habit.completed) {
			li.classList.add('completed');
		}

		li.appendChild(checkbox);
		habitList.appendChild(li);
	});
}

function saveHabits() {
	localStorage.setItem('habits', JSON.stringify(habits));
}

habitForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const newHabit = { name: habitInput.value, completed: false };
	habits.push(newHabit);
	habitInput.value = '';
	saveHabits();
	renderHabits();
});

clearCompletedButton.addEventListener('click', () => {
	habits = habits.filter((habit) => !habit.completed);
	saveHabits();
	renderHabits();
});

renderHabits(); // Initial render
