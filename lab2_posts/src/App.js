import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // Состояния компонента
  const [posts, setPosts] = useState([]); // Массив постов
  const [newPost, setNewPost] = useState(''); // Текст нового поста
  const [error, setError] = useState(''); // Сообщение об ошибке
  const [postCounter, setPostCounter] = useState(1); // Счетчик для уникальных ID

  // useRef для доступа к DOM элементу поля ввода
  const inputRef = useRef(null);

  // useEffect для установки фокуса при загрузке компонента
  useEffect(() => {
    // Этот эффект выполняется только один раз после первого рендера
    console.log('Компонент загружен, устанавливаем фокус на поле ввода');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Пустой массив зависимостей означает "выполнить только один раз"

  // useEffect для отслеживания изменений в списке постов
  useEffect(() => {
    console.log(`Количество постов изменилось: ${posts.length}`);
    
    // Этот эффект срабатывает каждый раз, когда изменяется массив posts
    if (posts.length > 0) {
      document.title = `Посты (${posts.length})`;
    } else {
      document.title = 'Страница с постами';
    }
  }, [posts]); // Эффект зависит от состояния posts

  // useEffect для автоматической очистки ошибки через 3 секунды
  useEffect(() => {
    if (error) {
      console.log('Показана ошибка, устанавливаем таймер для очистки');
      
      const timer = setTimeout(() => {
        setError('');
        console.log('Ошибка очищена автоматически');
      }, 3000);

      // Функция очистки - выполняется при размонтировании или перед следующим вызовом эффекта
      return () => {
        console.log('Очищаем таймер');
        clearTimeout(timer);
      };
    }
  }, [error]); // Эффект зависит от состояния error

  // Функция добавления нового поста
  const addPost = () => {
    // Проверяем, что поле не пустое (убираем пробелы с начала и конца)
    const trimmedPost = newPost.trim();
    
    if (!trimmedPost) {
      setError('Нельзя добавить пустой пост!');
      return;
    }

    // Создаем новый пост с уникальным ID
    const post = {
      id: postCounter,
      text: trimmedPost,
      timestamp: new Date().toLocaleString('ru-RU')
    };

    // Добавляем пост в начало массива (новые посты сверху)
    setPosts(prevPosts => [post, ...prevPosts]);
    
    // Очищаем поле ввода
    setNewPost('');
    
    // Очищаем ошибку, если она была
    setError('');
    
    // Увеличиваем счетчик для следующего поста
    setPostCounter(prev => prev + 1);
    
    // Возвращаем фокус на поле ввода для удобства
    if (inputRef.current) {
      inputRef.current.focus();
    }

    console.log('Добавлен новый пост:', post);
  };

  // Функция удаления поста
  const deletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    console.log('Удален пост с ID:', postId);
  };

  // Обработчик изменения текста в поле ввода
  const handleInputChange = (e) => {
    setNewPost(e.target.value);
    
    // Очищаем ошибку при вводе текста
    if (error) {
      setError('');
    }
  };

  // Обработчик нажатия клавиши Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPost();
    }
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <h1 className="lab-title">
          Лабораторная работа №2: Создание страницы с постами
        </h1>

        {/* Форма добавления поста */}
        <div className="post-form">
          <h2 className="form-title">
            Создание нового поста
          </h2>
          
          <div>
            <textarea
              ref={inputRef} // Привязываем ref к элементу
              value={newPost}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Что у вас нового?..."
              className="post-textarea"
              rows="3"
            />
            
            {/* Показываем ошибку, если она есть */}
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
          </div>
            
            {/* Статистика */}
          <div className="post-controls">
              <span>Всего постов: <strong>{posts.length}</strong></span>
              <span>Следующий ID: <strong>{postCounter}</strong></span>
            <button
                onClick={addPost}
                className="add-post-button"
              >
                Добавить пост
              </button>
          </div>
        </div>
        

        {/* Список постов */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Пока нет постов
              </h3>
              <p className="text-gray-500">
                Добавьте свой первый пост, чтобы начать!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed mb-2">
                      {post.text}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>🕒 {post.timestamp}</span>
                      <span>🆔 ID: {post.id}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deletePost(post.id)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 text-sm"
                    title="Удалить пост"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
