import { getUserId } from '../auth/utils';
import { createTodo, getTodoById, getTodosByUserId, updateTodo, deleteTodo } from '../dataLayer/todosAccess';

export async function createTodoItem(todoData, event) {
  const userId = getUserId(event);

  const newTodo = {
    ...todoData,
    userId,
    createdAt: new Date().toISOString(),
    done: false
  };

  await createTodo(newTodo);

  return newTodo;
}

export async function getTodoItem(todoId) {
  return await getTodoById(todoId);
}

export async function getTodoItems(event) {
  const userId = getUserId(event);

  return await getTodosByUserId(userId);
}

export async function updateTodoItem(todoId, todoData) {
  const updatedTodo = {
    ...todoData,
    todoId
  };

  return await updateTodo(updatedTodo);
}

export async function deleteTodoItem(todoId) {
  return await deleteTodo(todoId);
}
