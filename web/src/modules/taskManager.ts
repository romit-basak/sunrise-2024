
import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";



let tasks: Task[] = [...initialTasks];

export function initializeTasks() {
	tasks[0].completed = false;
}

export function getActiveTasks(): Task[] {
	const currentGroup = getCurrentActiveGroup();
	return tasks.filter(task => !task.completed && task.group === currentGroup);
}

export function getCompletedTasks(): Task[] {
	return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
	return tasks;
}

export function completeTask(taskTitle: string): void {
	const taskToComplete = tasks.find(task => task.title === taskTitle);
	if (taskToComplete && !taskToComplete.completed) {
		taskToComplete.completed = true;

		// Check if all tasks in the current group are completed
		const group = taskToComplete.group;
		const allTasksInGroup = tasks.filter(task => task.group === group);
		const allCompleted = allTasksInGroup.every(task => task.completed);

		// If all tasks in the group are completed, activate the next group's tasks
		if (allCompleted) {
			const nextGroup = group + 1;
			const nextGroupTasks = tasks.filter(task => task.group === nextGroup);
			if (nextGroupTasks.length > 0) {
				nextGroupTasks.forEach(task => task.completed = false); // Activate all tasks of the next group
			}
		}
	}
}

export function createTask(title: string, description: string, persona: string, group: number): void {
	const newTaskId = tasks.length + 1;
	const newTask = new Task(newTaskId, title, description, persona, group);
	tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
	const taskIndex = tasks.findIndex(task => task.id === taskId);
	if (taskIndex !== -1) {
		tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
	}
}

export function deleteTask(taskId: number): void {
	tasks = tasks.filter(task => task.id !== taskId);
}

function getCurrentActiveGroup(): number {
	let currentGroup = 1;
	for (const task of tasks) {
		if (task.completed && task.group >= currentGroup) {
			currentGroup = task.group;
		}
	}
	const allTasksInCurrentGroupCompleted = tasks.filter(task => task.group === currentGroup).every(task => task.completed);
	return allTasksInCurrentGroupCompleted ? currentGroup + 1 : currentGroup;
}