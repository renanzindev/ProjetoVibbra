import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Trash2 } from 'lucide-react';
import { TodoList } from '../components/TodoList';
import { useTodoStore } from '../store/todoStore';

export const TodoPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { 
    currentList,
    isLoading, 
    error,
    loadList,
    createList,
    deleteList
  } = useTodoStore();

  useEffect(() => {
    const initList = async () => {
      try {
        await loadList(id);
      } catch (error) {
        // Se a lista não existir, cria uma nova
        await createList('My Todo List');
      }
    };

    initList();
  }, [id, loadList, createList]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo list?')) {
      await deleteList(id);
      navigate('/');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentList) {
    return <div className="error">List not found</div>;
  }

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-header">
          <h1 className="todo-title">{currentList.title}</h1>
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

        <TodoList listId={id} />
      </div>
    </div>
  );
}