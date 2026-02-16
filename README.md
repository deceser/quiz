# React Quiz App

Приложение для прохождения квиза по React.js с сохранением результатов в Supabase.

## Возможности

- Форма регистрации ученика (имя и фамилия)
- Интерактивный квиз с 10 вопросами по React.js
- Визуальная обратная связь (правильные/неправильные ответы)
- Сохранение всех ответов в базу данных Supabase
- Отображение итогового результата с именем ученика
- Детальная статистика по каждому вопросу

## Технологии

- React 18
- Bootstrap 5
- Supabase (база данных и хранение)
- Context API (управление состоянием)

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Supabase

Следуйте инструкциям в файле [SUPABASE_SETUP.md](SUPABASE_SETUP.md) для:
- Создания проекта в Supabase
- Создания таблиц базы данных
- Получения API ключей
- Настройки `.env.local`

### 3. Запуск приложения

```bash
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере.

## Структура проекта

```
src/
├── components/
│   ├── Start.js      # Форма регистрации
│   ├── Quiz.js       # Компонент квиза
│   └── Result.js     # Страница результатов
├── context/
│   └── dataContext.js # Управление состоянием + Supabase логика
├── lib/
│   └── supabaseClient.js # Конфигурация Supabase
└── App.js
```

## База данных

### Таблицы

1. `quiz_sessions` - хранит информацию о каждом прохождении квиза
2. `quiz_answers` - детальные ответы на каждый вопрос

Подробнее в [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
