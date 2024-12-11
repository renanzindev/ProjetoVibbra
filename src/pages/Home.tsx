import React from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, Info, Plus } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1>ToDo List</h1>
          <p>Crie, gerencie e compartilhe suas listas de tarefas com facilidade</p>
        </div>

        <div className="features">
          <div className="card">
            <div className="card-header">
              <Plus className="icon-blue" />
              <h2>Criar Nova Lista</h2>
            </div>
            <p>
            Comece uma nova lista de tarefas visitando qualquer URL. O URL se tornará seu identificador exclusivo da lista.
            </p>
            <Link to="/new" className="button button-primary">
              Criar Lista
            </Link>
          </div>

          <div className="card">
            <div className="card-header">
              <ListTodo className="icon-green" />
              <h2>Editar lista existente</h2>
            </div>
            <p>
            Acesse sua lista de tarefas existente visitando seu URL. Compartilhe o URL com outras pessoas para colaborar.
            </p>
            <p className="example-url">
              Examplo: https://yourdomain.com/any-unique-identifier
            </p>
          </div>
        </div>

        <div className="about">
          <div className="card-header">
            <Info className="icon-purple" />
            <h2>Sobre</h2>
          </div>
          <div className="about-content">
            <p>
              ToDo List é uma ferramenta colaborativa que permite:            </p>
            <ul>
              <li>Crie e gerencie listas de tarefas hierárquicas</li>
              <li>Compartilhe listas com colegas via URL</li>
              <li>Organize itens com subitens</li>
              <li>Edite e exclua itens facilmente</li>
              <li>Colabore em tempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};