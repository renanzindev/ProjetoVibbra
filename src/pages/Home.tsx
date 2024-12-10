import React from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, Info, Plus } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1>Welcome to Vibbraneo ToDo List</h1>
          <p>Create, manage, and share your todo lists with ease</p>
        </div>

        <div className="features">
          <div className="card">
            <div className="card-header">
              <Plus className="icon-blue" />
              <h2>Create New List</h2>
            </div>
            <p>
              Start a new todo list by visiting any URL. The URL will become your unique list identifier.
            </p>
            <Link to="/new" className="button button-primary">
              Create List
            </Link>
          </div>

          <div className="card">
            <div className="card-header">
              <ListTodo className="icon-green" />
              <h2>Edit Existing List</h2>
            </div>
            <p>
              Access your existing todo list by visiting its URL. Share the URL with others to collaborate.
            </p>
            <p className="example-url">
              Example: https://yourdomain.com/any-unique-identifier
            </p>
          </div>
        </div>

        <div className="about">
          <div className="card-header">
            <Info className="icon-purple" />
            <h2>About</h2>
          </div>
          <div className="about-content">
            <p>
              Vibbraneo ToDo List is a collaborative tool that allows you to:
            </p>
            <ul>
              <li>Create and manage hierarchical todo lists</li>
              <li>Share lists with colleagues via URL</li>
              <li>Organize items with sub-items</li>
              <li>Edit and delete items easily</li>
              <li>Collaborate in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};