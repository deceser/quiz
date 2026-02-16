import React, { useContext } from 'react';
import DataContext from '../context/dataContext';

const Result = () => {
    const { showResult, studentName, studentSurname }  = useContext(DataContext);
    
    return (
        <section className="bg-dark text-white" style={{ display: `${showResult ? 'block' : 'none'}` }}>
            <div className="container">
                <div className="row vh-100 align-items-center justify-content-center">
                    <div className="col-lg-6">
                        <div className="text-center p-5 rounded" style={{ background: '#3d3d3d', borderColor: '#646464' }}>
                            <div className="mb-4" style={{ fontSize: '4rem' }}>✅</div>
                            
                            <h2 className='mb-4 fw-normal'>
                                Спасибо, {studentName} {studentSurname}!
                            </h2>
                            
                            <p className="lead mb-4" style={{ color: '#b0b0b0' }}>
                                Вы успешно прошли тест.<br/>
                                Ваши ответы сохранены.
                            </p>
                            
                            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #555' }}>
                                <p className="mb-0" style={{ color: '#888', fontSize: '0.95rem' }}>
                                    Вы можете закрыть эту страницу.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Result;