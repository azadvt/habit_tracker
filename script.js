const habitInput = document.getElementById('habit-input');
const addHabitButton = document.getElementById('add-habit');
const habitList = document.getElementById('habit-list');
const currentDatetime = document.getElementById('current-datetime');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function updateCurrentDateTime() {
	const now = new Date();
	const options = {
		month: '2-digit',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};
	const formattedDate = now.toLocaleString('en-US', options);
	currentDatetime.innerText = formattedDate;
}

function renderHabits() {
	habitList.innerHTML = '';
	const now = new Date();
	const month = now.getMonth();
	const year = now.getFullYear();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	habits.forEach((habit, index) => {
		const habitDiv = document.createElement('div');
		habitDiv.className = 'habit';
		habitDiv.innerHTML = `
            <h3>${habit.name}</h3>
            <div class="habit-table-container" id="table-container-${index}">
                <table class="habit-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            ${Array.from(
															{ length: daysInMonth },
															(_, i) => `<th>${i + 1}</th>`
														).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Completed</strong></td>
                            ${Array.from(
															{ length: daysInMonth },
															(_, i) => `
                                <td>
                                    <input type="checkbox" ${
																			habit.days[i] ? 'checked' : ''
																		} data-index="${index}" data-day="${i}">
                                </td>
                            `
														).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
		habitList.appendChild(habitDiv);

		const tableContainer = document.getElementById(`table-container-${index}`);
		tableContainer.addEventListener('wheel', (event) => {
			event.preventDefault();
			tableContainer.scrollLeft += event.deltaY;
		});
	});

	document.querySelectorAll('.delete-button').forEach((button) => {
		button.addEventListener('click', (event) => {
			const habitIndex = event.target.dataset.index;
			habits.splice(habitIndex, 1);
			localStorage.setItem('habits', JSON.stringify(habits));
			renderHabits();
		});
	});

	document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
		checkbox.addEventListener('change', (event) => {
			const habitIndex = event.target.dataset.index;
			const dayIndex = event.target.dataset.day;
			habits[habitIndex].days[dayIndex] = event.target.checked;
			localStorage.setItem('habits', JSON.stringify(habits));
		});
	});
}

addHabitButton.addEventListener('click', () => {
	const habitName = habitInput.value.trim();
	if (habitName) {
		const daysInMonth = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			0
		).getDate();
		habits.push({
			name: habitName,
			days: Array(daysInMonth).fill(false),
		});
		localStorage.setItem('habits', JSON.stringify(habits));
		habitInput.value = '';
		renderHabits();
	}
});

updateCurrentDateTime();
setInterval(updateCurrentDateTime, 60000);
renderHabits();
