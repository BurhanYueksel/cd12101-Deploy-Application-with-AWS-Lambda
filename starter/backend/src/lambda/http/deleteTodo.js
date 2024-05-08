import { deleteTodo } from '../dataLayer/todosAccess';

export async function handler(event) {
  const { todoIds } = JSON.parse(event.body);

  await Promise.all(todoIds.map(todoId => deleteTodo(todoId)));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: 'TODOs deleted successfully'
    })
  };
}