import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataContext from '../context/dataContext';
import { STUDENTS_LIST } from '../constants/students';

const Start = () => {
  const { startQuiz, showStart, setStudentInfo, isCompleted } = useContext(DataContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCompleted) {
      setError('Ви вже пройшли цей тест. Повторне проходження заборонено.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Будь ласка, заповніть обидва поля');
      return;
    }

    // Валидация по журналу
    const isValidStudent = STUDENTS_LIST.some(
      (student) => student.firstName === firstName.trim() && student.lastName === lastName.trim(),
    );

    if (!isValidStudent) {
      setError("Ваше ім'я відсутнє в журналі. Перевірте правильність написання.");
      return;
    }

    setError('');
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    const result = await setStudentInfo(firstName.trim(), lastName.trim());

    if (result.success) {
      startQuiz();
    } else if (result.reason === 'already_authorized') {
      setError('Вже авторизовано під цим іменем. Хтось інший зараз проходить тест.');
    } else {
      setError('Помилка створення сесії. Перевірте налаштування Supabase або ви вже пройшли тест.');
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: showStart ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: window.innerWidth <= 480 ? '24px' : window.innerWidth <= 768 ? '36px' : '48px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    maxWidth: '500px',
    width: '100%',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '14px 20px',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    width: '100%',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={cardStyle}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            color: '#fff',
            marginBottom: '40px',
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: '700',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
          Квіз з Python
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '24px' }}>
            <label
              style={{ color: '#fff', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
              Ім'я
            </label>
            <input
              type="text"
              style={inputStyle}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Введіть ваше ім'я"
              disabled={loading}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '24px' }}>
            <label
              style={{ color: '#fff', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
              Прізвище
            </label>
            <input
              type="text"
              style={inputStyle}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Введіть ваше прізвище"
              disabled={loading}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  },
                }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                style={{
                  background: 'rgba(220, 53, 69, 0.9)',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
                }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}>
                  ⚠️ {error}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)' }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}>
            {loading ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                ⏳ Завантаження...
              </motion.span>
            ) : (
              '🚀 Розпочати квіз'
            )}
          </motion.button>
        </form>

        {/* Модальное окно подтверждения */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
              }}
              onClick={handleCancel}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '40px',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '60px', marginBottom: '20px' }}>
                  🤔
                </motion.div>

                <h3
                  style={{
                    color: '#333',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '16px',
                  }}>
                  Підтвердження
                </h3>

                <p
                  style={{
                    color: '#666',
                    fontSize: '18px',
                    marginBottom: '10px',
                  }}>
                  Ви впевнені, що ви:
                </p>

                <p
                  style={{
                    color: '#667eea',
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '30px',
                  }}>
                  {firstName} {lastName}?
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    style={{
                      flex: 1,
                      background: 'rgba(220, 53, 69, 0.1)',
                      border: '2px solid #dc3545',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#dc3545',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    ❌ Ні, змінити
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirm}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    }}>
                    ✅ Так, це я
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Start;
