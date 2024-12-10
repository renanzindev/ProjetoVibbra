import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Trash2 } from 'lucide-react';
import { TodoList } from '../components/TodoList';
import { useTodoStore } from '../store/todoStore';

export const TodoPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { todos, addTodo, deleteTodo } = useTodoStore();

  useEffect(() => {
    if (id && !todos[id]) {
      addTodo(id);
    }
  }, [id, todos, addTodo]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo list?')) {
      deleteTodo(id);
      navigate('/');
    }
  };

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-header">
          <h1 className="todo-title">Todo List</h1>
          <div className="todo-actions">
            <button onClick={handleShare} className="todo-button todo-button-blue">
              <Share2 className="icon" />
              Share
            </button>
            <button onClick={handleDelete} className="todo-button todo-button-red">
              <Trash2 className="icon" />
              Delete
            </button>
          </div>
        </div>

        <TodoList todoId={id} />
      </div>
    </div>
  );
};