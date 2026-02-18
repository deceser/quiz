import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import DataContext from '../context/dataContext';

const Result = () => {
  const { showResult, studentName, studentSurname } = useContext(DataContext);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: showResult ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: window.innerWidth <= 480 ? '30px 20px' : window.innerWidth <= 768 ? '45px 30px' : '60px 40px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  };

  const confettiVariants = {
    hidden: { opacity: 0, y: -20, scale: 0 },
    visible: (i) => ({
      opacity: [0, 1, 1, 0],
      y: [0, -30, 100],
      x: [(i % 2 === 0 ? 1 : -1) * (Math.random() * 100 - 50)],
      scale: [0, 1.5, 1, 0.5],
      rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.6 
        }}
        style={cardStyle}
      >
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={confettiVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                fontSize: '24px',
                zIndex: 1
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '🌟', '💫'][i]}
            </motion.div>
          ))}
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            style={{
              fontSize: window.innerWidth <= 480 ? '60px' : window.innerWidth <= 768 ? '80px' : '100px',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 2
            }}
          >
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              🏆
            </motion.span>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: '#fff',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          Вітаємо!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '500',
            marginBottom: '30px'
          }}
        >
          {studentName} {studentSurname}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px'
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6'
            }}
          >
            <motion.p
              style={{ marginBottom: '12px', fontWeight: '600' }}
            >
              ✅ Ви успішно завершили тест
            </motion.p>
            <motion.p
              style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}
            >
              📝 Ваші відповіді збережено
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '24px'
          }}
        >
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px'
            }}
          >
            Ви можете закрити цю сторінку
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Result;
