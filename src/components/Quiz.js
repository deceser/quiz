import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataContext from '../context/dataContext';

const Quiz = () => {
    const { showQuiz, question, quizs, checkAnswer, correctAnswer,
            selectedAnswer, questionIndex, nextQuestion, showTheResult, isCompleted } = useContext(DataContext);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: showQuiz && !isCompleted ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: window.innerWidth <= 480 ? '20px' : window.innerWidth <= 768 ? '30px' : '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        maxWidth: '800px',
        width: '100%'
    };

    const progressStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '16px'
    };

    const optionStyle = (isSelected) => ({
        background: isSelected 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(255, 255, 255, 0.15)',
        border: isSelected 
            ? '2px solid rgba(255, 255, 255, 0.6)'
            : '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '18px 24px',
        color: '#fff',
        fontSize: '16px',
        cursor: isCompleted ? 'not-allowed' : 'pointer',
        width: '100%',
        textAlign: 'left',
        marginTop: '12px',
        transition: 'all 0.3s ease',
        fontWeight: isSelected ? '600' : '500',
        boxShadow: isSelected ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
    });

    const buttonStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '16px',
        padding: '16px',
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: !selectedAnswer || isCompleted ? 'not-allowed' : 'pointer',
        width: '100%',
        marginTop: '24px',
        opacity: !selectedAnswer || isCompleted ? 0.5 : 1,
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    };

    return (
        <div style={containerStyle}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    style={cardStyle}
                >
                    <motion.div 
                        style={progressStyle}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ 
                                fontSize: '14px', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '8px',
                                fontWeight: '500'
                            }}>
                                Прогрес
                            </div>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                height: '8px',
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: `${((questionIndex + 1) / quizs?.length) * 100}%` 
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        background: 'linear-gradient(90deg, #60d600 0%, #4ade80 100%)',
                                        height: '100%',
                                        borderRadius: '10px'
                                    }}
                                />
                            </div>
                        </div>
                        <motion.div 
                            style={{ 
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#60d600',
                                marginLeft: '20px',
                                minWidth: '80px',
                                textAlign: 'right'
                            }}
                            key={`${questionIndex}-counter`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                        >
                            {quizs.indexOf(question) + 1} / {quizs?.length}
                        </motion.div>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            color: '#fff',
                            fontSize: '22px',
                            fontWeight: '600',
                            lineHeight: '1.5',
                            marginBottom: '24px'
                        }}
                    >
                        {question?.question}
                    </motion.h3>

                    <div>
                        {question?.options?.map((item, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                style={optionStyle(selectedAnswer === item)}
                                onClick={(event) => checkAnswer(event, item)}
                                disabled={isCompleted}
                                whileHover={{ 
                                    scale: isCompleted ? 1 : 1.02,
                                    boxShadow: isCompleted ? 'none' : '0 4px 15px rgba(255, 255, 255, 0.2)'
                                }}
                                whileTap={{ scale: isCompleted ? 1 : 0.98 }}
                            >
                                <span style={{ marginRight: '12px', fontSize: '18px' }}>
                                    {selectedAnswer === item ? '✓' : String.fromCharCode(65 + index)}
                                </span>
                                {item}
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        style={buttonStyle}
                        onClick={(questionIndex + 1) !== quizs.length ? nextQuestion : showTheResult}
                        disabled={!selectedAnswer || isCompleted}
                        whileHover={{ 
                            scale: !selectedAnswer || isCompleted ? 1 : 1.02,
                            boxShadow: !selectedAnswer || isCompleted 
                                ? '0 4px 15px rgba(102, 126, 234, 0.4)' 
                                : '0 6px 20px rgba(102, 126, 234, 0.6)'
                        }}
                        whileTap={{ scale: !selectedAnswer || isCompleted ? 1 : 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: !selectedAnswer || isCompleted ? 0.5 : 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {(questionIndex + 1) !== quizs.length 
                            ? '➡️ Наступне питання' 
                            : '🎯 Показати результат'}
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Quiz;