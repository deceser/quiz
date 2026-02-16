import React, { useContext, useState } from 'react';
import DataContext from '../context/dataContext';

const Start = () => {
    const {startQuiz, showStart, setStudentInfo, isCompleted} = useContext(DataContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isCompleted) {
            setError('Вы уже прошли этот тест. Повторное прохождение запрещено.');
            return;
        }

        if (!firstName.trim() || !lastName.trim()) {
            setError('Пожалуйста, заполните оба поля');
            return;
        }

        setLoading(true);
        setError('');

        const success = await setStudentInfo(firstName.trim(), lastName.trim());
        
        if (success) {
            startQuiz();
        } else {
            setError('Ошибка создания сессии. Проверьте настройки Supabase или вы уже прошли тест.');
        }
        
        setLoading(false);
    };

    return (
        <section className='text-white text-center bg-dark' style={{ display: `${showStart ? 'block' : 'none'}` }}>
            <div className="container">
                <div className="row vh-100 align-items-center justify-content-center">
                    <div className="col-lg-6">
                        <h1 className='fw-bold mb-4'>Квиз по React JS</h1>
                        <form onSubmit={handleSubmit} className="text-start">
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Имя</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Введите ваше имя"
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Фамилия</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Введите вашу фамилию"
                                    disabled={loading}
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button 
                                type="submit" 
                                className="btn px-4 py-2 bg-light text-dark fw-bold w-100"
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : 'Начать квиз'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Start;